import { internalMutation } from "../../_generated/server";
import { eventSchema } from "../../schema";

/**
 * @public
 * @since 0.0.9
 * @version 0.0.9
 * @description Handles the internal database mutation for newly created clerk user
 * -> Hint: Function can not be called directly from the client!
 * @param {Object} param0
 * @param {string} param0.clerkId - Clerk identification 
 * @param {string} param0.email - Email-address by oauth provider or email authentication 
 * @param {boolean} param0.banned - Handles further queries which the user has the be unbanned */
export const create = internalMutation({
  args: { ...eventSchema },
  handler: async (ctx, args) => await ctx.db.insert("events", { ...args }),
}); 