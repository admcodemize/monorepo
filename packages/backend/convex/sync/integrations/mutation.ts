import { v } from "convex/values";
import { internalMutation } from "../../_generated/server";
import { linkedSchema, calendarSchema, watchSchemaObj } from "../../schema";

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
 * @version 0.0.1
 * @description Handles the internal database mutation for updating an existing calendar watch
 * -> Hint: Function can not be called directly from the client!
 * @param {Object} param0
 * @param {Id<"calendar">} param0._id - The calendar id to update
 * @param {Object<watchSchemaObj>} param0.watch - The watch data to update */
export const updateCalendarWatch = internalMutation({
  args: { 
    _id: v.id("calendar"),
    watch: v.object(watchSchemaObj)
  },
  handler: async (ctx, args) => await ctx.db.patch(args._id, { watch: args.watch })
});