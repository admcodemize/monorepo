import { Id } from "./convex/_generated/dataModel";
import { 
  IntegrationAPIGoogleCalendarEventProps, 
  IntegrationAPICalendarEventTypeEnum, 
  ConvexEventsAPIProps, 
  IntegrationAPICalendarVisibilityEnum,
  ConvexCalendarWatchAPIProps,
  IntegrationAPIGoogleCalendarChannelWatchProps
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
 * @version 0.0.3
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
  backgroundColor: string
): ConvexEventsAPIProps => {
  /** 
   * @todo Find userId by email when organizer is also an registered bloxie user
   * 
   * title => OK
   * description => OK
   * backgroundColor => OK
   * htmlLink => OK
   * visibility => OK
   * type => OK
   */
  return {
    userId,
    calendarId,
    externalId,
    externalEventId: event.id,
    title: event.summary,
    description: event?.description || "",
    start: event.start.dateTime || event.start.date,
    end: event.end.dateTime || event.end.date,
    backgroundColor: backgroundColor,
    htmlLink: event?.htmlLink || "",
    visibility: event?.visibility || IntegrationAPICalendarVisibilityEnum.PRIVATE,
    creator: {
      email: event.creator.email,
      self: event.creator?.self || true,
      displayName: event.creator?.displayName || "",
      //_id: "" as Id<"users">
    },
    organizer: {
      email: event.organizer?.email || "",
      self: event.organizer?.self || false,
      displayName: event.organizer?.displayName || "",
      //_id: "" as Id<"users">
    },
    type: event.eventType || IntegrationAPICalendarEventTypeEnum.DEFAULT,
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

/**
    start: string;
    end: string;
    attendees?: ConvexEventsAPIAttendeesProps[];
    type?: IntegrationAPICalendarEventTypeEnum;
    recurring?: ConvexEventsAPIRecurringProps;
    location?: ConvexEventsAPILocationProps;
 */
/**
 *   kind: string;
  etag: string;
  id: string;
  colorId: string;
  status: IntegrationAPICalendarEventStatusEnum;
  htmlLink?: string;
  created?: string;
  updated?: string;
  summary?: string;
  description?: string;
  location?: string;
  creator?: {
    email: string;
    self: boolean;
  };
  organizer?: {
    email: string;
    displayName: string;
  };
  start: IntegrationAPICalendarEventStartEndProps;
  end: IntegrationAPICalendarEventStartEndProps;
  iCalUID?: string;
  sequence?: number;
  attendees?: {
    email: string;
    self: boolean;
    responseStatus: IntegrationAPICalendarEventResponseStatusEnum;
    organizer: boolean;
  }[];
  attachments?: {
    fileUrl: string;
    title: string;
    iconLink: string;
  }[];
  guestsCanInviteOthers?: boolean;
  privateCopy?: boolean;
  visibility?: IntegrationAPICalendarVisibilityEnum;
  eventType?: IntegrationAPICalendarEventTypeEnum;
 */