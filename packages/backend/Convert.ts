import { Id } from "./convex/_generated/dataModel";
import { 
  IntegrationAPIGoogleCalendarEventProps, 
  IntegrationAPICalendarEventTypeEnum, 
  ConvexEventsAPIProps, 
  IntegrationAPICalendarVisibilityEnum
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
    eventProviderId: event.id,
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
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Converts a convex object to a clean object for update
 * -> Removes the _creationTime property from the object which causes an error when updating the object without removing it
 * @since 0.0.11
 * @version 0.0.1
 * @param {T} convexObj - The convex schema object
 * @function */
export const convertToCleanObjectForUpdate = <T extends object>(convexObj: T): T => {
  const { _creationTime, ...cleanedObject } = convexObj as { _creationTime: number; [key: string]: any };
  return cleanedObject as T;
};

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