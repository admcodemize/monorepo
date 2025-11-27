import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * @since 0.0.9
 * @version 0.0.1
 * @description Schema definition for table "encryptedToken"
 * @constant */
export const encryptedTokenSchemaObj = {
  iv: v.string(),
  value: v.string(),
  tag: v.string(),
}

/**
 * @since 0.0.10
 * @version 0.0.1
 * @description Schema definition for additional information for the Google integration
 * @interface */
export const googleSchemaObj = {
  calendarId: v.string(),
  watchId: v.string(),
  resourceId: v.string(),
  expiration: v.float64(),
  nextSyncToken: v.string(),
  lastSyncToken: v.string(),
}

/**
 * @since 0.0.10
 * @version 0.0.1
 * @description Schema definition for additional information for the event user such as creator, organizer and more
 * @interface */
export const eventUserInformationSchemaObj = {
  email: v.string(),
  self: v.boolean(),
  displayName: v.optional(v.string()),
  _id: v.optional(v.id("users"))
}

/**
 * @since 0.0.10
 * @version 0.0.1
 * @description Schema definition for additional information for the watch -> Used for the schema linked and watch
 * -> Calendar integrations such as Google, Apple, etc.
 * @interface */
export const watchSchemaObj = {
  id: v.string(),
  resourceId: v.string(),
  expiration: v.float64(),
  nextSyncToken: v.string(),
  lastSyncToken: v.string(),
}

/**
 * @since 0.0.1
 * @version 0.0.1
 * @description Schema definition for table "users"
 * -> Handles the internal user information based on clerk authentication flow
 * @interface */
export const userSchema = {
  clerkId: v.string(),
  email: v.string(),
  provider: v.string(),
  banned: v.boolean()
}

/**
 * @since 0.0.1
 * @version 0.0.2
 * @description Schema definition for table "settings"
 * -> Handles the user settings for the calendar or overall application
 * @interface */
export const settingsSchema = {
  userId: v.id("users"),
  faceId: v.optional(v.boolean()),
  pushNotifications: v.optional(v.boolean()),
  durationMinute: v.optional(v.number()),
  breakingTimeBetweenEvents: v.optional(v.number()),
  integrations: v.optional(v.array(v.object({
    integrationKey: v.string(),
    state: v.boolean(),
  }))),
}

/**
 * @since 0.0.1
 * @version 0.0.1
 * @description Schema definition for table "times"
 * -> Handles the blocked times for the user settings and could be used for other purposes in the future
 * @interface */
export const timesSchema = {
  userId: v.id("users"),
  type: v.union(v.literal("weekdays"), v.literal("dates")),
  day: v.number(),
  start: v.string(),
  end: v.string(),
  isBlocked: v.optional(v.boolean())
}

/**
 * @since 0.0.1
 * @version 0.0.2
 * @description Schema definition for table "events"
 * @interface */
export const eventSchema = {
  userId: v.id("users"),
  end: v.string(),
  start: v.string(),
  title: v.string(),
  description: v.optional(v.string()),
  calendarId: v.optional(v.string()),
  eventProviderId: v.optional(v.string()),
  backgroundColor: v.optional(v.string()),
  htmlLink: v.optional(v.string()),
  visibility: v.optional(v.string()),
  creator: v.optional(v.object(eventUserInformationSchemaObj)),
  organizer: v.optional(v.object(eventUserInformationSchemaObj)),
  attendees: v.optional(v.array(v.object({
    email: v.string(),
    name: v.string(),
    responseStatus: v.union(v.literal("accepted"), v.literal("declined"), v.literal("tentative"), v.literal("needsAction")),
    _id: v.optional(v.id("users")),
  }))),
  type: v.optional(v.union(v.literal("default"), v.literal("focusTime"), v.literal("workingLocation"), v.literal("outOfOffice"), v.literal("task"), v.literal("birthday"), v.literal("fromGmail"))),
  recurring: v.optional(v.object({
    eventId: v.optional(v.string()),
    isRecurring: v.optional(v.boolean()),
  })),
  location: v.optional(v.object({
    name: v.string(),
    conferenceData: v.optional(v.object({
      id: v.string(),
      link: v.string(),
    })),
    isAddress: v.boolean(),
    isConference: v.boolean(),
  })),
}

/**
 * @since 0.0.9
 * @version 0.0.2
 * @description Schema definition for table "events"
 * @interface */
export const linkedSchema = {
  userId: v.id("users"),
  provider: v.string(),
  providerId: v.string(),
  calendarsId: v.array(v.id("calendar")),
  email: v.string(),
  scopes: v.optional(v.array(v.string())),
  refreshToken: v.object(encryptedTokenSchemaObj),
  watch: v.object(watchSchemaObj),
  hasMailPermission: v.optional(v.boolean())
}

/**
 * @since 0.0.11
 * @version 0.0.1
 * @description Schema definition for additional information for the calendar(s) within an integrated provider account
 * -> freeBusyReader: Sees only blocked out times and the status of the calendar without any other information
 * @interface */
export const calendarSchema = {
  id: v.string(),
  accessRole: v.union(v.literal("reader"), v.literal("writer"), v.literal("owner"), v.literal("freeBusyReader")),
  backgroundColor: v.string(),
  description: v.string(),
  foregroundColor: v.string(),
  primary: v.boolean(),
  watch: v.optional(v.object(watchSchemaObj)),
  eventsCount: v.optional(v.number())
}

export default defineSchema({
  /**
   * @since 0.0.1
   * @version 0.0.1
   * @description Schema definition for table "users"
   * -> Handles the internal user information based on clerk authentication flow
   * @type */
  users: defineTable(userSchema),

  /**
   * @since 0.0.1
   * @version 0.0.1
   * @description Schema definition for table "settings"
   * @type */
  settings: defineTable(settingsSchema).index("byUserId", ["userId"]),

  /**
   * @since 0.0.1
   * @version 0.0.1
   * @description Schema definition for table "times"
   * @type */
  times: defineTable(timesSchema).index("byUserId", ["userId"]),

  /**
   * @since 0.0.1
   * @version 0.0.1
   * @description Schema definition for table "events"
   * @type */
  events: defineTable(eventSchema)
    .index("byUserId", ["userId"])
    .index("byCalendarId", ["calendarId"])
    .index("byEventProviderId", ["eventProviderId"]),

  /**
   * @since 0.0.9
   * @version 0.0.1
   * @description Schema definition for table "linked"
   * @type */
  linked: defineTable(linkedSchema)
    .index("byUserId", ["userId"])
    .index("byProviderId", ["providerId"]),

  /**
   * @since 0.0.11
   * @version 0.0.1
   * @description Schema definition for table "calendar" -> Handles the additional information for each calendar whitin an integrated provider account
   * @type */
  calendar: defineTable(calendarSchema).index("byIntegrationId", ["id"]),
});