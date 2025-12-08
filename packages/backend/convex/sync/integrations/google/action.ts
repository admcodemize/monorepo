"use node";
import { v } from "convex/values";
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
  ConvexActionServerityEnum 
} from "../../../../Types";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.9
 * @version 0.0.1
 * @description Refreshes the access token
 * @param {Object} param0
 * @param {string} param0.refreshToken - The refresh token to refresh
 * @function */
export const refreshAccessToken = internalAction({
  args: { refreshToken: v.object(encryptedTokenSchemaObj) },
  handler: async ({ runAction }, { refreshToken }) => {
    const decryptedRefreshToken = await runAction(internal.sync.integrations.action.decryptedToken, { encryptedToken: refreshToken });
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.PROVIDER_GOOGLE_WEB_CLIENT_ID!,
        client_secret: process.env.PROVIDER_GOOGLE_WEB_CLIENT_SECRET!,
        grant_type: 'refresh_token',
        refresh_token: decryptedRefreshToken,
      }),
    });

    /** @description If the token refresh fails, return the error */
    if (!response.ok) throw new Error(await response.text());

    /** @description Return the refreshed token */
    return await response.json(); 
  }
});

/**
 * @public
 * @since 0.0.10
 * @version 0.0.1
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
  handler: async ({ runAction, runQuery }, { userId, providerId, refreshToken }): Promise<ConvexActionReturnProps<IntegrationAPIGoogleCalendarChannelWatchProps>> => {
    /** @description Refresh the access token for registering the channel watch */
    const { access_token } = await runAction(internal.sync.integrations.google.action.refreshAccessToken, { refreshToken });
    const channelId = crypto.randomUUID();

    /** @description Register the channel watch for the calendar */
    const res = await fetch(`https://www.googleapis.com/calendar/v3/users/me/calendarList/watch`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/json',
      },
      body: JSON.stringify({ 
        id: channelId,
        type: 'web_hook',
        address: `https://harmless-dodo-18.convex.site/integrations/google/lists/watch`,
        token: JSON.stringify({ userId, providerId })
      }),
    });

    if (!res.ok) return {
      hasErr: true,
      data: {} as IntegrationAPIGoogleCalendarChannelWatchProps,
      message: {
        statusCode: 500,
        info: await res.text(),
        severity: ConvexActionServerityEnum.ERROR,
        reason: "BLOXIE_HAR_E07",
      },
    };

    return {
      hasErr: false,
      data: await res.json() as IntegrationAPIGoogleCalendarChannelWatchProps,
      message: {
        statusCode: 200,
        info: "i18n.convex.http.integrations.google.success.watch",
        severity: ConvexActionServerityEnum.SUCCESS
      },
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
  handler: async ({ runAction, runQuery }, { userId, providerId, convexCalendarId, refreshToken, calendarId }): Promise<ConvexActionReturnProps<IntegrationAPIGoogleCalendarChannelWatchProps>> => {
    /** @description Refresh the access token for registering the channel watch */
    const { access_token } = await runAction(internal.sync.integrations.google.action.refreshAccessToken, { refreshToken });
    const channelId = crypto.randomUUID();

    /** @description Register the channel watch for the calendar */
    const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/watch`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/json',
      },
      body: JSON.stringify({ 
        id: channelId,
        type: 'web_hook',
        address: `https://harmless-dodo-18.convex.site/integrations/google/events/watch`,
        token: JSON.stringify({ userId, providerId, convexCalendarId, calendarId })
      }),
    });

    /** @description Starting the channel watch has failed */
    if (!res.ok) return {
      hasErr: true,
      data: {} as IntegrationAPIGoogleCalendarChannelWatchProps,
      message: {
        statusCode: 500,
        info: await res.text(),
        severity: ConvexActionServerityEnum.ERROR,
        reason: "BLOXIE_HAR_E04",
      },
    };

    return {
      hasErr: false,
      data: await res.json() as IntegrationAPIGoogleCalendarChannelWatchProps,
      message: {
        statusCode: 200,
        info: "i18n.convex.http.integrations.google.success.watch",
        severity: ConvexActionServerityEnum.SUCCESS
      },
    };
  }
});

/**
 * @public
 * @since 0.0.10
 * @version 0.0.1
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
  handler: async ({ runAction }, { channelId, resourceId, refreshToken }) => {
    /** @description Refresh the access token for stopping the channel watch */
    const { access_token } = await runAction(internal.sync.integrations.google.action.refreshAccessToken, { refreshToken });

    /** @description Stop the channel watch for the calendar */
    const res = await fetch(`https://www.googleapis.com/calendar/v3/channels/stop`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/json',
      },
      body: JSON.stringify({ 
        id: channelId,
        resourceId: resourceId,
      })
    });

    return {
      hasErr: !res.ok,
      data: {} as IntegrationAPIGoogleCalendarChannelWatchProps,
      message: {
        statusCode: res.ok ? 200 : 500,
        info: res.ok ? "i18n.convex.http.integrations.google.success.stopChannelWatch" : await res.text(),
        severity: res.ok ? ConvexActionServerityEnum.SUCCESS : ConvexActionServerityEnum.ERROR,
        reason: res.ok ? "BLOXIE_HAR_S03" : "BLOXIE_HAR_E09",
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
      /** @description Refresh the access token for fetching the calendar events */
    const { access_token } = await runAction(internal.sync.integrations.google.action.refreshAccessToken, { refreshToken });

    /** @description Fetch the calendar list for including all the integrated calendars in the further process */
    const res = await fetch(`https://www.googleapis.com/calendar/v3/users/me/calendarList`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/json',
      },
    });

    /** @description If the calendar list fetch fails, return the error */
    if (!res.ok) return {
      hasErr: true,
      data: {} as IntegrationAPIGoogleCalendarListProps,
      message: {
        statusCode: 500,
        info: await res.text(),
        severity: ConvexActionServerityEnum.ERROR,
        reason: "BLOXIE_HAR_E05",
      },
    };

    const data: IntegrationAPIGoogleCalendarListProps = await res.json();

    /** @description Remove the default calendars "weeknum" and "holiday" from the calendar list */
    const blocklist = ["#weeknum@group.v.calendar.google.com", "#holiday@group.v.calendar.google.com"];
    data.items = data.items.filter((item) => !blocklist.some((needle) => item.id.includes(needle)));

    return {
      hasErr: false,
      data,
      message: {
        statusCode: 200,
        severity: ConvexActionServerityEnum.SUCCESS,
        reason: "BLOXIE_HAR_S02",
      },
    };
  }
});

/**
 * @public
 * @since 0.0.9
 * @version 0.0.1
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

    /** @description Refresh the access token for fetching the calendar events */
    const { access_token } = await runAction(internal.sync.integrations.google.action.refreshAccessToken, { refreshToken });

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
      const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: 'application/json',
        },
      });

      /** @description If the calendar events fetch fails, return the error */
      if (!res.ok) return {
        hasErr: true,
        data: {} as IntegrationAPIGoogleCalendarEventsProps,
        message: {
          statusCode: 500,
          info: await res.text(),
          severity: ConvexActionServerityEnum.ERROR,
          reason: "BLOXIE_HAR_E06",
        }
      };

      /** @description Get the calendar events and store them in the database inclusive next sync token */
      data = await res.json();
      items = [...items, ...data.items];

      nextPageToken = data?.nextPageToken;
    } while (nextPageToken);

    data.items = items;

    /** @description Return the calendar events */
    return {
      hasErr: false,
      data,
      message: {
        statusCode: 200,
        severity: ConvexActionServerityEnum.SUCCESS,
        reason: "BLOXIE_HAR_S02",
      },
    };
  }
});

/**
 * @public
 * @since 0.0.11
 * @version 0.0.1
 * @description Fetches the calendar colors from Google
 * @param {Object} param0
 * @param {string} param0.refreshToken - The refresh token to fetch the calendar colors
 * @function */
export const fetchCalendarColors = internalAction({
  args: { refreshToken: v.object(encryptedTokenSchemaObj) },
  handler: async ({ runAction }, { refreshToken }): Promise<ConvexActionReturnProps<IntegrationAPIGoogleCalendarColorsProps>> => {
    const { access_token } = await runAction(internal.sync.integrations.google.action.refreshAccessToken, { refreshToken });
    const res = await fetch("https://www.googleapis.com/calendar/v3/colors", {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: "application/json",
      },
    });

    return {
      hasErr: !res.ok,
      data: res.ok ? await res.json() : {} as IntegrationAPIGoogleCalendarColorsProps,
      message: {
        statusCode: res.ok ? 200 : 500,
        info: res.ok ? "i18n.convex.http.integrations.google.success.colors" : await res.text(),
        severity: res.ok ? ConvexActionServerityEnum.SUCCESS : ConvexActionServerityEnum.ERROR,
        reason: res.ok ? "BLOXIE_HAR_S02" : "BLOXIE_HAR_E09",
      }
    }
  }
});

/**
 * @public
 * @since 0.0.14
 * @version 0.0.1
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
    const { access_token } = await runAction(internal.sync.integrations.google.action.refreshAccessToken, { refreshToken });

    async function sendGmail(access_token: string, message: string) {
      const raw = Buffer.from(message)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    
      const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ raw }),
      });
    
      return {
        hasErr: !res.ok,
        data: res.ok ? await res.json() : {} as IntegrationAPIGoogleCalendarColorsProps,
        message: {
          statusCode: res.ok ? 200 : 500,
          info: res.ok ? "i18n.convex.http.integrations.google.success.send" : await res.text(),
          severity: res.ok ? ConvexActionServerityEnum.SUCCESS : ConvexActionServerityEnum.ERROR,
          reason: res.ok ? "BLOXIE_HAR_S02" : "BLOXIE_HAR_E09",
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
    
    return await sendGmail(access_token, email);
  }
});