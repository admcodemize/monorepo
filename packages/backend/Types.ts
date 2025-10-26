import { Id } from "./convex/_generated/dataModel";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

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
