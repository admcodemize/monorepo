import { internalMutation } from "../_generated/server";
import { userSchema } from "../schema";

/**
 * @public
 * @since 0.0.1
 * @version 0.0.1
 * @description Handles the internal database mutation for newly created clerk user
 * -> Hint: Function can not be called directly from the client!
 * @param {Object} param0
 * @param {string} param0.clerkId - Clerk identification 
 * @param {string} param0.email - Email-address by oauth provider or email authentication 
 * @param {boolean} param0.banned - Handles further queries which the user has the be unbanned 
 * @param {string} param0.provider - Oauth provider which has been used for the authentication flow */
export const create = internalMutation({
  args: { ...userSchema },
  handler: async (ctx, args) => await ctx.db.insert("users", { ...args }),
}); 