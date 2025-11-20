import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * @since 0.0.9
 * @version 0.0.1
 * @description Schema definition for table "encryptedToken"
 * @constant */
export const encryptedTokenSchema = {
  iv: v.string(),
  value: v.string(),
  tag: v.string(),
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
 * @version 0.0.1
 * @description Schema definition for table "settings"
 * -> Handles the user settings for the calendar or overall application
 * @interface */
export const settingsSchema = {
  userId: v.id("users"),
  faceId: v.optional(v.boolean()),
  pushNotifications: v.optional(v.boolean()),
  durationMinute: v.optional(v.number()),
  breakingTimeBetweenEvents: v.optional(v.number())
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
 * @version 0.0.1
 * @description Schema definition for table "events"
 * @interface */
export const eventSchema = {
  userId: v.id("users"),
  end: v.string(),
  start: v.string(),
  title: v.string(),
  descr: v.optional(v.string()),
  reminder: v.optional(v.string()),
  participants: v.optional(v.array(v.id("users"))),
  tags: v.optional(v.array(v.id("tags"))),
  location: v.optional(v.string()),
  isPrivate: v.optional(v.boolean()),
  isRepeating: v.optional(v.boolean()),
}

/**
 * @since 0.0.9
 * @version 0.0.1
 * @description Schema definition for table "events"
 * @interface */
export const linkedSchema = {
  userId: v.id("users"),
  provider: v.string(),
  providerId: v.string(),
  email: v.string(),
  scopes: v.optional(v.array(v.string())),
  refreshToken: v.object(encryptedTokenSchema),
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
  events: defineTable(eventSchema).index("byUserId", ["userId"]),

  /**
   * @since 0.0.9
   * @version 0.0.1
   * @description Schema definition for table "linked"
   * @type */
  linked: defineTable(linkedSchema).index("byUserId", ["userId"]),
});