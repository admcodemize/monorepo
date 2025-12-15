"use node";
import { ConvexError, v } from "convex/values";
import { internal } from "../../../_generated/api";
import { internalAction } from "../../../_generated/server";
import { encryptedTokenSchemaObj } from "../../../schema";
import { 
  IntegrationAPIGoogleCalendarChannelWatchProps, 
  IntegrationAPIGoogleCalendarColorsProps, 
  IntegrationAPIGoogleCalendarEventProps, 
  IntegrationAPIGoogleCalendarEventsProps, 
  IntegrationAPIGoogleCalendarListProps, 
  ConvexActionReturnProps, 
  ConvexActionServerityEnum, 
  IntegrationAPIGoogleCalendarTokenExchangeProps,
} from "../../../../Types";
import { convexError, fetchTypedConvex } from "../../../../Fetch";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.9
 * @version 0.0.2
 * @description Refreshes the access token
 * @param {Object} param0
 * @param {string} param0.refreshToken - The refresh token to refresh
 * @function */
export const refreshAccessToken = internalAction({
  args: { refreshToken: v.object(encryptedTokenSchemaObj) },
  handler: async ({ runAction }, { refreshToken }): Promise<ConvexActionReturnProps<IntegrationAPIGoogleCalendarTokenExchangeProps>> => {
    /** @description Decrypt the refresh token */
    const decryptedRefreshToken = await runAction(internal.sync.integrations.action.decryptedToken, { encryptedToken: refreshToken });

    /** @description Fetch the newly created refresh token which is used for the token exchange in further requests */
    const [err, res] = await fetchTypedConvex(fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: urlFormEncodedHeader(),
      body: new URLSearchParams({
        client_id: process.env.PROVIDER_GOOGLE_WEB_CLIENT_ID!,
        client_secret: process.env.PROVIDER_GOOGLE_WEB_CLIENT_SECRET!,
        grant_type: 'refresh_token',
        refresh_token: decryptedRefreshToken,
      }),
    }), "BLOXIE_HAR_RAT_E01");

    /** @description If the token refresh fails, return the error */
    if (err || !res.ok) throw new ConvexError(err ? err.data : convexError({
      code: res.status,
      info: await res.text(),
      severity: ConvexActionServerityEnum.ERROR,
      name: "BLOXIE_HAR_RAT_E02",
    }));

    return {
      data: await res.json() as IntegrationAPIGoogleCalendarTokenExchangeProps,
      convex: {
        code: 200,
        severity: ConvexActionServerityEnum.SUCCESS,
        name: "BLOXIE_HAR_RAT_S01",
      },
    };
  }
});

/**
 * @public
 * @since 0.0.9
 * @version 0.0.3
 * @description Fetches the calendar list from Google
 * @param {Object} param0
 * @param {string} param0.refreshToken - The refresh token to fetch the calendar list
 * @function */
export const fetchCalendarList = internalAction({
  args: { refreshToken: v.object(encryptedTokenSchemaObj) },
  handler: async ({ runAction }, { refreshToken }): Promise<ConvexActionReturnProps<IntegrationAPIGoogleCalendarListProps>> => {
    /** @description Refresh the access token for fetching the calendar list */
    const [errRefresh, refresh] = await fetchTypedConvex(runAction(internal.sync.integrations.google.action.refreshAccessToken, { refreshToken }));
    if (errRefresh) throw new ConvexError(errRefresh.data);

    /** @description Fetch the calendar list for including all the integrated calendars in the further process */
    const [errFetch, res] = await fetchTypedConvex(fetch(`https://www.googleapis.com/calendar/v3/users/me/calendarList`, {
      headers: bearerHeader(refresh.data?.access_token)
    }), "BLOXIE_HAR_FCL_E01");

    if (errFetch || !res.ok) throw new ConvexError(errFetch ? errFetch.data : convexError({
      code: res.status,
      info: await res.text(),
      severity: ConvexActionServerityEnum.ERROR,
      name: "BLOXIE_HAR_FCL_E02",
    }));

    const data: IntegrationAPIGoogleCalendarListProps = await res.json();

    /** @description Remove the default calendars "weeknum" and "holiday" from the calendar list */
    data.items = data.items.filter((item) => !["#weeknum@group.v.calendar.google.com", "#holiday@group.v.calendar.google.com"]
      .some((needle) => item.id.includes(needle)));

    return { 
      data,
      convex: {
        code: 200,
        severity: ConvexActionServerityEnum.SUCCESS,
        name: "BLOXIE_HAR_FCL_S01",
      }
    };
  }
});

/**
 * @public
 * @since 0.0.9
 * @version 0.0.2
 * @description Fetches the calendar events from Google
 * @param {Object} param0
 * @param {string} param0.userId - The user id to fetch the calendar events
 * @param {string} param0.calendarId - The calendar id to fetch the calendar events
 * @param {string} param0.refreshToken - The refresh token to fetch the calendar events
 * @function */
export const fetchCalendarEvents = internalAction({
  args: { 
    calendarId: v.string(),
    refreshToken: v.object(encryptedTokenSchemaObj),
    nextSyncToken: v.optional(v.string()),
  },
  handler: async ({ runAction }, { refreshToken, calendarId, nextSyncToken }): Promise<ConvexActionReturnProps<IntegrationAPIGoogleCalendarEventsProps>> => {
    let data: IntegrationAPIGoogleCalendarEventsProps;
    let items: IntegrationAPIGoogleCalendarEventProps[] = [];
    let nextPageToken: string|undefined;

    /** @description Refresh the access token for fetching the calendar list */
    const [errRefresh, refresh] = await fetchTypedConvex(runAction(internal.sync.integrations.google.action.refreshAccessToken, { refreshToken }));
    if (errRefresh) throw new ConvexError(errRefresh.data);

    /** @description Build the query parameters for the calendar events fetch */
    const now: Date = new Date();
    let params = new URLSearchParams({
      showDeleted: 'false', 
      singleEvents: 'true',
      timeMin: new Date(now.setFullYear(now.getFullYear() - 2)).toISOString(), // 2 years in the past
    } as Record<string, string>);

    if (nextSyncToken) params = new URLSearchParams({
      syncToken: nextSyncToken,
    } as Record<string, string>);

    do {
      /** @description The page token is needed for fetching the next page of calendar events when not all events have been fetched in one request */
      if (nextPageToken) params.set('pageToken', nextPageToken);

      /** @description Fetch the calendar events for the current calendar */
      const [errFetch, res] = await fetchTypedConvex(fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params}`, {
        headers: bearerHeader(refresh.data?.access_token),
      }), "BLOXIE_HAR_FCE_E01");

      /** @description If the watch has expired, return an error object without throwing an error! */
      if (res.status === 410) return {
        convex: convexError({
          code: 410,
          severity: ConvexActionServerityEnum.ERROR,
          name: errFetch?.data?.name || "BLOXIE_HAR_FCE_E03",
        }),
      }

      if (errFetch || !res.ok) throw new ConvexError(errFetch ? errFetch.data : convexError({
        code: res.status,
        info: await res.text(),
        severity: ConvexActionServerityEnum.ERROR,
        name: "BLOXIE_HAR_FCE_E02",
      }));

      /** @description Get the calendar events and store them in the database inclusive next sync token */
      data = await res.json();
      items = [...items, ...data.items];

      nextPageToken = data?.nextPageToken;
    } while (nextPageToken);

    data.items = items;

    return { 
      data,
      convex: {
        code: 200,
        severity: ConvexActionServerityEnum.SUCCESS,
        name: "BLOXIE_HAR_FCE_S01",
      }
    };
  }
});

/**
 * @public
 * @since 0.0.23
 * @version 0.0.1
 * @description Fetches the calendar events instances from Google based on a recurring event id
 * @param {Object} param0
 * @param {string} param0.calendarId - The calendar id to fetch the calendar events instances
 * @param {string} param0.eventId - The event id to fetch the calendar events instances
 * @param {string} param0.refreshToken - The refresh token to fetch the calendar events instances
 * @function */
export const fetchCalendarEventsInstances = internalAction({
  args: {
    calendarId: v.string(),
    eventId: v.string(),
    refreshToken: v.object(encryptedTokenSchemaObj),
  },
  handler: async ({ runAction }, { refreshToken, calendarId, eventId }): Promise<ConvexActionReturnProps<any>> => {
    let data: IntegrationAPIGoogleCalendarEventsProps;
    let items: IntegrationAPIGoogleCalendarEventProps[] = [];
    let nextPageToken: string|undefined;

    /** @description Refresh the access token for fetching the calendar list */
    const [errRefresh, refresh] = await fetchTypedConvex(runAction(internal.sync.integrations.google.action.refreshAccessToken, { refreshToken }));
    if (errRefresh) throw new ConvexError(errRefresh.data);

    /** @description Build the query parameters for the calendar events fetch */
    const now: Date = new Date();
    let params = new URLSearchParams({
      showDeleted: 'false', 
      singleEvents: 'true',
      timeMin: new Date(now.setFullYear(now.getFullYear() - 2)).toISOString(), // 2 years in the past
    } as Record<string, string>);

    do {
      /** @description The page token is needed for fetching the next page of calendar events when not all events have been fetched in one request */
      if (nextPageToken) params.set('pageToken', nextPageToken);

      /** @description Fetch the calendar events for the current calendar */
      const [errFetch, res] = await fetchTypedConvex(fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}/instances?${params}`, {
        headers: bearerHeader(refresh.data?.access_token),
      }), "BLOXIE_HAR_FCEI_E01");

      /** @description If the watch has expired, return an error object without throwing an error! */
      if (res.status === 410) return {
        convex: convexError({
          code: 410,
          severity: ConvexActionServerityEnum.ERROR,
          name: errFetch?.data?.name || "BLOXIE_HAR_FCEI_E03",
        }),
      }

      if (errFetch || !res.ok) throw new ConvexError(errFetch ? errFetch.data : convexError({
        code: res.status,
        info: await res.text(),
        severity: ConvexActionServerityEnum.ERROR,
        name: "BLOXIE_HAR_FCEI_E02",
      }));

      /** @description Get the calendar events and store them in the database inclusive next sync token */
      data = await res.json();
      items = [...items, ...data.items];

      nextPageToken = data?.nextPageToken;
    } while (nextPageToken);

    data.items = items;

    return { 
      data,
      convex: {
        code: 200,
        severity: ConvexActionServerityEnum.SUCCESS,
        name: "BLOXIE_HAR_FCEI_S01",
      }
    };
  }
});

/**
 * @public
 * @since 0.0.23
 * @version 0.0.1
 * @description Fetches a singlecalendar event from Google
 * @param {Object} param0
 * @param {string} param0.calendarId - The calendar id 
 * @param {string} param0.eventId - The event id to fetch the calendar event for further informations such as recurrence rules
 * @param {string} param0.refreshToken - The refresh token to fetch the calendar event
 * @function */
export const fetchCalendarEvent = internalAction({
  args: {
    calendarId: v.string(),
    eventId: v.string(),
    refreshToken: v.object(encryptedTokenSchemaObj),
  },
  handler: async ({ runAction }, { refreshToken, calendarId, eventId }): Promise<ConvexActionReturnProps<any>> => {
    /** @description Refresh the access token for fetching the calendar list */
    const [errRefresh, refresh] = await fetchTypedConvex(runAction(internal.sync.integrations.google.action.refreshAccessToken, { refreshToken }));
    if (errRefresh) throw new ConvexError(errRefresh.data);

    /** @description Build the query parameters for the calendar events fetch */
    let params = new URLSearchParams({
      showDeleted: "true",        
      singleEvents: "true",      
      alwaysIncludeEmail: "true"
    } as Record<string, string>);

    const [errFetch, res] = await fetchTypedConvex(fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}?${params}`, { 
      headers: bearerHeader(refresh.data?.access_token) 
    }), "BLOXIE_HAR_FCSE_E02");

    if (errFetch) throw new ConvexError(errFetch.data);
    return { 
      data: await res.json(),
      convex: {
        code: 200,
        severity: ConvexActionServerityEnum.SUCCESS,
        name: "BLOXIE_HAR_FCSE_S01",
      }
    };
  }
});

/**
 * @public
 * @since 0.0.11
 * @version 0.0.2
 * @description Fetches the calendar colors from Google
 * @param {Object} param0
 * @param {string} param0.refreshToken - The refresh token to fetch the calendar colors
 * @function */
export const fetchCalendarColors = internalAction({
  args: { refreshToken: v.object(encryptedTokenSchemaObj) },
  handler: async ({ runAction }, { refreshToken }): Promise<ConvexActionReturnProps<IntegrationAPIGoogleCalendarColorsProps>> => {
    /** @description Refresh the access token for fetching the calendar list */
    const [errRefresh, refresh] = await fetchTypedConvex(runAction(internal.sync.integrations.google.action.refreshAccessToken, { refreshToken }));
    if (errRefresh) throw new ConvexError(errRefresh.data);

    const [errFetch, res] = await fetchTypedConvex(fetch("https://www.googleapis.com/calendar/v3/colors", {
      headers: bearerHeader(refresh.data?.access_token),
    }), "BLOXIE_HAR_FCC_E01");

    if (errFetch || !res.ok) throw new ConvexError(errFetch ? errFetch.data : convexError({
      code: res.status,
      info: await res.text(),
      severity: ConvexActionServerityEnum.ERROR,
      name: "BLOXIE_HAR_FCC_E02",
    }));

    return {
      data: await res.json() as IntegrationAPIGoogleCalendarColorsProps,
      convex: {
        code: 200,
        severity: ConvexActionServerityEnum.SUCCESS,
        name: "BLOXIE_HAR_FCC_S01",
      }
    };
  }
});

/**
 * @public
 * @since 0.0.10
 * @version 0.0.2
 * @description Stops a channel watch for a calendar
 * @param {Object} param0
 * @param {string} param0.channelId - The channel id to stop the channel watch for
 * @param {string} param0.resourceId - The resource id to stop the channel watch for
 * @param {string} param0.calendarId - The calendar id to stop the channel watch for
 * @function */
export const stopChannelWatch = internalAction({
  args: {
    channelId: v.string(),
    resourceId: v.string(),
    refreshToken: v.object(encryptedTokenSchemaObj),  
  },
  handler: async ({ runAction }, { channelId, resourceId, refreshToken }): Promise<ConvexActionReturnProps<IntegrationAPIGoogleCalendarChannelWatchProps>> => {
    /** @description Refresh the access token for fetching the calendar list */
    const [errRefresh, refresh] = await fetchTypedConvex(runAction(internal.sync.integrations.google.action.refreshAccessToken, { refreshToken }));
    if (errRefresh) throw new ConvexError(errRefresh.data);

    /** @description Stop the channel watch for the calendar */
    const [errStop, response] = await fetchTypedConvex(fetch(`https://www.googleapis.com/calendar/v3/channels/stop`, {
      method: "POST",
      headers: bearerHeader(refresh.data?.access_token),
      body: JSON.stringify({ 
        id: channelId,
        resourceId: resourceId,
      })
    }), "BLOXIE_HAR_SCW_E01");

    if (errStop || !response.ok) throw new ConvexError(errStop ? errStop.data : convexError({
      code: response.status,
      info: await response.text(),
      severity: ConvexActionServerityEnum.ERROR,
      name: "BLOXIE_HAR_SCW_E02",
    }));

    return {
      data: {} as IntegrationAPIGoogleCalendarChannelWatchProps,
      convex: {
        code: 200,
        severity: ConvexActionServerityEnum.SUCCESS,
        name: "BLOXIE_HAR_SCW_S01",
      }
    };
  }
});

/**
 * @public
 * @since 0.0.10
 * @version 0.0.1
 * @description Starts a channel watch for a calendar
 * @param {Object} param0
 * @param {string} param0.userId - The user id to register the channel watch for
 * @param {string} param0.linkedId - The linked id to register the channel watch for
 * @param {string} param0.calendarId - The calendar id to register the channel watch for
 * @returns {ConvexActionReturnProps<IntegrationAPIGoogleCalendarChannelWatchProps>}
 * @function */
export const startWatchCalendarEvents = internalAction({
  args: { 
    userId: v.id('users'),
    providerId: v.string(),
    convexCalendarId: v.id('calendar'),
    refreshToken: v.object(encryptedTokenSchemaObj),
    calendarId: v.string(),
  },
  handler: async ({ runAction }, { userId, providerId, convexCalendarId, refreshToken, calendarId }): Promise<ConvexActionReturnProps<IntegrationAPIGoogleCalendarChannelWatchProps>> => {
    /** @description Refresh the access token for fetching the calendar list */
    const [errRefresh, refresh] = await fetchTypedConvex(runAction(internal.sync.integrations.google.action.refreshAccessToken, { refreshToken }));
    if (errRefresh) throw new ConvexError(errRefresh.data);

    const channelId = crypto.randomUUID();

    /** @description Encrypt the payload for the further process and transfering between the different actions */
    const encryptedPayload = await runAction(internal.sync.integrations.action.encryptedPayload, { 
      payload: JSON.stringify({ 
        u: userId, 
        p: providerId, 
        c: convexCalendarId
      }) 
    });

    /** @description Register the channel watch for the calendar */
    const [errWatch, response] = await fetchTypedConvex(fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/watch`, {
      method: 'POST',
      headers: bearerHeader(refresh.data?.access_token),
      body: JSON.stringify({ 
        id: channelId,
        type: 'web_hook',
        address: `https://harmless-dodo-18.convex.site/integrations/google/events/watch`,
        token: JSON.stringify(encryptedPayload)
      }),
    }), "BLOXIE_HAR_SWC_E01");
  
    if (errWatch || !response.ok) throw new ConvexError(errWatch ? errWatch.data : convexError({
      code: response.status,
      info: await response.text(),
      severity: ConvexActionServerityEnum.ERROR,
      name: "BLOXIE_HAR_SWC_E02",
    }));

    return {
      data: await response.json() as IntegrationAPIGoogleCalendarChannelWatchProps,
      convex: {
        code: 200,
        info: "i18n.convex.http.integrations.google.success.watch",
        severity: ConvexActionServerityEnum.SUCCESS,
        name: "BLOXIE_HAR_SWC_S01",
      }
    };
  }
});

/**
 * @public
 * @since 0.0.10
 * @version 0.0.3
 * @description Starts a channel watch for the calendar list -> Used for adding/removing events in convex database!
 * @param {Object} param0
 * @param {string} param0.userId - The user id to register the channel watch for
 * @param {string} param0.refreshToken - The refresh token to register the channel watch for
 * @returns {ConvexActionReturnProps<IntegrationAPIGoogleCalendarChannelWatchProps>}
 * @function */
export const startWatchCalendarLists = internalAction({
  args: {
    userId: v.id('users'),
    providerId: v.string(),
    refreshToken: v.object(encryptedTokenSchemaObj),
  },
  handler: async ({ runAction }, { userId, providerId, refreshToken }): Promise<ConvexActionReturnProps<IntegrationAPIGoogleCalendarChannelWatchProps>> => {
    /** @description Refresh the access token for fetching the calendar list */
    const [errRefresh, refresh] = await fetchTypedConvex(runAction(internal.sync.integrations.google.action.refreshAccessToken, { refreshToken }));
    if (errRefresh) throw new ConvexError(errRefresh.data);

    const channelId = crypto.randomUUID();

    /** @description Encrypt the payload for the further process and transfering between the different actions */
    const encryptedPayload = await runAction(internal.sync.integrations.action.encryptedPayload, { payload: JSON.stringify({ userId, providerId }) });

    /** @description Register the channel watch for the calendar */
    const [errWatch, response] = await fetchTypedConvex(fetch(`https://www.googleapis.com/calendar/v3/users/me/calendarList/watch`, {
      method: 'POST',
      headers: bearerHeader(refresh.data?.access_token),
      body: JSON.stringify({ 
        id: channelId,
        type: 'web_hook',
        address: `https://harmless-dodo-18.convex.site/integrations/google/lists/watch`,
        /** @desciption Has to be a stringified object. If not the fetch will fail and the response will be invalid!! */
        token: JSON.stringify(encryptedPayload)
      }),
    }));

    if (errWatch || !response.ok) throw new ConvexError(errWatch ? errWatch.data : convexError({
      code: response.status,
      info: await response.text(),
      severity: ConvexActionServerityEnum.ERROR,
      name: "BLOXIE_HAR_WCL_E01",
    }));

    return {
      data: await response.json() as IntegrationAPIGoogleCalendarChannelWatchProps,
      convex: {
        code: 200,
        info: "i18n.convex.http.integrations.google.success.watch",
        severity: ConvexActionServerityEnum.SUCCESS,
        name: "BLOXIE_HAR_WCL_S01",
      }
    };
  }
});

/**
 * @public
 * @since 0.0.14
 * @version 0.0.2
 * @description Sends an email via Gmail
 * @param {Object} param0
 * @param {string} param0.refreshToken - The refresh token to send the email
 * @param {string} param0.from - The sender email address (e.g. stoecklim7@gmail.com)
 * @param {string} param0.to - The recipient email address (e.g. marc.stoeckli@all-for-one.com)
 * @param {string} param0.subject - The subject of the email
 * @param {string} param0.body - The body of the email
 * @function */
export const sendGmail = internalAction({
  args: { 
    refreshToken: v.object(encryptedTokenSchemaObj),
    from: v.string(),
    to: v.string(),
    subject: v.string(),
    body: v.string(),  
  },
  handler: async ({ runAction }, { refreshToken, from, to, subject, body }) => {
    /** @description Refresh the access token for sending the email */
    const [errRefresh, refresh] = await fetchTypedConvex(runAction(internal.sync.integrations.google.action.refreshAccessToken, { refreshToken }));
    if (errRefresh) throw new ConvexError(errRefresh.data);

    /** @description Send the email via Gmail */
    async function sendGmail(access_token: string, message: string) {
      const raw = Buffer.from(message)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    
      const [errSend, response] = await fetchTypedConvex(fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
        method: "POST",
        headers: bearerHeader(access_token),
        body: JSON.stringify({ raw }),
      }));

      if (errSend || !response.ok) throw new ConvexError(errSend ? errSend.data : convexError({
        code: response.status,
        info: await response.text(),
        severity: ConvexActionServerityEnum.ERROR,
        name: "BLOXIE_HAR_SG_E01",
      }));

      return {
        data: await response.json() as IntegrationAPIGoogleCalendarColorsProps,
        convex: {
          code: 200,
          info: "i18n.convex.http.integrations.google.success.send",
          severity: ConvexActionServerityEnum.SUCCESS,
          name: "BLOXIE_HAR_SG_S01",
        }
      };
    }
    
    const email = [
      `From: ${from} <${from}>`,
      `To: ${to} <${to}>`,
      `Subject: ${subject}`,
      "Content-Type: text/plain; charset=UTF-8",
      "",
      body,
    ].join("\r\n");
    
    return await sendGmail(refresh.data?.access_token, email);
  }
});

/**
 * @private
 * @since 0.0.21
 * @version 0.0.1
 * @description Creates a bearer header for the google calendar api
 * @param {string} access_token - The access token to create the bearer header for
 * @function */
const bearerHeader = (
  access_token: string
): HeadersInit => ({
  Authorization: `Bearer ${access_token}`,
  Accept: 'application/json',
});

/**
 * @private
 * @since 0.0.21
 * @version 0.0.1
 * @description Creates a url form encoded header for the google calendar api
 * -> The token endpoint of the google calendar api requires a url form encoded body for interpretation of the body by the google calendar api
 * @function */
const urlFormEncodedHeader = (): HeadersInit => ({
  'Content-Type': 'application/x-www-form-urlencoded',
});