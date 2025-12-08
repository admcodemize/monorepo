import { v } from "convex/values";
import { internalMutation, mutation } from "../../_generated/server";
import { linkedSchema, calendarSchema, watchSchemaObj, encryptedTokenSchemaObj } from "../../schema";

/**
 * @public
 * @since 0.0.19
 * @version 0.0.1
 * @description Handles the database mutation for updating a single property of a calendar
 * -> Hint: Function can be called directly from the client!
 * @param {Object} param0
 * @param {Id<"calendar">} param0._id - The calendar id to update
 * @param {string} param0.property - The property to update
 * @param {boolean} param0.value - The value to update */
export const updateCalendarProperty = mutation({
  args: {
    _id: v.id("calendar"),
    property: v.string(),
    value: v.boolean()
  },
  handler: async (ctx, { _id, property, value }) => await ctx.db.patch(_id, { [property]: value })
});

/**
 * @public
 * @since 0.0.9
 * @version 0.0.2
 * @description Handles the internal database mutation for newly created linked account
 * -> Hint: Function can not be called directly from the client!
 * @param {Object} param0
 * @param {string} param0.userId - User identification 
 * @param {string} param0.provider - Oauth provider which has been used for the authentication flow
 * @param {string} param0.providerId - Provider identification
 * @param {string} param0.providerDataId - Provider data identification */
export const createLinked = internalMutation({
  args: { ...linkedSchema },
  handler: async (ctx, args) => await ctx.db.insert("linked", { ...args })
});

/**
 * @public
 * @since 0.0.14
 * @version 0.0.1
 * @description Handles the internal database mutation for updating an existing linked account
 * -> Hint: Function can not be called directly from the client!
 * @param {Object} param0
 * @param {Id<"linked">} param0._id - The linked id to update
 * @param {Object<encryptedTokenSchemaObj>} param0.refreshToken - The refresh token to update
 * @param {boolean} param0.hasMailPermission - The has mail permission to update which handles if the user has the permission to send emails via the google provider */
export const updateLinked = internalMutation({
  args: { 
    _id: v.id("linked"), 
    refreshToken: v.object(encryptedTokenSchemaObj),
    scopes: v.array(v.string()),
    hasMailPermission: v.boolean()
  },
  handler: async (ctx, { _id, refreshToken, scopes, hasMailPermission }) => await ctx.db.patch(_id, { refreshToken, scopes, hasMailPermission })
});

/**
 * @public
 * @since 0.0.14
 * @version 0.0.1
 * @description Handles the internal database mutation for removing an existing linked account
 * -> Hint: Function can not be called directly from the client!
 * @param {Object} param0
 * @param {Id<"linked">} param0._id - The linked id to remove */
export const removeLinked = internalMutation({
  args: { _id: v.id("linked") },
  handler: async (ctx, { _id }) => await ctx.db.delete(_id)
});

/**
 * @public
 * @since 0.0.11
 * @version 0.0.1
 * @description Handles the internal database mutation for creating a calendar info -> Additional information for the calendar(s) within an integrated provider account
 * -> Hint: Function can not be called directly from the client!
 * @param {Object} param0
 * @param {string} param0.id - Calendar identification
 * @param {string} param0.accessRole - Access role
 * @param {string} param0.backgroundColor - Background color
 * @param {string} param0.description - Description
 * @param {string} param0.foregroundColor - Foreground color
 * @param {boolean} param0.primary - Shows if calendar is primary or not
 * @param {object} param0.watch - Contains all the channel watch informations which are importand for getting updates during changes within an integrated calendar */
export const createCalendar = internalMutation({
  args: { ...calendarSchema },
  handler: async (ctx, args) => await ctx.db.insert("calendar", { ...args })
});

/**
 * @public
 * @since 0.0.11
 * @version 0.0.2
 * @description Handles the internal database mutation for updating an existing calendar watch
 * -> Hint: Function can not be called directly from the client!
 * @param {Object} param0
 * @param {Id<"calendar">} param0._id - The calendar id to update
 * @param {Object<watchSchemaObj>} param0.watch - The watch data to update
 * @param {number} param0.eventsCount - The events count to update */
export const updateCalendar = internalMutation({
  args: { 
    _id: v.id("calendar"),
    watch: v.optional(v.object(watchSchemaObj)),
    eventsCount: v.optional(v.number()),
    isRelevantForConflictDetection: v.optional(v.boolean())
  },
  handler: async (ctx, args) => await ctx.db.patch(args._id, { watch: args.watch, eventsCount: args.eventsCount, isRelevantForConflictDetection: args.isRelevantForConflictDetection })
});

/**
 * @public
 * @since 0.0.14
 * @version 0.0.1
 * @description Handles the internal database mutation for removing an existing calendar for a linked account
 * -> Hint: Function can not be called directly from the client!
 * @param {Object} param0
 * @param {Id<"calendar">} param0._id - The calendar id to remove */
export const removeCalendar = internalMutation({
  args: { _id: v.id("calendar") },
  handler: async (ctx, { _id }) => await ctx.db.delete(_id)
});