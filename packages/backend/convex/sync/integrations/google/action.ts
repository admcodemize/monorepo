"use node";
import { v } from "convex/values";
import { internal } from "../../../_generated/api";
import { internalAction } from "../../../_generated/server";
import { encryptedTokenSchemaObj } from "../../../schema";
import { APIGoogleCalendarChannelWatchProps, APIGoogleCalendarEventProps, APIGoogleCalendarEventsProps, APIGoogleCalendarListProps, ConvexActionReturnProps, ConvexActionServerityEnum } from "../../../../Types";

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
 * @description Stops a channel watch for a calendar
 * @param {Object} param0
 * @param {string} param0.linkedId - The linked id to stop the channel watch for
 * @param {string} param0.calendarId - The calendar id to stop the channel watch for
 * @function */
export const stopChannelWatch = internalAction({
  args: {
    linkedId: v.id('linked'),
    calendarId: v.string(),
  },
  handler: async ({ runAction, runQuery }, { linkedId, calendarId }) => {
    /** @description Get the linked google account for the user */
    const linked = await runQuery(internal.sync.integrations.query.linkedById, { _id: linkedId });
    if (!linked) throw new Error("i18n.convex.sync.integrations.google.error.linkedNotFound", { cause: linkedId });

    /** @description Get the google account for the calendar which should be stopped the channel watch for */
    const google = linked.google?.find((google) => google.calendarId === calendarId);
    if (!google) throw new Error("i18n.convex.sync.integrations.google.error.googleNotFound", { cause: calendarId });

    /** @description Refresh the access token for stopping the channel watch */
    const { access_token } = await runAction(internal.sync.integrations.google.action.refreshAccessToken, { refreshToken: linked.refreshToken });

    /** @description Stop the channel watch for the calendar */
    const res = await fetch(`https://www.googleapis.com/calendar/v3/channels/stop`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/json',
      },
      body: JSON.stringify({ 
        id: google?.watchId,
        resourceId: google?.resourceId,
      })
    });

    /** @description If the channel watch stop fails, return the error */
    if (!res.ok) throw new Error(await res.text());

    /** @description Return the channel watch */
    return await res.json();
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
 * @returns {ConvexActionReturnProps<APIGoogleCalendarChannelWatchProps>}
 * @function */
export const startWatchCalendarLists = internalAction({
  args: {
    userId: v.id('users'),
    refreshToken: v.object(encryptedTokenSchemaObj),
  },
  handler: async ({ runAction, runQuery }, { userId, refreshToken }): Promise<ConvexActionReturnProps<APIGoogleCalendarChannelWatchProps>> => {
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
        token: JSON.stringify({ userId })
      }),
    });

    if (!res.ok) return {
      hasErr: true,
      data: {} as APIGoogleCalendarChannelWatchProps,
      message: {
        statusCode: 500,
        info: await res.text(),
        severity: ConvexActionServerityEnum.ERROR,
        reason: "BLOXIE_HAR_E07",
      },
    };

    return {
      hasErr: false,
      data: await res.json() as APIGoogleCalendarChannelWatchProps,
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
 * @returns {ConvexActionReturnProps<APIGoogleCalendarChannelWatchProps>}
 * @function */
export const startWatchCalendarEvents = internalAction({
  args: { 
    userId: v.id('users'),
    refreshToken: v.object(encryptedTokenSchemaObj),
    calendarId: v.string(),
  },
  handler: async ({ runAction, runQuery }, { userId, refreshToken, calendarId }): Promise<ConvexActionReturnProps<APIGoogleCalendarChannelWatchProps>> => {
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
        token: JSON.stringify({ userId, calendarId })
      }),
    });

    /** @description Starting the channel watch has failed */
    if (!res.ok) return {
      hasErr: true,
      data: {} as APIGoogleCalendarChannelWatchProps,
      message: {
        statusCode: 500,
        info: await res.text(),
        severity: ConvexActionServerityEnum.ERROR,
        reason: "BLOXIE_HAR_E04",
      },
    };

    return {
      hasErr: false,
      data: await res.json() as APIGoogleCalendarChannelWatchProps,
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
 * @since 0.0.9
 * @version 0.0.2
 * @description Fetches the calendar list from Google
 * @param {Object} param0
 * @param {string} param0.refreshToken - The refresh token to fetch the calendar list
 * @function */
export const fetchCalendarList = internalAction({
  args: { refreshToken: v.object(encryptedTokenSchemaObj) },
  handler: async ({ runAction }, { refreshToken }): Promise<ConvexActionReturnProps<APIGoogleCalendarListProps>> => {
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
      data: {} as APIGoogleCalendarListProps,
      message: {
        statusCode: 500,
        info: await res.text(),
        severity: ConvexActionServerityEnum.ERROR,
        reason: "BLOXIE_HAR_E05",
      },
    };

    const data: APIGoogleCalendarListProps = await res.json();

    /** @description Remove the weeknum calendar from the calendar list */
    //const idx = data?.items.findIndex((item) => item.id.includes("#weeknum@group.v.calendar.google.com"));
    //data.items.splice(idx, 1);

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
  },
  handler: async ({ runAction }, { refreshToken, calendarId }): Promise<ConvexActionReturnProps<APIGoogleCalendarEventsProps>> => {
    let data: APIGoogleCalendarEventsProps;
    let items: APIGoogleCalendarEventProps[] = [];
    let nextPageToken: string|undefined;

    /** @description Refresh the access token for fetching the calendar events */
    const { access_token } = await runAction(internal.sync.integrations.google.action.refreshAccessToken, { refreshToken });

    /** @description Build the query parameters for the calendar events fetch */
    const now: Date = new Date();
    const params = new URLSearchParams({
      showDeleted: 'false', 
      singleEvents: 'true',
      timeMin: new Date(now.setFullYear(now.getFullYear() - 2)).toISOString(), // 2 years in the past
    });

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
        data: {} as APIGoogleCalendarEventsProps,
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