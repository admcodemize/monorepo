import { httpAction } from "../../_generated/server";
import { internal } from "../../_generated/api";
import { Id } from "../../_generated/dataModel";
import { 
  IntegrationAPICalendarAccessRoleEnum, 
  IntegrationAPIGoogleCalendarChannelWatchProps, 
  IntegrationAPIGoogleCalendarColorsProps, 
  IntegrationAPIGoogleCalendarEventProps, 
  IntegrationAPIGoogleCalendarEventsProps, 
  IntegrationAPICalendarEventStatusEnum, 
  IntegrationAPICalendarEventTypeEnum, 
  IntegrationAPIGoogleCalendarListProps, 
  IntegrationAPIGoogleCalendarTokenExchangeProps, 
  ConvexActionReturnProps, 
  ConvexActionServerityEnum, 
  ConvexEventsAPIProps, 
  EncryptedTokenProps, 
  ConvexCalendarAPIProps,
  ConvexCalendarWatchAPIProps,
  ConvexLinkedAPIProps,
  IntegrationAPIGoogleCalendarListItemProps,
  IntegrationAPICalendarVisibilityEnum,
} from "../../../Types";
import { convertEventGoogleToConvex, convertToCleanObjectForUpdate, safeParse } from "../../../Convert";
import { convexError, ConvexHandlerError, convexResponse, fetchTypedConvex
 } from "../../../Fetch";
import { ConvexError } from "convex/values";

const PROVIDER = "oauth_google";

/** 
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.21
 * @version 0.0.1
 * @description The convex context for the http actions used for outsourced functions
 * @type */
type ConvexHttpCtx = Parameters<Parameters<typeof httpAction>[0]>[0];
type ConvexCtx = Pick<ConvexHttpCtx, 'runAction' | 'runQuery' | 'runMutation'>;

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.21
 * @version 0.0.1
 * @type */
type UnlinkCalendarProps = {
  userId: Id<"users">;
  calendar: ConvexCalendarAPIProps;
  refreshToken: EncryptedTokenProps;
  watch: ConvexCalendarWatchAPIProps;
}

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH
 * @since 0.0.21
 * @version 0.0.1
 * @type */
type CreateCalendarProps = {
  userId: Id<"users">;
  calendar: IntegrationAPIGoogleCalendarListItemProps;
  providerId: string;
  refreshToken: EncryptedTokenProps;
}

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH
 * @since 0.0.21
 * @version 0.0.1
 * @type */
type ChannelWatchListProps = {
  userId: Id<"users">;
  providerId: string;
}

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH
 * @since 0.0.21
 * @version 0.0.1
 * @description The naming of the properties needs to be shortend because of the maximal length of the channel token!
 * @type */
type ChannelWatchEventsProps = {
  u: Id<"users">;
  p: string;
  c: Id<"calendar">;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH
 * @since 0.0.9
 * @version 0.0.2
 * @description Handles the http action for linking a google account
 * @type */
export type HttpActionLinkGoogleProps = {
  serverAuthCode: string;
  googleUser: { id: string; email: string };
  userId: Id<"users">;
  grantScopeGmail: boolean;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH
 * @since 0.0.9
 * @version 0.0.3
 * @description Handles the http action for linking a google account
 * @param {Object} param0
 * @param {string} param0.userId - User identification
 * @param {string} param0.provider - Oauth provider which has been used for the authentication flow
 * @param {string} param0.providerId - Provider identification
 * @param {string} param0.email - Email-address by oauth provider or email authentication
 * @param {array} param0.scopes - Scopes which have been used for the authentication flow
 * @param {string} param0.refreshToken - Refresh token for the authentication flow 
 * @function */
export const httpActionGoogleExchange = httpAction(async ({ runMutation, runAction, runQuery }, req) => {
  if (!process.env.PROVIDER_GOOGLE_WEB_CLIENT_ID || !process.env.PROVIDER_GOOGLE_WEB_CLIENT_SECRET) return new Response(JSON.stringify({
    hasErr: true,
    data: null,
    message: {
      statusCode: 500,
      info: "i18n.convex.http.integrations.google.error.clientIdOrSecretNotFound",
      severity: ConvexActionServerityEnum.ERROR,
      name: "BLOXIE_HAR_E01",
    },
  }));

  /** 
   * @description Get the server auth code, google user and user id from the request for further processing
   * -> Register a new linked account or update an existing linked account
   * -> Starting the channel watch for the calendar -> For all the integrated calendars the channel watch should be started so that the calendar events can be fetched incrementally */
  const { serverAuthCode, googleUser, userId, grantScopeGmail }: HttpActionLinkGoogleProps = await req.json();

  /** @description Check if the account is already linked */
  let linkedAccount = await runQuery(internal.sync.integrations.query.linkedByProviderId, { userId, provider: PROVIDER, providerId: googleUser.id });

  /** 
   * @description Check if the grant scope gmail is not allowed for a new linked account
   * -> Gmail scope is only allowed for an existing linked account */
  if (!linkedAccount && grantScopeGmail) {
    return new Response(JSON.stringify({
      hasErr: true,
      data: null,
      message: {
        statusCode: 400,
        info: "i18n.convex.http.integrations.google.error.grantScopeGmailNotAllowed",
        severity: ConvexActionServerityEnum.ERROR,
        name: "BLOXIE_HAR_E04",
      },
    }));
  }

  /** 
   * @description Exchange the server auth code for a token
   * -> redirect_uri is the callback URL for the token exchange which is defined in the Google Cloud Console */
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code: serverAuthCode,
      client_id: process.env.PROVIDER_GOOGLE_WEB_CLIENT_ID,
      client_secret: process.env.PROVIDER_GOOGLE_WEB_CLIENT_SECRET,
      grant_type: "authorization_code",
      redirect_uri: "https://harmless-dodo-18.convex.site/integrations/google/oauth/callback",
    }),
  });

  if (!res.ok) return new Response(JSON.stringify({
    hasErr: true,
    data: null,
    message: {
      statusCode: res.status,
      info: await res.text(),
      severity: ConvexActionServerityEnum.ERROR,
      name: "BLOXIE_HAR_E02",
    },
  }));
  
  /** 
   * @description Get the token data from the response which is needed for the token exchange in further requests
   * -> With the refersh_token the access token can be refreshed on demand */
  const { refresh_token, scope }: IntegrationAPIGoogleCalendarTokenExchangeProps = await res.json();
  if (!refresh_token) return new Response(JSON.stringify({
    hasErr: true,
    data: null,
    message: {
      statusCode: 500,
      info: "i18n.convex.http.integrations.google.error.missingRefreshToken",
      severity: ConvexActionServerityEnum.ERROR,
      name: "BLOXIE_HAR_E03",
    },
  }));

  /** @description Encrypt the refresh token for the further process and transfering between the different actions */
  const encryptedRefreshToken = await runAction(internal.sync.integrations.action.encryptedToken,{ token: refresh_token }) as EncryptedTokenProps;

  if (!linkedAccount) {
    /**
     * @description
     * -> Start the channel watch for the calendar lists
     * -> Read all the available calendars for the integrated provider account
     * -> Fetch the events for each calendar (All the future events and 2 years in the past)
     * -> Start the channel watch for each calendar (events)
     * -> Create the calendar information object for each calendar within the integrated provider account
     * -> Create the linked data for the calendar (Overall main database object for integrations) */
    const calendarId: Id<"calendar">[] = [];

    /** @description Start the channel watch for the calendar lists */
    const { data: watchLists }: ConvexActionReturnProps<IntegrationAPIGoogleCalendarChannelWatchProps> = await runAction(internal.sync.integrations.google.action.startWatchCalendarLists, { 
      userId, 
      providerId: googleUser.id,
      refreshToken: encryptedRefreshToken 
    });

    console.log("watchLists:", watchLists);

    /** @description Fetch the specified colors for the calendar events and the calendar lists based on the colorId */
    const { data: colors }: ConvexActionReturnProps<IntegrationAPIGoogleCalendarColorsProps> = await runAction(internal.sync.integrations.google.action.fetchCalendarColors, { refreshToken: encryptedRefreshToken });

    /** @description Fetch the calendar list for the user -> For all the integrated calendars the channel watch should be started so that the calendar events can be fetched incrementally */
    const { data: calendars }: ConvexActionReturnProps<IntegrationAPIGoogleCalendarListProps> = await runAction(internal.sync.integrations.google.action.fetchCalendarList, { refreshToken: encryptedRefreshToken });
    for (let calendar of calendars?.items) {
      /** @description Create the calendar information object for each calendar within the integrated provider account */
      const _id: Id<"calendar"> = await runMutation(internal.sync.integrations.mutation.createCalendar, {
        externalId: calendar.id,
        accessRole: calendar.accessRole as IntegrationAPICalendarAccessRoleEnum,
        backgroundColor: calendar.backgroundColor,
        description: calendar?.description || calendar?.summary,
        foregroundColor: calendar.foregroundColor,
        primary: calendar?.primary || false,
      });

      calendarId.push(_id);

      /** 
       * @description Start the channel watch for the calendar -> This is not needed for the first sync because the initial data is fetched with the fetchCalendarEvents action
       * -> The future handling is controlled by the nextSyncToken which is returned by the google calendar api and will only fetch the newly created events inside the channel watch callback function -> httpActionGoogleWatch */
      const { 
        data: watchEvents, 
        hasErr: hasErrWatch 
      }: ConvexActionReturnProps<IntegrationAPIGoogleCalendarChannelWatchProps> = await runAction(internal.sync.integrations.google.action.startWatchCalendarEvents, { 
        userId, 
        providerId: googleUser.id,
        convexCalendarId: _id,
        refreshToken: encryptedRefreshToken, 
        calendarId: calendar.id,
      });

      /** @description Fetch the calendar events for the calendar */
      const { 
        data: events, 
        hasErr: hasErrEvents 
      }: ConvexActionReturnProps<IntegrationAPIGoogleCalendarEventsProps> = await runAction(internal.sync.integrations.google.action.fetchCalendarEvents, {
        refreshToken: encryptedRefreshToken,
        calendarId: calendar.id,
      });

      // @todo do not add a recurring event 300x in the database, just add the first event and the rest of the recurring events will be added dynamically ..


      if (!hasErrEvents && events?.items) {
        /** @description Exclude birthday events from the creation of the events in the database because they are not relevant for the user */
        for (const event of events.items.filter(
          (item) => item.eventType !== IntegrationAPICalendarEventTypeEnum.BIRTHDAY
        )) await runMutation(internal.sync.events.mutation.create, convertEventGoogleToConvex(
           userId,
           _id,
           calendar.id,
           event as IntegrationAPIGoogleCalendarEventProps,
           colors?.event?.[event.colorId]?.background || calendar.backgroundColor
        ));
      }

      /** 
       * @description Update the calendar watch information
       * -> The watch object is not written to the convex database at the beginning because 
       * the generated convex ID is used for the registration of the calendar watch for the later process flow. */
      if (_id) await runMutation(internal.sync.integrations.mutation.updateCalendar, {
        _id, 
        /** @description Add the watch events to the linked data watch for further determing of the next sync token to check if a calendar events (created, updated, deleted) has been changed */
        watch: !hasErrWatch ? toWatch(watchEvents, events?.nextSyncToken, events?.nextSyncToken) : toWatch({ id: "", resourceId: "", expiration: 0 } as IntegrationAPIGoogleCalendarChannelWatchProps),
        eventsCount: events?.items?.length ?? 0,
        isRelevantForConflictDetection: true,
      });
    }

    /** @description Link the provider to the user and process and carry out further configurations for the google provider */
    await runMutation(internal.sync.integrations.mutation.createLinked, {
      userId,
      provider: PROVIDER,
      providerId: googleUser.id,
      calendarId: calendarId,
      email: googleUser.email,
      scopes: scope ? scope.split(" ") : [],
      refreshToken: encryptedRefreshToken,
      /** @description Add the watch list to the linked data watch for further determing of the next sync token to check if a calendar list settings (visibility, color, etc.) has been changed */
      watch: toWatch(watchLists, calendars?.nextSyncToken, calendars?.nextSyncToken)
    });

    return new Response(JSON.stringify({
      hasErr: false,
      data: calendarId,
      message: {
        statusCode: 200,
        info: "i18n.convex.http.integrations.google.success.linked",
      },
    }));
  }

  /** 
   * @description Update the linked account with the new refresh token, scopes and has mail permission
   * -> Is called when for example a google account has already been registered and the user additionally grants the permission to send emails via the google provider */
  await runMutation(internal.sync.integrations.mutation.updateLinked, {
    _id: linkedAccount._id,
    calendarId: linkedAccount.calendarId,
    refreshToken: encryptedRefreshToken,
    scopes: scope ? scope.split(" ") : [],
    hasMailPermission: scope?.includes("https://www.googleapis.com/auth/gmail.send")
  });

  return new Response(JSON.stringify({
    hasErr: false,
    data: null,
    message: {
      statusCode: 200,
      info: "i18n.convex.http.integrations.google.success.linked",
    },
  }));
});

/**
 * @public
 * @since 0.0.14
 * @version 0.0.1
 * @description Handles the http action for unlinking a google account and deleting all the linked data for the google provider
 * @function */
export const httpActionGoogleUnlink = httpAction(async ({ runMutation, runAction, runQuery }, req) => {
  const { userId, providerId } = await req.json();

  /** @description Get the linked account for the user and provider */
  const linkedAccount: ConvexLinkedAPIProps|null = await runQuery(internal.sync.integrations.query.linkedByProviderId,{ userId, provider: PROVIDER, providerId });
  if (!linkedAccount) return new Response(JSON.stringify({
    hasErr: true,
    data: null,
    message: {
      statusCode: 404,
      info: "i18n.convex.http.integrations.google.error.linkedAccountNotFound",
    },
  }));

  /** @description Stop the channel watch for the calendar lists so that the calendar events can not be fetched or updated incrementally anymore */
  const { hasErr, data, message } = await runAction(internal.sync.integrations.google.action.stopChannelWatch, { 
    channelId: linkedAccount.watch.id, 
    resourceId: linkedAccount.watch.resourceId, 
    refreshToken: linkedAccount.refreshToken 
  });

  /** 
   * @description Collect all the events for a given provider and calendarid and remove them all from the database
   * -> Use case: After a user unlinks a google account, all the events for the linked account should be deleted so that no chunks of events are left over */
  for (const calendarId of linkedAccount.calendarId) {
    const calendar: ConvexCalendarAPIProps|null = await runQuery(internal.sync.integrations.query.calendarById, { _id: calendarId as Id<"calendar"> });
    if (!calendar) continue;

    /** @description Remove all the events for the given calendar id from the database */
    const events: ConvexEventsAPIProps[] = await runQuery(internal.sync.events.query.byExternalCalendarId, { userId, externalCalendarId: calendar.externalId });
    for (const event of events) await runMutation(internal.sync.events.mutation.remove, { _id: event._id });

    /** @description Remove the calendar information for the linked account from the database */
    await runMutation(internal.sync.integrations.mutation.removeCalendar, { _id: calendar._id });
  }

  /** @description Finally remove the linked account from the database */
  await runMutation(internal.sync.integrations.mutation.removeLinked, { _id: linkedAccount._id });

  /** @description Revoke the refresh token for the linked account */
  const decryptedRefreshToken = await runAction(internal.sync.integrations.action.decryptedToken, { encryptedToken: linkedAccount.refreshToken });
  await fetch("https://oauth2.googleapis.com/revoke", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      token: decryptedRefreshToken,
      token_type_hint: "refresh_token",
    }),
  });

  return new Response(JSON.stringify({
    hasErr: false,
    data: JSON.stringify({ channelWatch: { hasErr, data, message }}),
    message: {
      statusCode: 200,
      info: "i18n.convex.http.integrations.google.success.unlinked",
      severity: ConvexActionServerityEnum.SUCCESS,
      name: "BLOXIE_HAR_S04",
    },
  }));
});

/**
 * @public
 * @since 0.0.14
 * @version 0.0.1
 * @description Handles the http action for sending an email via the google provider
 * @function */
export const httpActionGoogleSend = httpAction(async ({ runAction }, req) => {
  const { userId } = await req.json();
  return new Response(JSON.stringify({
    hasErr: false,
    data: null,
    message: {
      info: "i18n.convex.http.integrations.google.success.send",
    },
  }), { status: 200 });
});







/**
 * @public
 * @since 0.0.10
 * @version 0.0.2
 * @description Handles the http action for watching a google calendar
 * @todo 
 * Wenn x-goog-channel-expiration überschritten ist oder Google deinen syncToken mit 410 (Gone) ablehnt, musst du den Watch komplett neu aufsetzen. Es gibt keinen versteckten „Refresh“, du wiederholst simpel den ursprünglichen Flow:
   -Alten Watch sauber stoppen
   POST https://www.googleapis.com/calendar/v3/channels/stop mit dem letzten channelId/resourceId und demselben OAuth-Token, das ihn angelegt hat. 
   Schlägt das fehl (Token schon invalid), kannst du auch direkt einen neuen starten – die alte ID fällt dann automatisch nach Ablauf raus.
   -Watch neu registrieren
   Erneuter events.watch-Call auf den Kalender. Der Response liefert wieder id, resourceId, token, expiration. Diese Werte speicherst du als neue Watch-Daten.
   Full sync ausführen
   Weil der alte syncToken ungültig ist, darfst du ihn nicht mehr verwenden. Mach einen Vollabzug ohne syncToken (wieder mit singleEvents, timeMin, etc.), aktualisiere Events in deiner DB und sichere das neue nextSyncToken aus der Response.
   Delta-Sync reaktivieren
   Erst nachdem du den Full Sync abgeschlossen und nextSyncToken gespeichert hast, stellst du wieder auf deine inkrementelle Logik um.
   Kurz gesagt: Expiration abgelaufen → Watch neu starten → Vollabzug → neues nextSyncToken sichern → wieder auf Delta wechseln.
 * @function */
export const httpActionGoogleWatchEvents = httpAction(async ({ runAction, runQuery, runMutation }, req) => {
  /** @description Get the x-goog-headers from the request for further processings of the google calendar api */
  const { channelToken, resourceId, channelId, expiration } = getXGoogleHeaders(req);
  if (!channelToken || !resourceId || !channelId) return convexResponse<null>({
    convex: convexError({
      code: 404,
      severity: ConvexActionServerityEnum.ERROR,
      name: "BLOXIE_HAR_GWE_E01",
    }),
  });

  /** 
   * @description Parse the channel token and retrieve the userId and providerId which are stored in the tokenPayload and are used for further queries and mutations
   * -> Encryption takes place in the @see internal.sync.integrations.google.action.startWatchCalendarLists action */
  const encryptedPayload = safeParse<EncryptedTokenProps>(channelToken);
  let decryptedPayload: ChannelWatchEventsProps|null = null;
  if (encryptedPayload) decryptedPayload = safeParse<ChannelWatchEventsProps>(await runAction(internal.sync.integrations.action.decryptedPayload, { encryptedPayload }));
  
  /** @description Get the calendar by the convex calendar id */
  const calendar = convertToCleanObjectForUpdate(await runQuery(internal.sync.integrations.query.calendarById, { _id: decryptedPayload.c as Id<"calendar"> }) as ConvexCalendarAPIProps);

  /** @description Get the linked account for the user and provider */
  const linkedAccounts = await runQuery(internal.sync.integrations.query.linkedByUser, { userId: decryptedPayload.u as Id<"users"> });
  const linkedAccount = linkedAccounts.find((item) => item.providerId === decryptedPayload.p);

  if (!linkedAccount) return convexResponse<null>({
    convex: convexError({
      code: 404,
      severity: ConvexActionServerityEnum.ERROR,
      name: "BLOXIE_HAR_GWE_E02",
    }),
  });

  /** @description Fetch the specified colors for the calendar events and the calendar lists based on the colorId */
  const [errColors, { data: colors }] = await fetchTypedConvex(runAction(internal.sync.integrations.google.action.fetchCalendarColors, { refreshToken: linkedAccount.refreshToken }));

  /** @description Fetch the events for the calendar including the next sync token */
  const [errEvents, { data: events }]: [ConvexError<ConvexHandlerError>, ConvexActionReturnProps<IntegrationAPIGoogleCalendarEventsProps>] = await fetchTypedConvex(runAction(internal.sync.integrations.google.action.fetchCalendarEvents, { 
    refreshToken: linkedAccount.refreshToken, 
    calendarId: calendar.externalId, 
    nextSyncToken: calendar.watch.nextSyncToken as string 
  }));

  for (const event of events.items) {
    /** @description Event has been newly created, deleted or has been updated -> Check if the event already exists in the database with the same eventProviderId */
    const _event: ConvexEventsAPIProps|null = await runQuery(internal.sync.events.query.byExternalEventId, { 
      userId: decryptedPayload.u as Id<"users">, 
      externalEventId: event.id 
    });

    if (event.status === IntegrationAPICalendarEventStatusEnum.CONFIRMED) {
      if (_event) {
        const [errUpdate] = await fetchTypedConvex(runMutation(internal.sync.events.mutation.update, {
          _id: _event._id,
          ...convertEventGoogleToConvex(
            _event.userId,
            _event.calendarId,
            _event.externalId,
            event,
            colors?.event?.[event.colorId]?.background || calendar.backgroundColor
          ),
        }));
        
        if (errUpdate) {
          /** @todo Handle the error -> Mutation to notifications schema! */
        }
        continue;
      }

      /** @description Event has been newly created -> Create the event in the database */
      const [errCreate] = await fetchTypedConvex(runMutation(internal.sync.events.mutation.create, {
        userId: decryptedPayload.u as Id<"users">,
        calendarId: calendar._id,
        externalId: calendar.externalId,
        externalEventId: event.id,
        title: event.summary,
        description: event?.description || "",
        start: event.start.dateTime || event.start.date,
        end: event.end.dateTime || event.end.date,
        backgroundColor: colors?.event?.[event.colorId]?.background || calendar.backgroundColor,
        htmlLink: event?.htmlLink || "",
        visibility: event.visibility || IntegrationAPICalendarVisibilityEnum.PRIVATE,
        type: event.eventType || IntegrationAPICalendarEventTypeEnum.DEFAULT,
      }));

      if (errCreate) {
        /** @todo Handle the error -> Mutation to notifications schema! */
      }
      continue;
    }

    if (event.status === IntegrationAPICalendarEventStatusEnum.CANCELLED) {
      /** @description Event has been cancelled -> Remove the event from the database */
      const [errRemove] = await fetchTypedConvex(runMutation(internal.sync.events.mutation.remove, { _id: _event._id }));
      if (errRemove) {
        /** @todo Handle the error -> Mutation to notifications schema! */
      }
    }
  }

  /** @description Update the calendar watch information so that the next sync token can be fetched again with only the new or changed events */
  const [errUpdate] = await fetchTypedConvex(runMutation(internal.sync.integrations.mutation.updateCalendar, {
    _id: decryptedPayload.c as Id<"calendar">,
    watch: toWatch({ 
      id: channelId,
      resourceId: resourceId,
      expiration: new Date(expiration).getTime(),
    }, events.nextSyncToken, calendar.watch.nextSyncToken),
    eventsCount: events.items?.length || calendar.eventsCount
  }));

  if (errUpdate) {
    /** @todo Handle the error -> Mutation to notifications schema! */
  }

  return convexResponse<null>({
    convex: convexError({
      code: 200,
      severity: ConvexActionServerityEnum.SUCCESS,
      name: "BLOXIE_HAR_GWE_S01",
    })
  });
});

/**
 * @public
 * @since 0.0.10
 * @version 0.0.2
 * @description Handles the http action for watching a google calendar
 * @function */
export const httpActionGoogleWatchLists = httpAction(async ({ runQuery, runAction, runMutation }, req) => {
  /** @description Get the x-goog-headers from the request for further processings of the google calendar api */
  const { channelToken, resourceId, channelId } = getXGoogleHeaders(req);
  if (!channelToken || !resourceId || !channelId) return convexResponse<null>({
    convex: convexError({
      code: 400,
      severity: ConvexActionServerityEnum.ERROR,
      name: "BLOXIE_HAR_GWL_E01",
    }),
  });
  
  /** 
   * @description Parse the channel token and retrieve the userId and providerId which are stored in the tokenPayload and are used for further queries and mutations
   * -> Encryption takes place in the @see internal.sync.integrations.google.action.startWatchCalendarLists action */
  const encryptedPayload = safeParse<EncryptedTokenProps>(channelToken);
  let decryptedPayload: ChannelWatchListProps|null = null;
  if (encryptedPayload) decryptedPayload = safeParse<ChannelWatchListProps>(await runAction(internal.sync.integrations.action.decryptedPayload, { encryptedPayload }));

  /** @description Get the linked account for the user and provider */
  const linkedAccount = await runQuery(internal.sync.integrations.query.linkedByProviderId, { 
    provider: PROVIDER,
    userId: decryptedPayload.userId,
    providerId: decryptedPayload.providerId
  });

  if (!linkedAccount || !linkedAccount.watch || (resourceId !== linkedAccount.watch.resourceId) || (channelId !== linkedAccount.watch.id)) return convexResponse<null>({
    convex: convexError({
      code: 404,
      severity: ConvexActionServerityEnum.ERROR,
      name: "BLOXIE_HAR_GWL_E02",
    }),
  });

  /** 
   * @description Fetch the calendar list for the linked account and the next sync token
   * -> Used for checking if the calendar has been deleted, updated or created */
  const [errFetch, { data }] = await fetchTypedConvex(runAction(internal.sync.integrations.google.action.fetchCalendarList, { refreshToken: linkedAccount.refreshToken }));
  if (errFetch) return convexResponse<null>({ convex: errFetch.data });
    
  /** @description Get the calendars for the linked account which are used to check if the calendar has been deleted, updated or created */
  const calendars: ConvexCalendarAPIProps[] = await runQuery(internal.sync.integrations.query.calendarsByIds, { calendarId: linkedAccount.calendarId });
  for (const calendar of calendars) {
    /**
     *  @description If the calendar is not found in the data.items, it means that the calendar has been deleted
     * -> Example: id => "4c641189a6c3af7d4633b0b5efbfcd806f71b6daf10475c4fe351373a575e53e@group.calendar.google.com" */
    if (!data.items.find(({ id }) => id === calendar.externalId) && calendar._id) {
      /** 
       * @description Unlink the calendar from the google account and remove the events from the database 
       * @todo Has to bee defined what should happen with the failed removes.. the process can not be stopped!! */
      const { data: failedRemoves } = await unlinkCalendar(
        { runAction, runQuery, runMutation }, 
        { userId: decryptedPayload?.userId as Id<"users">, calendar, refreshToken: linkedAccount.refreshToken, watch: calendar.watch });
      linkedAccount.calendarId = linkedAccount.calendarId.filter((id) => id !== calendar._id);
    }
  }

  const calendarId: Id<"calendar">[] = [];
  for (const calendar of data.items) {
    /** 
     * @description Get the calendar by the external id if available and create, update or remove it
     * -> Example: "4c641189a6c3af7d4633b0b5efbfcd806f71b6daf10475c4fe351373a575e53e@group.calendar.google.com" */
    const _calendar: ConvexCalendarAPIProps|null = await runQuery(internal.sync.integrations.query.calendarByExternalId, { externalId: calendar.id });

    /** 
     * @description Update the needed convex information for a calendar 
     * @todo Has to bee defined what should happen with the failed updates.. the process can not be stopped!! */
    if (_calendar) {
      const [errUpdate] = await fetchTypedConvex(runMutation(internal.sync.integrations.mutation.updateCalendar, {
        _id: _calendar._id,
        watch: _calendar.watch,
        eventsCount: _calendar.eventsCount,
        isRelevantForConflictDetection: _calendar.isRelevantForConflictDetection
      }));
      continue;
    }

    /** @description Create the newly added calendar in the database, fetch all the events and start the linking afterwards */
    const [errCreate, { data: _id }] = await fetchTypedConvex(createCalendar({ runAction, runMutation, runQuery },
      { 
        userId: decryptedPayload?.userId as Id<"users">, 
        providerId: decryptedPayload?.providerId, 
        calendar, 
        refreshToken: linkedAccount.refreshToken 
      }
    ));

    if (errCreate) continue;
    calendarId.push(_id);
  }

  /** @description Update the linked account with the new refresh token, scopes and has mail permission */
  await runMutation(internal.sync.integrations.mutation.updateLinked, {
    _id: linkedAccount._id,
    calendarId: [...linkedAccount.calendarId, ...calendarId],
    watch: toWatch(linkedAccount.watch, data?.nextSyncToken, linkedAccount.watch.nextSyncToken)
  });

  return convexResponse<null>({
    convex: convexError({
      code: 200,
      severity: ConvexActionServerityEnum.SUCCESS,
      name: "BLOXIE_HAR_GWL_S01",
    })
  });
});

/**
 * @public
 * @since 0.0.9
 * @version 0.0.1
 * @description Handles the http action for linking a google account
 * @function */
export const httpActionGoogleCallback = httpAction(async () => new Response("i18n.convex.http.integrations.google.success.callback", { status: 200 }));

/**
 * @private
 * @since 0.0.10
 * @version 0.0.1
 * @description Handles the watch data for the linked data -> Creates a new watch object
 * @param {IntegrationAPIGoogleCalendarChannelWatchProps|undefined} watch - The watch object from the google calendar api
 * @param {string} nextSyncToken - The next sync token for the watch
 * @param {string} lastSyncToken - The last sync token for the watch
 * @function */
 const toWatch = (
   watch: IntegrationAPIGoogleCalendarChannelWatchProps|undefined,
   nextSyncToken?: string,
   lastSyncToken?: string
 ): ConvexCalendarWatchAPIProps|null => ({
    id: watch.id,
    resourceId: watch.resourceId,
    expiration: typeof watch.expiration === "string" ? Number(watch.expiration) : watch.expiration ?? 0,
    nextSyncToken: nextSyncToken ?? "",
    lastSyncToken: lastSyncToken ?? "",
  });


/**
 * @private
 * @since 0.0.21
 * @version 0.0.1
 * @description Handles the creation of a calendar in the database and starts the channel watch for the calendar events including the fetching of all the events
 * @param {ConvexCtx} ctx - The convex context
 * @param {CreateCalendarProps} param0
 * @param {Id<"users">} param0.userId - The user id
 * @param {IntegrationAPIGoogleCalendarListItemProps} param0.calendar - The calendar to create
 * @param {string} param0.providerId - The provider id => "105126457376485677523" which is transferred from the google account
 * @param {EncryptedTokenProps} param0.refreshToken - The refresh token for the google account => Encrypted
 * @returns {ConvexActionReturnProps<Id<"calendar">>} - The id of the created calendar
 * @function */
const createCalendar = async (
  { runAction, runMutation }: ConvexCtx,
  { userId, calendar, providerId, refreshToken }: CreateCalendarProps
): Promise<ConvexActionReturnProps<Id<"calendar">>> => {
  /** @description Create the newly added calendar in the database and start the linking afterwards */
  const [errCreate, _id] = await fetchTypedConvex(runMutation(internal.sync.integrations.mutation.createCalendar, {
    externalId: calendar.id,
    accessRole: calendar.accessRole as IntegrationAPICalendarAccessRoleEnum,
    backgroundColor: calendar.backgroundColor,
    description: calendar?.description || calendar?.summary,
    foregroundColor: calendar.foregroundColor,
    primary: calendar?.primary || false,
  }));

  if (errCreate) throw new ConvexError(errCreate.data);

  /** @description Start the channel watch for the future modifications of the calendar events */
  const [errWatch, { data: watch }]: [ConvexError<ConvexHandlerError>, ConvexActionReturnProps<IntegrationAPIGoogleCalendarChannelWatchProps>] = await fetchTypedConvex(runAction(internal.sync.integrations.google.action.startWatchCalendarEvents, { 
    userId, providerId, refreshToken, 
    convexCalendarId: _id,
    calendarId: calendar.id,
  }));

  if (errWatch) {
    /** @todo Calendar watch could not be started -> Mutation to notifications schema! */
  }

  /** @description Fetch the events for the calendar including the next sync token */
  const [errEvents, { data: events }]: [ConvexError<ConvexHandlerError>, ConvexActionReturnProps<IntegrationAPIGoogleCalendarEventsProps>] = await fetchTypedConvex(runAction(internal.sync.integrations.google.action.fetchCalendarEvents, { 
    refreshToken,
    calendarId: calendar.id,
  }));

  if (errEvents) {
    /** @todo Calendar events could not be fetched -> Mutation to notifications schema! -> Make a notification with a refres button for retry */
  }

  /** 
   * @description Update the calendar watch information
   * -> The watch object is not written to the convex database at the beginning because 
   * the generated convex ID is used for the registration of the calendar watch for the later process flow. */
  if (_id) await runMutation(internal.sync.integrations.mutation.updateCalendar, {
    _id, 
    /** @description Add the watch events to the linked data watch for further determing of the next sync token to check if a calendar events (created, updated, deleted) has been changed */
    watch: !errWatch ? toWatch(watch, events?.nextSyncToken, events?.nextSyncToken) : toWatch({ id: "", resourceId: "", expiration: 0 } as IntegrationAPIGoogleCalendarChannelWatchProps),
    eventsCount: events?.items?.length ?? 0,
    isRelevantForConflictDetection: true,
  });

  return {
    data: _id,
    convex: convexError({
      code: 200,
      severity: ConvexActionServerityEnum.SUCCESS,
      name: "BLOXIE_HAR_CC_S01",
    }),
  };
}

/**
 * @private
 * @since 0.0.21
 * @version 0.0.1
 * @description Handles the unlinking of a calendar from a google account
 * @param {ConvexCtx} ctx - The convex context
 * @param {UnlinkCalendarProps} param0
 * @param {Id<"users">} param0.userId - The user id
 * @param {ConvexCalendarAPIProps} param0.calendar - The calendar to unlink the events from
 * @param {EncryptedTokenProps} param0.refreshToken - The refresh token for the google account
 * @param {ConvexCalendarWatchAPIProps} param0.watch - The watch for the calendar witch is used for stopping the channel watch
 * @function */
const unlinkCalendar = async (
  { runAction, runQuery, runMutation }: ConvexCtx, 
  { userId, calendar, refreshToken, watch }: UnlinkCalendarProps): Promise<ConvexActionReturnProps<ConvexError<ConvexHandlerError>[]>> => {
    if (watch) {
      /** @description Stop the channel watch for the calendar lists so that the calendar events can not be fetched or updated incrementally anymore */
      const [errStop] = await fetchTypedConvex(runAction(internal.sync.integrations.google.action.stopChannelWatch, { 
        channelId: watch.id,
        resourceId: watch.resourceId, 
        refreshToken: refreshToken 
      }));

      if (errStop) throw new ConvexError(errStop.data);
    }

    /** @description Fetch all the events for the given calendar id from the database for removing them before removing the calendar */
    const events: ConvexEventsAPIProps[] = await runQuery(internal.sync.events.query.byExternalCalendarId, { 
      userId,
      externalCalendarId: calendar.externalId 
    });

    /** @description Remove all the events for the given calendar id from the database before removing the calendar */
    const failedRemoves: ConvexError<ConvexHandlerError>[] = [];
    for (const event of events) {
      const [errRemove] = await fetchTypedConvex(runMutation(internal.sync.events.mutation.remove, { _id: event._id }));
      if (errRemove) failedRemoves.push(errRemove);
    }

    /** @description Remove the calendar from the database */
    const [errRemoveCalendar] = await fetchTypedConvex(runMutation(internal.sync.integrations.mutation.removeCalendar, { _id: calendar._id }));
    if (errRemoveCalendar) failedRemoves.push(errRemoveCalendar);

    return {
      data: failedRemoves,
      convex: convexError({
        code: 207,
        severity: ConvexActionServerityEnum.SUCCESS,
        name: "BLOXIE_HAR_UC_S01",
      }),
    };
}

/**
 * @private
 * @since 0.0.21
 * @version 0.0.1
 * @description Handles the x-goog-headers for the google calendar api
 * @param {Request} req - The request object
 * @function */
const getXGoogleHeaders = (
  req: Request
) => ({
  channelToken: req.headers.get("x-goog-channel-token"),
  channelExpiration: req.headers.get("x-goog-channel-expiration"),
  resourceId: req.headers.get("x-goog-resource-id"),
  channelId: req.headers.get("x-goog-channel-id"),
  expiration: req.headers.get("x-goog-channel-expiration"),
});