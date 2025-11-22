import { httpAction } from "../../_generated/server";
import { internal } from "../../_generated/api";
import { Id } from "../../_generated/dataModel";
import { APIGoogleCalendarChannelWatchProps, APIGoogleCalendarEventProps, APIGoogleCalendarEventsProps, APIGoogleCalendarEventTypeEnum, APIGoogleCalendarListProps, APIGoogleCalendarTokenExchangeProps, ConvexActionReturnProps, ConvexActionServerityEnum, ConvexEventsAPIProps, ConvexWatchProps, EncryptedTokenProps } from "../../../Types";
import { convertEventGoogleToConvex } from "../../../Convert";

/**
 * @public
 * @since 0.0.9
 * @version 0.0.1
 * @description Handles the http action for linking a google account
 * @type */
export type HttpActionLinkGoogleProps = {
  serverAuthCode: string;
  googleUser: { id: string; email: string };
  userId: Id<"users">;
}

/**
 * @public
 * @since 0.0.9
 * @version 0.0.2
 * @description Handles the http action for linking a google account
 * @param {Object} param0
 * @param {string} param0.userId - User identification
 * @param {string} param0.provider - Oauth provider which has been used for the authentication flow
 * @param {string} param0.providerId - Provider identification
 * @param {string} param0.email - Email-address by oauth provider or email authentication
 * @param {array} param0.scopes - Scopes which have been used for the authentication flow
 * @param {string} param0.refreshToken - Refresh token for the authentication flow 
 * @function */
export const httpActionGoogleExchange= httpAction(async ({ runMutation, runAction, runQuery }, req) => {
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
  const { serverAuthCode, googleUser, userId }: HttpActionLinkGoogleProps = await req.json();

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
  const { refresh_token, scope }: APIGoogleCalendarTokenExchangeProps = await res.json();
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

  /** @description Check if the account is already linked */
  let linkedAccount = await runQuery(internal.sync.integrations.query.linkedByProviderId, { userId, provider: "google", providerId: googleUser.id });
  if (!linkedAccount) {
    const providerWatchId: Id<"watch">[] = [];

    /** @description Start the channel watch for the calendar lists */
    const { data: watchLists }: ConvexActionReturnProps<APIGoogleCalendarChannelWatchProps> = await runAction(internal.sync.integrations.google.action.startWatchCalendarLists, { userId, refreshToken: encryptedRefreshToken });
    
    /** @description Fetch the calendar list for the user -> For all the integrated calendars the channel watch should be started so that the calendar events can be fetched incrementally */
    const { data: calendars }: ConvexActionReturnProps<APIGoogleCalendarListProps> = await runAction(internal.sync.integrations.google.action.fetchCalendarList, { refreshToken: encryptedRefreshToken });
    for (let calendar of calendars.items) {
      /** 
       * @description Start the channel watch for the calendar -> This is not needed for the first sync because the initial data is fetched with the fetchCalendarEvents action
       * -> The future handling is controlled by the nextSyncToken which is returned by the google calendar api and will only fetch the newly created events inside the channel watch callback function -> httpActionGoogleWatch */
      const { 
        data: watchEvents, 
        hasErr: hasErrWatch 
      }: ConvexActionReturnProps<APIGoogleCalendarChannelWatchProps> = await runAction(internal.sync.integrations.google.action.startWatchCalendarEvents, { 
        userId, 
        refreshToken: encryptedRefreshToken, 
        calendarId: calendar.id 
      });

      /** @description Fetch the calendar events for the calendar */
      const { 
        data: events, 
        hasErr: hasErrEvents 
      }: ConvexActionReturnProps<APIGoogleCalendarEventsProps> = await runAction(internal.sync.integrations.google.action.fetchCalendarEvents, {
        refreshToken: encryptedRefreshToken,
        calendarId: calendar.id,
      });

      if (!hasErrEvents && events?.items) {
        for (let event of events?.items
          .filter((event) => event.eventType !== APIGoogleCalendarEventTypeEnum.BIRTHDAY 
         )) await runMutation(internal.sync.events.mutation.create, convertEventGoogleToConvex(userId.toString(), calendar.id, event));
      }

      /** @description If the channel watch has been started successfully, create the linked data for the calendar */
      if (!hasErrWatch) {
        /** 
         * @description Create the linked data for the calendar -> Additional information for the linked provider account
         * -> The sync token is needed for reading the newly created events through the google calendar api */
        providerWatchId.push(await runMutation(internal.sync.integrations.mutation.createWatch, {
          calendarId: calendar.id,
          /** @description Add the watch events to the linked data watch for further determing of the next sync token to check if a calendar events (created, updated, deleted) has been changed */
          watch: toWatch(watchEvents, events?.nextSyncToken, events?.nextSyncToken),
        }));
      }
    }

    /** 
     * @description Link the provider to the user and process and carry out further configurations for the google provider
     * -> Link the provider
     * -> Read all the available calendars for the user
     * -> Start the channel watch for each calendar
     * -> Fetch the initial data for the different calendars */
    const _id: Id<"linked"> = await runMutation(internal.sync.integrations.mutation.createLinked, {
      userId,
      provider: "google",
      providerId: googleUser.id,
      providerWatchId: providerWatchId,
      email: googleUser.email,
      scopes: scope ? scope.split(" ") : [],
      refreshToken: encryptedRefreshToken,
      /** @description Add the watch list to the linked data watch for further determing of the next sync token to check if a calendar list settings (visibility, color, etc.) has been changed */
      watch: toWatch(watchLists, calendars?.nextSyncToken, calendars?.nextSyncToken)
    });



    return new Response(JSON.stringify({
      hasErr: false,
      data: null,
      message: {
        statusCode: 200,
        info: "i18n.convex.http.integrations.google.success.linked",
      },
    }));
  }
});

/**
 * @public
 * @since 0.0.10
 * @version 0.0.1
 * @description Handles the http action for watching a google calendar
 * @function */
export const httpActionGoogleWatchEvents = httpAction(async ({ }, req) => {
  console.log("called httpActionGoogleWatchEvents", req);
  return new Response("i18n.convex.http.integrations.google.success.watch", { status: 200 });
});

/**
 * @public
 * @since 0.0.10
 * @version 0.0.1
 * @description Handles the http action for watching a google calendar
 * @function */
export const httpActionGoogleWatchLists = httpAction(async ({ }, req) => {
  console.log("called httpActionGoogleWatchLists", req);
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
 * @public
 * @since 0.0.10
 * @version 0.0.1
 * @description Handles the watch data for the linked data -> Creates a new watch object
 * @param {APIGoogleCalendarChannelWatchProps} watch - The watch object from the google calendar api
 * @param {string} nextSyncToken - The next sync token for the watch
 * @param {string} lastSyncToken - The last sync token for the watch
 * @function */
 const toWatch = (
   watch: APIGoogleCalendarChannelWatchProps | undefined,
   nextSyncToken?: string,
   lastSyncToken?: string
 ): ConvexWatchProps|null => {
   if (!watch?.id || !watch?.resourceId) return null;
   return {
     id: watch.id,
     resourceId: watch.resourceId,
     expiration: typeof watch.expiration === "string" ? Number(watch.expiration) : watch.expiration ?? 0,
     nextSyncToken: nextSyncToken ?? "",
     lastSyncToken: lastSyncToken ?? "",
   };
 };