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
  location?: string;
  reminder?: string;
  participants?: Id<"users">[];
  iconSrc?: IconProp;
  bgColorUser?: string;
  bgColorEvent?: string;
  isPrivate?: boolean;
  isRepeating?: boolean;
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
 * @since 0.0.9
 * @version 0.0.1
 * @type */
export type EncryptedToken = {
  iv: string;
  value: string;
  tag: string;
}