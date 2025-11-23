import { Id } from "./convex/_generated/dataModel";
import { 
  IntegrationAPIGoogleCalendarEventProps, 
  IntegrationAPICalendarEventTypeEnum, 
  ConvexEventsAPIProps 
} from "./Types";

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
 * @version 0.0.2
 * @param {Id<"users">} userId - The user id
 * @param {string} calendarId - The calendar id
 * @param {APIGoogleCalendarEventProps} event - The google calendar event
 * @param {string} backgroundColor - The background color of the calendar event based on the colorId
 * @function */
export const convertEventGoogleToConvex = (
  userId: Id<"users">,
  calendarId: string,
  event: IntegrationAPIGoogleCalendarEventProps,
  backgroundColor: string
): ConvexEventsAPIProps => {
  return {
    userId,
    calendarId,
    eventProviderId: event?.id || "",
    title: event?.summary || "",
    description: event?.description || "",
    start: event.start.dateTime || event.start.date,
    end: event.end.dateTime || event.end.date,
    backgroundColor: backgroundColor,
    type: event.eventType || IntegrationAPICalendarEventTypeEnum.DEFAULT,
  };
};

export const convertToCleanObjectForUpdate = <T extends object>(convexObj: T): T => {
  const { _creationTime, ...cleanedObject } = convexObj as { _creationTime: number; [key: string]: any };
  return cleanedObject as T;
};
