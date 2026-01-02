import { ConvexLicenseAPITypeEnum, ConvexRumtimeAPILicenseProps, ConvexRuntimeAPIProps, ConvexSettingsAPIProps } from "@codemize/backend/Types";
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

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.38
 * @version 0.0.1
 * @description Checks if the license is a premium license
 * @param {ConvexRuntimeAPIProps} runtime - The runtime to check
 * @function */
export const hasPremiumLicense = (runtime: ConvexRuntimeAPIProps) => runtime.hasPremiumLicense;