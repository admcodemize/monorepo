import { ConvexSettingsAPIProps } from "@codemize/backend/Types";
import { Id } from "../../../packages/backend/convex/_generated/dataModel";

export const DEFAULT_DURATION_MINUTE = 30;
export const DEFAULT_BREAKING_TIME_BETWEEN_EVENTS = 0;

/**
 * @public
 * @description Get the default settings object for a user
 * @function
 * @since 0.0.15
 * @version 0.0.3
 * @param {Id<"users">} userId - The id of the user */
export const getDefaultSettingsObject = (
  userId: Id<"users">
): ConvexSettingsAPIProps => ({
  userId,
  durationMinute: DEFAULT_DURATION_MINUTE,
  breakingTimeBetweenEvents: DEFAULT_BREAKING_TIME_BETWEEN_EVENTS,
  faceId: false,
  pushNotifications: false,
  integrations: []
}); 