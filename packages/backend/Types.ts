import { Id } from "./convex/_generated/dataModel";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type ConvexTimesAPITypeEnum = "weekdays" | "dates";


/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.1
 * @type */
export type ConvexEventsAPIProps = {
  _id?: Id<"events">;
  _creationTime?: number;
  userId: string;
  start: string;
  end: string;
  title: string;
  descr?: string;
  calendarId?: string;
  type?: APIGoogleCalendarEventTypeEnum;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type ConvexUsersAPIProps = {
  _id: Id<"users">;
  _creationTime: number;
  clerkId: string;
  email: string;
  provider: string;
  banned: boolean;
  members: Id<"users">[];
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type ConvexSettingsAPIProps = {
  _id?: Id<"settings">;
  _creationTime?: number;
  userId: Id<"users">;
  faceId?: boolean;
  pushNotifications?: boolean;
  durationMinute?: number;
  breakingTimeBetweenEvents?: number;
  timesMemberWithAccessRole?: boolean;
  membersHighlightColor?: {
    userId: Id<"users">;
    color: string;
  }[];
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type ConvexTimesAPIProps = {
  _id?: Id<"times">;
  _creationTime?: number;
  userId: Id<"users">;
  day: number;
  type: ConvexTimesAPITypeEnum;
  start: string;
  end: string;
  isBlocked: boolean;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.10
 * @version 0.0.1
 * @type */
export type ConvexWatchProps = {
  id: string;
  resourceId: string;
  expiration: number;
  nextSyncToken: string;
  lastSyncToken: string;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.10
 * @version 0.0.1
 * @type */
export type ConvexActionReturnProps<T> = {
  hasErr: boolean;
  data: T;
  message: {
    statusCode: number;
    info?: string;
    severity: ConvexActionServerityEnum;
    reason?: string;
  };
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.10
 * @version 0.0.1
 * @enum */
export enum ConvexActionServerityEnum {
  ERROR = "error",
  SUCCESS = "success",
  WARNING = "warning",
  INFO = "info"
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.9
 * @version 0.0.1
 * @type */
export type EncryptedTokenProps = {
  iv: string;
  value: string;
  tag: string;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.10
 * @version 0.0.1
 * @type */
export type APIGoogleCalendarEventProps = {
  kind: string;
  etag: string;
  id: string;
  status: string;
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
  start: APIGoogleCalendarEventStartEndProps;
  end: APIGoogleCalendarEventStartEndProps;
  iCalUID?: string;
  sequence?: number;
  attendees?: {
    email: string;
    self: boolean;
    responseStatus: APIGoogleCalendarEventResponseStatusEnum;
    organizer: boolean;
  }[];
  attachments?: {
    fileUrl: string;
    title: string;
    iconLink: string;
  }[];
  guestsCanInviteOthers?: boolean;
  privateCopy?: boolean;
  eventType?: APIGoogleCalendarEventTypeEnum;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.10
 * @version 0.0.1
 * @type */
export type APIGoogleCalendarEventStartEndProps = {
  date?: string;
  dateTime?: string;
  timeZone?: string;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.10
 * @version 0.0.1
 * @type
 * @example 
 * { kind: 'calendar#events',
 * etag: '"p33kbpgsqma3920o"',
 * summary: 'Feiertage in der Schweiz',
 * description: 'Feier- und Gedenktage in der Schweiz',
 * updated: '2025-11-03T22:39:08.384Z',
 * timeZone: 'Europe/Zurich',
 * accessRole: 'reader',
 * defaultReminders: [],
 * nextSyncToken: 'CIz0mpGG15ADEIz0mpGG15ADGAEg1MSwjQMo1MSwjQM='
 * nextPageToken: 'CIz0mpGG15ADEIz0mpGG15ADGAEg1MSwjQMo1MSwjQM=' } */
export type APIGoogleCalendarEventsProps = {
  kind: string;
  etag: string;
  summary: string;
  description: string;
  updated: string;
  timeZone: string;
  accessRole: string;
  defaultReminders: {}[];
  nextSyncToken?: string;
  nextPageToken?: string;
  items: APIGoogleCalendarEventProps[];
}

/** 
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.10
 * @version 0.0.1
 * @type
 * @example
 * { access_token: 'ya29.a..0206',
 *   expires_in: 3599,
 *   refresh_token: '1//05K...L7r4',
 *   scope: 'openid https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events.owned https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar.events',
 *   token_type: 'Bearer',
 *   id_token: 'ey...D} */
export type APIGoogleCalendarTokenExchangeProps = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
  id_token: string;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.10
 * @version 0.0.1
 * @type
 * @example
 * { kind: 'api#channel',
 *   id: 'e42b983b-a539-4747-9793-b43989a1fc39',
 *   resourceId: '8kv9U75LYmP_7T9GNXu-eSyVFN0',
 *   resourceUri: 'https://www.googleapis.com/calendar/v3/calendars/primary/events?alt=json',
 *   token: '{"userId":"j97bzw0450931g8rfqmmx38xh57vnhhz","linkedId":"jx74d1nv330x6600fhkmwb9j5s7vsycq","calendarId":"primary"}',
 *   expiration: '1764326169000' } */
export type APIGoogleCalendarChannelWatchProps = {
  kind: string;
  id: string;
  resourceId: string;
  resourceUri: string;
  token: string;
  expiration: number;
}

/** 
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.10
 * @version 0.0.1
 * @type
 * @example
 * { etag: '"p32fod5uqqi2p20o"',
  items: [{
    accessRole: 'reader',
    backgroundColor: '#16a765',
    colorId: '8',
    conferenceProperties: {
      allowedConferenceSolutionTypes: [ 'hangoutsMeet' ]
    },
    defaultReminders: [],
    description: 'Feier- und Gedenktage in der Schweiz',
    etag: '"1660898204495000"',
    foregroundColor: '#000000',
    id: 'de.ch#holiday@group.v.calendar.google.com',
    kind: 'calendar#calendarListEntry',
    selected: true,
    summary: 'Feiertage in der Schweiz',
    timeZone: 'Europe/Zurich'
  }],
  kind: 'calendar#calendarList',
  nextSyncToken: 'CJ-Gl9rUhZEDEhRzdG9lY2tsaW03QGdtYWlsLmNvbQ==' } */
export type APIGoogleCalendarListProps = {
  etag: string;
  items: {
    accessRole: string;
    backgroundColor: string;
    colorId: string;
    conferenceProperties: {
      allowedConferenceSolutionTypes: string[];
    };
    defaultReminders: {
      method: string;
      minutes: number;
    }[];
    etag: string;
    foregroundColor: string;
    id: string;
    kind: string;
    notificationSettings: {
      notifications: {}[];
    };
    primary: boolean;
    selected: boolean;
    summary: string;
    timeZone: string;
  }[];
  kind: string;
  nextSyncToken: string;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.10
 * @version 0.0.1
 * @enum */
export enum APIGoogleCalendarEventTypeEnum {
  DEFAULT = "default",
  FOCUS_TIME = "focusTime",
  WORKING_LOCATION = "workingLocation",
  OUT_OF_OFFICE = "outOfOffice",
  TASK = "task",
  BIRTHDAY = "birthday",
  FROM_GMAIL = "fromGmail"
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.10
 * @version 0.0.1
 * @enum */
export enum APIGoogleCalendarEventResponseStatusEnum {
  ACCEPTED = "accepted",
  DECLINED = "declined",
  TENTATIVE = "tentative",
  NEEDS_ACTION = "needsAction"
}