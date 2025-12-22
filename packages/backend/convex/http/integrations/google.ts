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
import { convertEventGoogleToConvex, convertToCleanObjectForUpdate, safeParse, toWatch } from "../../../Convert";
import { convexError, ConvexHandlerError, convexResponse, fetchTypedConvex
 } from "../../../Fetch";
import { ConvexError } from "convex/values";
import { RRule } from "rrule";

export const PROVIDER = "oauth_google";

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
 * @since 0.0.22
 * @version 0.0.1
 * @type */
type FullSyncEventsProps = {
  calendar: ConvexCalendarAPIProps;
  userId: Id<"users">;
  providerId: string;
  refreshToken: EncryptedTokenProps;
}

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH
 * @since 0.0.22
 * @version 0.0.1
 * @type */
type FullSyncEventsReturnProps = {
  events: IntegrationAPIGoogleCalendarEventsProps;
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
  /** 
   * @description Get the server auth code, google user and user id from the request for further processing
   * -> Register a new linked account or update an existing linked account
   * -> Starting the channel watch for the calendar -> For all the integrated calendars the channel watch should be started so that the calendar events can be fetched incrementally */
  const { serverAuthCode, googleUser, userId, grantScopeGmail }: HttpActionLinkGoogleProps = await req.json();

  if (!process.env.PROVIDER_GOOGLE_WEB_CLIENT_ID || !process.env.PROVIDER_GOOGLE_WEB_CLIENT_SECRET) return convexResponse<null>({
    convex: convexError({
      code: 500,
      severity: ConvexActionServerityEnum.ERROR,
      info: "i18n.convex.http.integrations.google.error.clientIdOrSecretNotFound",
      name: "BLOXIE_HAR_GE_E01",
    }),
  });

  /** @description Check if the account is already linked */
  let linkedAccount = await runQuery(internal.sync.integrations.query.linkedByProviderId, { userId, provider: PROVIDER, providerId: googleUser.id });

  /** 
   * @description Check if the grant scope gmail is not allowed for a new linked account
   * -> Gmail scope is only allowed for an existing linked account */
  if (!linkedAccount && grantScopeGmail) {
    return convexResponse<null>({
      convex: convexError({
        code: 400,
        info: "i18n.convex.http.integrations.google.error.grantScopeGmailNotAllowed",
        severity: ConvexActionServerityEnum.ERROR,
        name: "BLOXIE_HAR_GE_E02",
      }),
    });
  }

  /** 
   * @description Exchange the server auth code for a token
   * -> redirect_uri is the callback URL for the token exchange which is defined in the Google Cloud Console */
  const [err, res] = await fetchTypedConvex(fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code: serverAuthCode,
      client_id: process.env.PROVIDER_GOOGLE_WEB_CLIENT_ID,
      client_secret: process.env.PROVIDER_GOOGLE_WEB_CLIENT_SECRET,
      grant_type: "authorization_code",
      redirect_uri: "https://harmless-dodo-18.convex.site/integrations/google/oauth/callback",
    }),
  }));

  if (err) return convexResponse<null>({
    convex: convexError({
      code: err.data.code,
      info: await res.text(),
      severity: ConvexActionServerityEnum.ERROR,
      name: "BLOXIE_HAR_GE_E03",
    }),
  });

  /** 
   * @description Get the token data from the response which is needed for the token exchange in further requests
   * -> With the refersh_token the access token can be refreshed on demand */
  const { refresh_token, scope }: IntegrationAPIGoogleCalendarTokenExchangeProps = await res.json();
  if (!refresh_token) return convexResponse<null>({
    convex: convexError({
      code: 500,
      info: "i18n.convex.http.integrations.google.error.missingRefreshToken",
      severity: ConvexActionServerityEnum.ERROR,
      name: "BLOXIE_HAR_GE_E04",
    }),
  });

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
    const [errWatchLists, { data: watchLists }] = await fetchTypedConvex(runAction(internal.sync.integrations.google.action.startWatchCalendarLists, { 
      userId, 
      providerId: googleUser.id,
      refreshToken: encryptedRefreshToken 
    }), "BLOXIE_HAR_GE_E05");

    if (errWatchLists) {
      /** @todo Handle the error -> Mutation to notifications schema! */
    }

    /** @description Fetch the specified colors for the calendar events and the calendar lists based on the colorId */
    const [errColors, { data: colors }] = await fetchTypedConvex(runAction(internal.sync.integrations.google.action.fetchCalendarColors, { refreshToken: encryptedRefreshToken }), "BLOXIE_HAR_GE_E06");
    console.log(errColors);

    /** @description Fetch the calendar list for the user -> For all the integrated calendars the channel watch should be started so that the calendar events can be fetched incrementally */
    const [errFetch, { data: calendars }] = await fetchTypedConvex(runAction(internal.sync.integrations.google.action.fetchCalendarList, { refreshToken: encryptedRefreshToken }));
    if (errFetch) return convexResponse<null>({ convex: errFetch.data });

    for (let calendar of calendars?.items) {
      /** @description Create the calendar information object for each calendar within the integrated provider account */
      const [errCreate, _id] = await fetchTypedConvex(runMutation(internal.sync.integrations.mutation.createCalendar, {
        externalId: calendar.id,
        accessRole: calendar.accessRole as IntegrationAPICalendarAccessRoleEnum,
        backgroundColor: calendar.backgroundColor,
        description: calendar?.summary || calendar?.description,
        foregroundColor: calendar.foregroundColor,
        primary: calendar?.primary || false,
      }), "BLOXIE_HAR_GE_E07");

      if (errCreate) continue;
      calendarId.push(_id);

      /** 
       * @description Start the channel watch for the calendar -> This is not needed for the first sync because the initial data is fetched with the fetchCalendarEvents action
       * -> The future handling is controlled by the nextSyncToken which is returned by the google calendar api and will only fetch the newly created events inside the channel watch callback function -> httpActionGoogleWatch */
      const [errWatch, { data: watch }]: [ConvexError<ConvexHandlerError>, ConvexActionReturnProps<IntegrationAPIGoogleCalendarChannelWatchProps>] = await fetchTypedConvex(runAction(internal.sync.integrations.google.action.startWatchCalendarEvents, { 
        userId, 
        providerId: googleUser.id,
        refreshToken: encryptedRefreshToken, 
        convexCalendarId: _id,
        calendarId: calendar.id,
      }));

      /** @description Fetch the events for the calendar including the next sync token */
      const [errEvents, { data: events }]: [ConvexError<ConvexHandlerError>, ConvexActionReturnProps<IntegrationAPIGoogleCalendarEventsProps>] = await fetchTypedConvex(runAction(internal.sync.integrations.google.action.fetchCalendarEvents, { 
        refreshToken: encryptedRefreshToken,
        calendarId: calendar.id,
      }));

      /** @description Get the unique events for the calendar -> Only keep the first event of a recurring event */
      const uniqueEvents = filterUniqueEvents(events);
      if (!errEvents && uniqueEvents) {
        /** @description Exclude birthday events from the creation of the events in the database because they are not relevant for the user */
        for (const event of uniqueEvents) {
          /** @description Used for writing the recurrence rules for the recurring event to the database */
          if (event.recurringEventId) {
            /** @description Fetch the recurrence rules for the recurring event */
            const [errFetchEvent, { data: eventData }] = await fetchTypedConvex(runAction(internal.sync.integrations.google.action.fetchCalendarEvent, {
              refreshToken: encryptedRefreshToken,
              calendarId: calendar.id,
              eventId: event.recurringEventId,
            }));
            
            if (!errFetchEvent) event["recurrence"] = eventData?.recurrence || [];
          }

          /** @description Create the event in the database */
          await runMutation(internal.sync.events.mutation.create, convertEventGoogleToConvex(
            userId,
            _id,
            calendar.id,
            event as IntegrationAPIGoogleCalendarEventProps,
            colors?.event?.[event.colorId]?.background || calendar.backgroundColor,
            events?.timeZone
          ));
        }
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

    /** @description End of the initial linking process */
    return convexResponse<null>({
      convex: convexError({
        code: 200,
        severity: ConvexActionServerityEnum.SUCCESS,
        name: "BLOXIE_HAR_GE_S01",
      })
    });
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

  return convexResponse<null>({
    convex: convexError({
      code: 200,
      severity: ConvexActionServerityEnum.SUCCESS,
      name: "BLOXIE_HAR_GE_S02",
    })
  });
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
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.14
 * @version 0.0.2
 * @description Handles the http action for unlinking a google account and deleting all the linked data for the google provider
 * @function */
export const httpActionGoogleUnlink = httpAction(async ({ runMutation, runAction, runQuery }, req) => {
  const { userId, providerId } = await req.json();

  /** @description Get the linked account for the user and provider */
  const linkedAccount: ConvexLinkedAPIProps|null = await runQuery(internal.sync.integrations.query.linkedByProviderId,{ userId, provider: PROVIDER, providerId });
  if (!linkedAccount) return convexResponse<null>({
    convex: convexError({
      code: 404,
      severity: ConvexActionServerityEnum.ERROR,
      name: "BLOXIE_HAR_GUL_E01",
    }),
  });

  /** @description Stop the channel watch for the calendar lists so that the calendar events can not be fetched or updated incrementally anymore */
  const [errStop, response] = await fetchTypedConvex(runAction(internal.sync.integrations.google.action.stopChannelWatch, { 
    channelId: linkedAccount.watch.id, 
    resourceId: linkedAccount.watch.resourceId, 
    refreshToken: linkedAccount.refreshToken 
  }));

  /** 
   * @description Collect all the events for a given provider and calendarid and remove them all from the database
   * -> Use case: After a user unlinks a google account, all the events for the linked account should be deleted so that no chunks of events are left over */
  const calendars: ConvexCalendarAPIProps[] = await runQuery(internal.sync.integrations.query.calendarsByIds, { calendarId: linkedAccount.calendarId });
  for (const calendar of calendars) {
    if (!calendar) continue;

    /** 
     * @description Unlink the calendar from the google account and remove the events from the database 
     * @todo Has to bee defined what should happen with the failed removes.. the process can not be stopped!! */
    const { data: failedRemoves } = await unlinkCalendar(
      { runAction, runQuery, runMutation }, 
      { userId, calendar, refreshToken: linkedAccount.refreshToken, watch: calendar.watch });
    if (failedRemoves) {
      /** @todo Handle the error -> Mutation to notifications schema! */
    }
  }

  /** @description Finally remove the linked account from the database */
  await runMutation(internal.sync.integrations.mutation.removeLinked, { _id: linkedAccount._id });

  /** @description Revoke the refresh token for the linked account */
  const decryptedRefreshToken = await runAction(internal.sync.integrations.action.decryptedToken, { encryptedToken: linkedAccount.refreshToken });
  const [errRevoke, _] = await fetchTypedConvex(fetch("https://oauth2.googleapis.com/revoke", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      token: decryptedRefreshToken,
      token_type_hint: "refresh_token",
    }),
  }));

  if (errRevoke) {
    /** @todo Handle the error -> Mutation to notifications schema! */
  }

  return convexResponse<null>({
    convex: convexError({
      code: 200,
      severity: ConvexActionServerityEnum.SUCCESS,
      name: "BLOXIE_HAR_GUL_S01",
    }),
  });
});

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.10
 * @version 0.0.5
 * @description Handles the http action for watching a google calendar
 * @todo 
 * Wiederkehrende Ereignisse werden nicht korrekt gelöscht..!!!
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

  let decryptedPayload: ChannelWatchEventsProps|null = null;

  try {
    /** 
     * @description Parse the channel token and retrieve the userId and providerId which are stored in the tokenPayload and are used for further queries and mutations
     * -> Encryption takes place in the @see internal.sync.integrations.google.action.startWatchCalendarLists action */
    const encryptedPayload = safeParse<EncryptedTokenProps>(channelToken);
    if (encryptedPayload) decryptedPayload = safeParse<ChannelWatchEventsProps>(await runAction(internal.sync.integrations.action.decryptedPayload, { encryptedPayload }));  
  } catch (error) {
    console.log("error", error, decryptedPayload);
    return convexResponse<null>({
      convex: convexError({
        code: 500,
        severity: ConvexActionServerityEnum.ERROR,
        name: "BLOXIE_HAR_GWE_E04",
      }),
    });
  }
  
  /** @description Get the calendar by the convex calendar id */
  const calendar = convertToCleanObjectForUpdate(await runQuery(internal.sync.integrations.query.calendarById, { _id: decryptedPayload.c as Id<"calendar"> }) as ConvexCalendarAPIProps);

  /** @description Get the linked account for the user and provider */
  const linkedAccounts = await runQuery(internal.sync.integrations.query.linkedByUser, { userId: decryptedPayload.u as Id<"users"> });
  const linkedAccount = linkedAccounts.find((item) => item.providerId === decryptedPayload.p);

  if (!linkedAccount || !calendar) return convexResponse<null>({
    convex: convexError({
      code: 404,
      severity: ConvexActionServerityEnum.ERROR,
      name: "BLOXIE_HAR_GWE_E02",
      _id: linkedAccount?._id || calendar?._id,
    }),
  });

  /** @description Fetch the specified colors for the calendar events and the calendar lists based on the colorId */
  let colors: IntegrationAPIGoogleCalendarColorsProps|null = null;
  const [errColors, dataColors] = await fetchTypedConvex(runAction(internal.sync.integrations.google.action.fetchCalendarColors, { refreshToken: linkedAccount.refreshToken }));
  if (!errColors) colors = dataColors?.data;

  /** @description Fetch the events for the calendar including the next sync token */
  let [errEvents, dataEvents]: [ConvexError<ConvexHandlerError>, ConvexActionReturnProps<IntegrationAPIGoogleCalendarEventsProps>] = await fetchTypedConvex(runAction(internal.sync.integrations.google.action.fetchCalendarEvents, { 
    refreshToken: linkedAccount.refreshToken, 
    calendarId: calendar.externalId, 
    nextSyncToken: calendar.watch.nextSyncToken as string 
  }));

  /** @description If the error is not a 410 Gone, return the error */
  if (errEvents) return convexResponse<null>({ convex: errEvents.data });

  let events: IntegrationAPIGoogleCalendarEventsProps = dataEvents?.data;
  let watch: ConvexCalendarWatchAPIProps = calendar.watch;

  if (dataEvents?.convex?.code === 410) {
    /** 
     * @description If the error is a 410 Gone, it means that the channel watch has expired -> Stop the channel watch and start a new one
     * -> Do also a new full sync of the calendar events without a next sync token */
      console.log("410 Gone -> Stop the channel watch and start a new one");
      /** @description Do a full sync of the calendar events without a next sync token */
      let { data: synced } = await fullSyncEvents({ runAction }, { userId: decryptedPayload.u as Id<"users">, providerId: linkedAccount.providerId, calendar, refreshToken: linkedAccount.refreshToken });
      events = synced.events;
      watch = synced.watch;
      console.log("410 Gone ->", watch);
  } else watch = toWatch({ id: channelId, resourceId: resourceId, expiration: new Date(expiration).getTime() }, events.nextSyncToken, calendar.watch.nextSyncToken);

  /** @description Get the unique events for the calendar -> Only keep the first event of a recurring event */
  let uniqueEvents = filterUniqueEvents(events);

  const instanceIds: Set<string> = new Set<string>();
  const uniqueEventsInstances: IntegrationAPIGoogleCalendarEventProps[] = [];

  /** 
   * @description Read new events of an recurring event!! the newly created events will not be fetched with the channel watch!!
   * -> Execute instance full sync for the recurring event for fetching all the relevant events
   * -> During the watch process there is no "recurringEventId" available!  */
  for (const event of uniqueEvents) {
    /** @description If the event is a recurring event, fetch the instances of the recurring event */
    if (event?.recurrence && event?.recurrence?.length > 0) {
      /** @description Get the recurring root id for the recurring events -> Used for fetching or removing the recurring events from the database */
      const recurringRootId: string = event.recurringEventId ?? event.id.split("_R")[0];
      instanceIds.add(recurringRootId);

      /** @description Fetch the recurring events from the database */
      const recurringEvents: ConvexEventsAPIProps[] = await runQuery(internal.sync.events.query.byRecurringEventId, { userId: decryptedPayload.u as Id<"users">, recurringEventId: recurringRootId });

      /** @description Fetch the instances of the recurring event */
      const [errFetchInstances, dataInstances] = await fetchTypedConvex(runAction(internal.sync.integrations.google.action.fetchCalendarEventsInstances, { 
        refreshToken: linkedAccount.refreshToken, 
        calendarId: calendar.externalId, 
        eventId: event.id 
      }));

      if (errFetchInstances) { /** @todo Handle the error -> Mutation to notifications schema! */ } 

      /** @description If the event is cancelled and no instances have been found, add the event id to the instance ids and remove all the instances from the database with the same recurring event id */
      if (dataInstances.data.items.length === 0 && event.status === IntegrationAPICalendarEventStatusEnum.CANCELLED) {
        for (const recurringEvent of recurringEvents) {
          //instanceIds.add(recurringEvent.externalEventId);
          const [errRemove] = await fetchTypedConvex(runMutation(internal.sync.events.mutation.remove, { _id: recurringEvent._id }));
          if (errRemove) { /** @todo Handle the error -> Mutation to notifications schema! */ }
        } continue;
      }

      /** 
       * @description If the recurrence contains a UNTIL parameter, it means that the series is not infinite and has a end date
       * -> If the recurrence contains a COUNT parameter, it means it is a new series and it should also send the old series with "UNTIL="
       * => Example: [ 'RRULE:FREQ=WEEKLY;WKST=SU;UNTIL=20251216T225959Z;BYDAY=TU,WE,TH' ] */
      const rule = event.recurrence.find((r) => r.startsWith("RRULE:")) || "";
      
      let rrule = RRule.fromString(rule); // -> Parse FREQ, BYDAY, UNTIL etc.
      rrule = new RRule({
        ...rrule.origOptions,
        dtstart: new Date(event.start?.dateTime ?? event.start?.date)
      });
      
      if (rrule?.options?.until || rrule?.options?.count) {
        const requiredStarts = new Set(rrule.all().map((date) => date.toISOString()));

        for (const recurringEvent of recurringEvents) {
          if (requiredStarts.has(recurringEvent.start)) continue; // -> Valid occurrence, keep it
          //instanceIds.add(recurringEvent.externalEventId);
          const [errRemove] = await fetchTypedConvex(runMutation(internal.sync.events.mutation.remove, { _id: recurringEvent._id }));
          if (errRemove) { /** @todo Handle the error -> Mutation to notifications schema! */ }
        }
      }

      for (const item of dataInstances.data.items) {
        /** @description If the item is not already in the uniqueEventsInstances array, add it -> Could be already available when an occurrence has been created or changed */
        if (!instanceIds.has(item.id)) {
          instanceIds.add(item.id);
          uniqueEventsInstances.push({ ...item, recurringRootId });
        }
      }
    }
  }

  for (const event of [...uniqueEvents.filter((e) => !instanceIds.has(e.id)), ...uniqueEventsInstances]) {
    /** @description Event has been newly created, deleted or has been updated -> Check if the event already exists in the database with the same eventProviderId */
    const _event: ConvexEventsAPIProps|null = await runQuery(internal.sync.events.query.byExternalEventId, { 
      userId: decryptedPayload.u as Id<"users">, 
      externalEventId: event.id 
    });

    if (event.status === IntegrationAPICalendarEventStatusEnum.CONFIRMED) {
      const integegrationEvent = { 
        ...event, 
        recurringEventId: event.recurringEventId || (event.recurrence && event.recurrence.length >= 0 ? event.id : ""),
        originalStartTime: event?.originalStartTime || event?.start
      }

      if (_event) {
        const [errUpdate] = await fetchTypedConvex(runMutation(internal.sync.events.mutation.update, {
          _id: _event._id,
          ...convertEventGoogleToConvex(
            _event.userId,
            _event.calendarId,
            _event.externalId,
            integegrationEvent,
            colors?.event?.[event.colorId]?.background || calendar.backgroundColor,
            events?.timeZone
          ),
        }));
        
        if (errUpdate) {
          /** @todo Handle the error -> Mutation to notifications schema! */
        } continue;
      }

      /** @description Event has been newly created -> Create the event in the database */
      const payload = convertEventGoogleToConvex(
        decryptedPayload.u as Id<"users">,
        calendar._id,
        calendar.externalId,
        integegrationEvent,
        colors?.event?.[event.colorId]?.background || calendar.backgroundColor,
        events?.timeZone
      );

      const [errCreate] = await fetchTypedConvex(runMutation(internal.sync.events.mutation.create, payload));
      if (errCreate) {
        /** @todo Handle the error -> Mutation to notifications schema! */
      } continue;
    }

    if (event.status === IntegrationAPICalendarEventStatusEnum.CANCELLED && _event) {
      /** @description Event has been cancelled -> Remove the event from the database */
      const [errRemove] = await fetchTypedConvex(runMutation(internal.sync.events.mutation.remove, { _id: _event._id }));
      if (errRemove) {
        /** @todo Handle the error -> Mutation to notifications schema! */
      }
    }
  }

  /** @description Get all the events for the given calendar to update the events count */
  const _events = await runQuery(internal.sync.events.query.byExternalCalendarId, { userId: decryptedPayload.u, externalCalendarId: calendar.externalId });

  /** @description Update the calendar watch information so that the next sync token can be fetched again with only the new or changed events */
  const [errUpdate] = await fetchTypedConvex(runMutation(internal.sync.integrations.mutation.updateCalendar, {
    _id: decryptedPayload.c as Id<"calendar">,
    watch,
    eventsCount: _events?.length || calendar.eventsCount
  }));

  const [errUpdateLastSync] = await fetchTypedConvex(runMutation(internal.sync.integrations.mutation.updateLinked, {
    _id: linkedAccount._id,
    lastSync: new Date().getTime()
  }), "BLOXIE_HAR_GWE_E03");

  if (errUpdate || errUpdateLastSync) {
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
 * @author Marc Stöckli - Codemize GmbH 
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
        description: calendar.summary,
        foregroundColor: calendar.foregroundColor,
        backgroundColor: calendar.backgroundColor,
        primary: calendar.primary,
        accessRole: calendar.accessRole as IntegrationAPICalendarAccessRoleEnum,
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
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.9
 * @version 0.0.1
 * @description Handles the http action for linking a google account
 * @function */
export const httpActionGoogleCallback = httpAction(async () => new Response("i18n.convex.http.integrations.google.success.callback", { status: 200 }));

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
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
    description: calendar?.summary || calendar?.description,
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
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.24
 * @version 0.0.2
 * @description Filters the unique events for the calendar -> Only keep the first event of a recurring event
 * @param {IntegrationAPIGoogleCalendarEventsProps} events - The events to filter */
const filterUniqueEvents = (events: IntegrationAPIGoogleCalendarEventsProps) => Array.from(
  events.items/*.reduce(
    (acc, event) => {
      const key = event.recurringEventId ?? event.id;
      if (!acc.has(key)) acc.set(key, event); // -> Only set the event for the first time
      return acc;
    },
    new Map<string, IntegrationAPIGoogleCalendarEventProps>()
  ).values()*/
).filter((event) => event.eventType !== IntegrationAPICalendarEventTypeEnum.BIRTHDAY);

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.22
 * @version 0.0.1
 * @description Handles the full sync of the calendar events after the channel watch has expired
 * @param {Object} param0
 * @param {FunctionReference<"action", "public" | "internal">} param0.runAction - The runAction function
 * @param {FullSyncEventsProps} param0
 * @param {Id<"users">} param0.userId - The user id
 * @param {string} param0.providerId - The provider id => "105126457376485677523" which is transferred from the google account
 * @param {ConvexCalendarAPIProps} param0.calendar - The calendar to full sync the events from
 * @param {EncryptedTokenProps} param0.refreshToken - The refresh token for the google account
 * @function */
const fullSyncEvents = async (
  { runAction }: { runAction: ConvexHttpCtx["runAction"] }, 
  { userId, providerId, calendar, refreshToken }: FullSyncEventsProps
): Promise<ConvexActionReturnProps<FullSyncEventsReturnProps>> => {
    /** @description Stop the channel watch for the calendar lists so that the calendar events can not be fetched or updated incrementally anymore */
    const [errStop] = await fetchTypedConvex(runAction(internal.sync.integrations.google.action.stopChannelWatch, { 
      channelId: calendar.watch.id,
      resourceId: calendar.watch.resourceId, 
      refreshToken
    }));

    if (errStop) { /** @todo Channel watch could not be stopped -> Mutation to notifications schema! */ }

    /** @description Fetch the events for the calendar including the next sync token */
    const [errEvents, data] = await fetchTypedConvex(runAction(internal.sync.integrations.google.action.fetchCalendarEvents, { 
      refreshToken, 
      calendarId: calendar.externalId
    }));

    if (errEvents) {
      /** @todo Calendar events could not be fetched -> Mutation to notifications schema! -> Make a notification with a refres button for retry */
      throw new ConvexError(errEvents.data);
    } 

    /** 
     * @description Start the channel watch for the calendar -> This is not needed for the first sync because the initial data is fetched with the fetchCalendarEvents action
     * -> The future handling is controlled by the nextSyncToken which is returned by the google calendar api and will only fetch the newly created events inside the channel watch callback function -> httpActionGoogleWatch */
    const [errWatch, { data: watch }]: [ConvexError<ConvexHandlerError>, ConvexActionReturnProps<IntegrationAPIGoogleCalendarChannelWatchProps>] = await fetchTypedConvex(runAction(internal.sync.integrations.google.action.startWatchCalendarEvents, { 
      userId, providerId, refreshToken, 
      convexCalendarId: calendar._id,
      calendarId: calendar.externalId,
    }));

    if (errWatch) { /** @todo Channel watch could not be started -> Mutation to notifications schema! */ }
    let events: IntegrationAPIGoogleCalendarEventsProps = data?.data;

    return {
      data: { events, watch: toWatch(watch, events.nextSyncToken, calendar.watch.nextSyncToken) },
      convex: convexError({
        code: 200,
        severity: ConvexActionServerityEnum.SUCCESS,
        name: "BLOXIE_HAR_FSE_S01",
      }),
    };
}

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
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

      console.log("errStop", errStop);
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
 * @author Marc Stöckli - Codemize GmbH 
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