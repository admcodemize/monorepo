import { Id } from "./convex/_generated/dataModel";
import { 
  IntegrationAPIGoogleCalendarEventProps, 
  IntegrationAPICalendarEventTypeEnum, 
  ConvexEventsAPIProps, 
  IntegrationAPICalendarVisibilityEnum,
  ConvexCalendarWatchAPIProps,
  IntegrationAPIGoogleCalendarChannelWatchProps,
  IntegrationAPICalendarEventStartEndProps
} from "./Types";

const MINUTES_IN_MILLISECONDS = 60 * 1000;

/**
 * @private
 * @since 0.0.1
 * @version 0.0.1
 * @description Returns the time zone offset in minutes
 * @param {string} timeZone - The time zone
 * @param {Date} date - The date
 * @todo Refactor
 * @function */
const getTimeZoneOffsetMinutes = (timeZone: string, date: Date): number => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const formattedParts = formatter.formatToParts(date);
  const dateParts = formattedParts.reduce<Record<string, number>>((acc, part) => {
    if (part.type !== "literal") acc[part.type] = Number(part.value);
    return acc;
  }, {});

  const utcTime = Date.UTC(
    dateParts.year ?? date.getUTCFullYear(),
    (dateParts.month ?? (date.getUTCMonth() + 1)) - 1,
    dateParts.day ?? date.getUTCDate(),
    dateParts.hour ?? 0,
    dateParts.minute ?? 0,
    dateParts.second ?? 0
  );

  return (utcTime - date.getTime()) / MINUTES_IN_MILLISECONDS;
};

/**
 * @private
 * @since 0.0.1
 * @version 0.0.1
 * @description Converts a google date to an iso string
 * @param {IntegrationAPICalendarEventStartEndProps} value - The value to convert
 * @param {string} fallbackTimeZone - The fallback time zone
 * @todo Refactor
 * @function */
const convertGoogleDateToIso = (
  value: IntegrationAPICalendarEventStartEndProps,
  fallbackTimeZone?: string
): string => {
  if (value?.dateTime) return new Date(value.dateTime).toISOString();

  if (value?.date) {
    const zone = value.timeZone || fallbackTimeZone;
    if (zone) {
      const [year, month, day] = value.date.split("-").map(Number);
      const referenceDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
      const offsetMinutes = getTimeZoneOffsetMinutes(zone, referenceDate);
      const midnightUtc = Date.UTC(year, month - 1, day, 0, 0, 0) - (offsetMinutes * MINUTES_IN_MILLISECONDS);
      return new Date(midnightUtc).toISOString();
    }
    return `${value.date}T00:00:00Z`;
  }
  return new Date().toISOString();
};

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
 * @version 0.0.4
 * @param {Id<"users">} userId - The user id
 * @param {Id<"calendar">} calendarId - The calendar id => Referenced to the calendar table
 * @param {string} externalId - The external id of the calendar => Example: "4c641189a6c3af7d4633b0b5efbfcd806f71b6daf10475c4fe351373a575e53e@group.calendar.google.com"
 * @param {APIGoogleCalendarEventProps} event - The google calendar event
 * @param {string} backgroundColor - The background color of the calendar event based on the colorId
 * @function */
export const convertEventGoogleToConvex = (
  userId: Id<"users">,
  calendarId: Id<"calendar">,
  externalId: string,
  event: IntegrationAPIGoogleCalendarEventProps,
  backgroundColor: string,
  calendarTimeZone?: string
): ConvexEventsAPIProps => {
  /** @todo Find userId by email when organizer is also an registered bloxie user */
  return {
    userId,
    calendarId,
    externalId,
    externalEventId: event.id,
    title: event.summary,
    description: event?.description || "",
    start: convertGoogleDateToIso(event.start, event.start?.timeZone || calendarTimeZone),
    end: convertGoogleDateToIso(event.end, event.end?.timeZone || event.start?.timeZone || calendarTimeZone),
    backgroundColor: backgroundColor,
    htmlLink: event?.htmlLink || "",
    visibility: event?.visibility || IntegrationAPICalendarVisibilityEnum.PRIVATE,
    creator: {
      ...event.creator,
      //_id: "" as Id<"users">
    },
    organizer: {
      ...event.organizer,
      //_id: "" as Id<"users">
    },
    attendees: event?.attendees || [],
    location: event?.location || "",
    type: event.eventType || IntegrationAPICalendarEventTypeEnum.DEFAULT,
    recurringRootId: (event.recurringEventId)?.split("_R")[0],
    recurringEventId: event.recurringEventId || "",
    originalStartTime: event?.originalStartTime || event?.start,
    recurrence: event?.recurrence || [],
    isAllDay: Boolean(event.start?.date && !event.start?.dateTime), // -> If the start date time is set, the event is not all day
  };
};

/**
 * @private
 * @since 0.0.22
 * @version 0.0.1
 * @description Handles the watch data for the linked data -> Creates a new watch object
 * @param {IntegrationAPIGoogleCalendarChannelWatchProps|undefined} watch - The watch object from the google calendar api
 * @param {string} nextSyncToken - The next sync token for the watch
 * @param {string} lastSyncToken - The last sync token for the watch
 * @function */
export const toWatch = (
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
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Converts a convex object to a clean object for update
 * -> Removes the _creationTime property from the object which causes an error when updating the object without removing it
 * @since 0.0.11
 * @version 0.0.1
 * @param {T} convexObj - The convex schema object
 * @function */
export const convertToCleanObjectForUpdate = <T extends object>(convexObj: T): T => {
  if (!convexObj) return convexObj as T;
  const { _creationTime, ...cleanedObject } = convexObj as { _creationTime: number; [key: string]: any };
  return cleanedObject as T;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Safely parses a JSON string -> Used for parsing the encrypted payload
 * @since 0.0.21
 * @version 0.0.1
 * @param {string} raw - The raw string to parse
 * @function */
export const safeParse = <T>(raw: string): T|null => {
  try { return JSON.parse(raw) as T; } 
  catch (err) { return null; }
}