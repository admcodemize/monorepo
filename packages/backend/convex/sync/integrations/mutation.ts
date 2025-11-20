import { internalMutation } from "../../_generated/server";
import { v } from "convex/values";
import { encryptedTokenSchema } from "../../schema";

/**
 * @public
 * @since 0.0.9
 * @version 0.0.1
 * @description Handles the internal database mutation for newly created linked account
 * -> Hint: Function can not be called directly from the client!
 * @param {Object} param0
 * @param {string} param0.userId - User identification 
 * @param {string} param0.provider - Oauth provider which has been used for the authentication flow
 * @param {string} param0.providerId - Provider identification
 * @param {string} param0.email - Email-address by oauth provider or email authentication 
 * @param {array} param0.scopes - Scopes which have been used for the authentication flow
 * @param {string} param0.refreshToken - Refresh token for the authentication flow */
export const create = internalMutation({
  args: {
    userId: v.id("users"),
    provider: v.string(),
    providerId: v.string(),
    email: v.string(),
    scopes: v.optional(v.array(v.string())),
    refreshToken: v.object(encryptedTokenSchema),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("linked", {
      ...args,
    });
  },
});

/**
 * @public
 * @since 0.0.9
 * @version 0.0.1
 * @description Handles the internal database mutation for updating a linked account
 * -> Hint: Function can not be called directly from the client!
 * @param {Object} param0
 * @param {string} param0._id - Linked account identification
 * @param {string} param0.refreshToken - Refresh token for the authentication flow 
 * @function */
export const update = internalMutation({
  args: {
    _id: v.id("linked"),
    refreshToken: v.object(encryptedTokenSchema),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args._id, {
      refreshToken: args.refreshToken,
    });
  },
});