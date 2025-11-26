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
  ConvexLinkedAPIProps
} from "../../../Types";
import { convertEventGoogleToConvex, convertToCleanObjectForUpdate } from "../../../Convert";

/**
 * @public
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
  let linkedAccount = await runQuery(internal.sync.integrations.query.linkedByProviderId, { userId, provider: "google", providerId: googleUser.id });

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
    const calendarsId: Id<"calendar">[] = [];

    /** @description Start the channel watch for the calendar lists */
    const { data: watchLists }: ConvexActionReturnProps<IntegrationAPIGoogleCalendarChannelWatchProps> = await runAction(internal.sync.integrations.google.action.startWatchCalendarLists, { 
      userId, 
      refreshToken: encryptedRefreshToken 
    });

    /** @description Fetch the specified colors for the calendar events and the calendar lists based on the colorId */
    const { data: colors }: ConvexActionReturnProps<IntegrationAPIGoogleCalendarColorsProps> = await runAction(internal.sync.integrations.google.action.fetchCalendarColors, { refreshToken: encryptedRefreshToken });

    /** @description Fetch the calendar list for the user -> For all the integrated calendars the channel watch should be started so that the calendar events can be fetched incrementally */
    const { data: calendars }: ConvexActionReturnProps<IntegrationAPIGoogleCalendarListProps> = await runAction(internal.sync.integrations.google.action.fetchCalendarList, { refreshToken: encryptedRefreshToken });
    for (let calendar of calendars?.items) {
      /** @description Create the calendar information object for each calendar within the integrated provider account */
      const _id: Id<"calendar"> = await runMutation(internal.sync.integrations.mutation.createCalendar, {
        id: calendar.id,
        accessRole: calendar.accessRole as IntegrationAPICalendarAccessRoleEnum,
        backgroundColor: calendar.backgroundColor,
        description: calendar?.description || calendar?.summary,
        foregroundColor: calendar.foregroundColor,
        primary: calendar?.primary || false,
      });

      calendarsId.push(_id);

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

      if (!hasErrEvents && events?.items) {
        /** @description Exclude birthday events from the creation of the events in the database because they are not relevant for the user */
        for (const event of events.items.filter(
          (item) => item.eventType !== IntegrationAPICalendarEventTypeEnum.BIRTHDAY
        )) await runMutation(internal.sync.events.mutation.create, convertEventGoogleToConvex(
           userId,
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
        watch: !hasErrWatch ? toWatch(watchEvents, events?.nextSyncToken, events?.nextSyncToken) : null,
        eventsCount: events?.items?.length ?? 0
      });
    }

    /** @description Link the provider to the user and process and carry out further configurations for the google provider */
    await runMutation(internal.sync.integrations.mutation.createLinked, {
      userId,
      provider: "google",
      providerId: googleUser.id,
      calendarsId: calendarsId,
      email: googleUser.email,
      scopes: scope ? scope.split(" ") : [],
      refreshToken: encryptedRefreshToken,
      /** @description Add the watch list to the linked data watch for further determing of the next sync token to check if a calendar list settings (visibility, color, etc.) has been changed */
      watch: toWatch(watchLists, calendars?.nextSyncToken, calendars?.nextSyncToken)
    });

    return new Response(JSON.stringify({
      hasErr: false,
      data: calendarsId,
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
  const linkedAccount: ConvexLinkedAPIProps|null = await runQuery(internal.sync.integrations.query.linkedByProviderId, { userId, provider: "google", providerId });
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

  console.log("hasErr:", hasErr);
  console.log("data:", data);
  console.log("message:", message);

  /** 
   * @description Collect all the events for a given provider and calendarid and remove them all from the database
   * -> Use case: After a user unlinks a google account, all the events for the linked account should be deleted so that no chunks of events are left over */
  for (const calendarId of linkedAccount.calendarsId) {
    const calendar: ConvexCalendarAPIProps|null = await runQuery(internal.sync.integrations.query.calendarById, { _id: calendarId as Id<"calendar"> });
    if (!calendar) continue;

    /** @description Remove all the events for the given calendar id from the database */
    const events: ConvexEventsAPIProps[] = await runQuery(internal.sync.events.query.byProviderCalendarId, { userId, providerCalendarId: calendar.id });
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
      statusCode: 200,
      info: "i18n.convex.http.integrations.google.success.send",
    },
  }));
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



  const channelToken = req.headers.get("x-goog-channel-token");
  if (!channelToken) return new Response("i18n.convex.http.integrations.google.error.channelTokenNotFound", { status: 404 });

  /** @todo: Verschlüssel / Entschlüsseln des tokenPayload!!!!! */
  
  let tokenPayload: { userId: string; providerId: string; convexCalendarId: Id<"calendar">; calendarId: string } | null = null;
  try {
     tokenPayload = JSON.parse(channelToken);
   } catch (err) {
     console.error("invalid channel token", channelToken, err);
   }

  if (!tokenPayload) return new Response("i18n.convex.http.integrations.google.error.tokenPayloadNotFound", { status: 404 });
  if (!tokenPayload.convexCalendarId) return new Response("i18n.convex.http.integrations.google.error.tokenPayloadConvexCalendarIdNotFound", { status: 404 });
  if (!tokenPayload.providerId) return new Response("i18n.convex.http.integrations.google.error.tokenPayloadProviderIdNotFound", { status: 404 });

  const resourceId = req.headers.get("x-goog-resource-id");
  const channelId = req.headers.get("x-goog-channel-id");

  const calendar = convertToCleanObjectForUpdate(await runQuery(internal.sync.integrations.query.calendarById, { _id: tokenPayload.convexCalendarId as Id<"calendar"> }) as ConvexCalendarAPIProps);

  if (!calendar || !calendar.watch) return new Response("i18n.convex.http.integrations.google.error.calendarNotFound", { status: 404 });
  if (resourceId !== calendar.watch.resourceId) return new Response("i18n.convex.http.integrations.google.error.resourceIdMismatch", { status: 404 });
  if (channelId !== calendar.watch.id) return new Response("i18n.convex.http.integrations.google.error.channelIdMismatch", { status: 404 });

 //console.log("tokenPayload:", tokenPayload);

 console.log("calendar:", calendar);

 console.log(req.headers);


  const linkedAccounts = await runQuery(internal.sync.integrations.query.linkedByUser, { userId: tokenPayload.userId as Id<"users"> });
  const linkedAccount = linkedAccounts.find((item) => item.providerId === tokenPayload.providerId);
  if (!linkedAccount) return new Response("i18n.convex.http.integrations.google.error.linkedAccountNotFound", { status: 404 });


  //await runAction(internal.sync.integrations.google.action.stopChannelWatch, { channelId, resourceId, refreshToken });

  /** @description Fetch the specified colors for the calendar events and the calendar lists based on the colorId */
  const { data: colors }: ConvexActionReturnProps<IntegrationAPIGoogleCalendarColorsProps> = await runAction(internal.sync.integrations.google.action.fetchCalendarColors, { refreshToken: linkedAccount.refreshToken });

  const { data, hasErr, message } = await runAction(internal.sync.integrations.google.action.fetchCalendarEvents, { 
    refreshToken: linkedAccount.refreshToken, 
    calendarId: tokenPayload.calendarId, 
    nextSyncToken: calendar.watch.nextSyncToken as string });

  for (const event of data.items) {
    if (event.status === IntegrationAPICalendarEventStatusEnum.CONFIRMED) {
      /** @description Event has been newly created or has been updated -> Check if the event already exists in the database with the same eventProviderId */
      const _event: ConvexEventsAPIProps|null = await runQuery(internal.sync.events.query.byProviderId, { 
        userId: tokenPayload.userId as Id<"users">, 
        providerId: event.id 
      });

      if (_event) {

        await runMutation(internal.sync.events.mutation.update, {
          _id: _event._id,
          ...convertEventGoogleToConvex(
            _event.userId,
            _event.calendarId,
            event,
            colors?.event?.[event.colorId]?.background || calendar.backgroundColor
          ),
        });

      }
      
    }
  }


  const expiration = req.headers.get("x-goog-channel-expiration");
  const expirationMs = new Date(expiration).getTime();

  console.log("data:", data);

    await runMutation(internal.sync.integrations.mutation.updateCalendar, {
      _id: tokenPayload.convexCalendarId as Id<"calendar">,
      watch: toWatch({ 
        id: channelId,
        resourceId: resourceId,
        expiration: expirationMs,
      }, data.nextSyncToken, calendar.watch.nextSyncToken),
      eventsCount: data.items?.length ?? 0
    });

  // neuer eintrag => "confirmed"
  // eintrag bearbeitet => "confirmed"
  // eintrag gelöscht => "cancelled"

  return new Response("i18n.convex.http.integrations.google.success.watch", { status: 200 });
});

/**
 * @public
 * @since 0.0.10
 * @version 0.0.1
 * @description Handles the http action for watching a google calendar
 * @function */
export const httpActionGoogleWatchLists = httpAction(async ({ }, req) => {
  //console.log("called httpActionGoogleWatchLists", req);
  return new Response("i18n.convex.http.integrations.google.success.watch", { status: 200 });
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
 ): ConvexCalendarWatchAPIProps|null => {
   if (!watch?.id || !watch?.resourceId) return null;
   return {
     id: watch.id,
     resourceId: watch.resourceId,
     expiration: typeof watch.expiration === "string" ? Number(watch.expiration) : watch.expiration ?? 0,
     nextSyncToken: nextSyncToken ?? "",
     lastSyncToken: lastSyncToken ?? "",
   };
 };