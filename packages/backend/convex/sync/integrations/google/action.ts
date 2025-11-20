import { v } from "convex/values";
import { internal } from "../../../_generated/api";
import { internalAction } from "../../../_generated/server";
import { encryptedTokenSchema } from "../../../schema";

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
  args: { refreshToken: v.object(encryptedTokenSchema) },
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
 * @since 0.0.9
 * @version 0.0.1
 * @description Fetches the calendar list from Google
 * @param {string} accessToken - The access token to fetch the calendar list
 * @function */
export const fetchCalendarList = internalAction({
  args: { refreshToken: v.object(encryptedTokenSchema) },
  handler: async ({ runAction }, { refreshToken }) => {
    const refreshedToken = await runAction(internal.sync.integrations.google.action.refreshAccessToken, { refreshToken });
    const res = await fetch(`https://www.googleapis.com/calendar/v3/users/me/calendarList`, {
      headers: {
        Authorization: `Bearer ${refreshedToken.access_token}`,
        Accept: 'application/json',
      },
    });

    /** @description If the calendar list fetch fails, return the error */
    if (!res.ok) throw new Error(await res.text());

    /** @description Return the calendar list */
    return await res.json();
  }
});

/**
 * @public
 * @since 0.0.9
 * @version 0.0.1
 * @description Fetches the calendar events from Google
 * @param {Object} param0
 * @param {string} param0.accessToken - The access token to fetch the calendar events
 * @param {string} param0.calendarId - The calendar id to fetch the calendar events
 * @param {string} param0.timeMin - The time min to fetch the calendar events
 * @function */
export const fetchCalendarEvents = internalAction({
  args: { userId: v.id('users') },
  handler: async ({ runQuery, runAction }, { userId }) => {
    /** @description Get all the linked accounts for the user and execute the actions for each linked account with provider "google" */
    const linked = await runQuery(internal.sync.integrations.query.linkedByUser, { userId });
    for (const linkedAccount of linked.filter((linked) => linked.provider === 'google')) {
      const refreshAccessToken = await runAction(internal.sync.integrations.google.action.refreshAccessToken, { refreshToken: linkedAccount.refreshToken });
    
      const params = new URLSearchParams({
        singleEvents: 'true',
        orderBy: 'startTime',
      });

      const calendarList = await runAction(internal.sync.integrations.google.action.fetchCalendarList, { refreshToken: linkedAccount.refreshToken });
      for (const calendar of calendarList.items) {
        /** @description Fetch the calendar events for the current calendar */
        const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendar.id)}/events?${params}`, {
          headers: {
            Authorization: `Bearer ${refreshAccessToken.access_token}`,
            Accept: 'application/json',
          },
        });

        (await res.json())?.items.forEach(async (event) => {
          console.log("event:", event);
        });


      }
    }
    /*const params = new URLSearchParams({
      singleEvents: 'true',
      orderBy: 'startTime',
    });

    const calendarId = args.calendarId ?? 'primary';
    const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params}`, {
      headers: {
        Authorization: `Bearer ${args.accessToken}`,
        Accept: 'application/json',
      },
    });

    /** @description If the calendar events fetch fails, return the error *
    if (!res.ok) throw new Error(await res.text());

    /** @description Return the calendar events *
    return await res.json(); */
  }
});
