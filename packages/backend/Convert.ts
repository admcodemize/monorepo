import { APIGoogleCalendarEventProps, APIGoogleCalendarEventTypeEnum, ConvexEventsAPIProps } from "./Types";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns a javascript based date
 * @since 0.0.2
 * @version 0.0.1
 * @param {Date} now - Initial start/end date 
 * @function */
export const convertFromConvex = (now: string) => new Date(now);

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Converts a google calendar event to a convex event
 * @since 0.0.10
 * @version 0.0.1
 * @param {string} userId - The user id
 * @param {APIGoogleCalendarEventProps} event - The google calendar event
 * @function */
export const convertEventGoogleToConvex = (
  userId: string,
  calendarId: string,
  event: APIGoogleCalendarEventProps
): ConvexEventsAPIProps => {
  return {
    userId,
    calendarId,
    title: event.summary,
    start: event.start.dateTime || event.start.date,
    end: event.end.dateTime || event.end.date,
    descr: event.description || "",
    type: event.eventType || APIGoogleCalendarEventTypeEnum.DEFAULT,
  };
};
