import { internalMutation } from "../../_generated/server";
import { v } from "convex/values";
import { watchSchema, linkedSchema } from "../../schema";

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
 * @since 0.0.10
 * @version 0.0.1
 * @description Handles the internal database mutation for creating a linked data -> Additional information for the linked provider account
 * -> Hint: Function can not be called directly from the client!
 * @param {Object} param0
 * @param {string} param0.userId - User identification
 * @param {string} param0.provider - Oauth provider which has been used for the authentication flow
 * @param {string} param0.providerId - Provider identification
 * @param {string} param0.calendarId - Calendar identification */
export const createWatch = internalMutation({
  args: { ...watchSchema },
  handler: async (ctx, args) => await ctx.db.insert("watch", { ...args })
});