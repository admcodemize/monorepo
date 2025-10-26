import { internalQuery, query } from "../_generated/server";
import { v } from "convex/values";

/**
 * @public
 * @since 0.0.1
 * @version 0.0.1
 * @description Returns the user object based on signed in clerk identification
 * @param {Object} param0
 * @param {string} param0.clerkId - Clerk identification */
export const getUserByClerkId = query({
  args: {
    clerkId: v.optional(v.string()),
  },
  handler: async (ctx, args) => await ctx.db.query("users")
    .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
    .unique()
});

/**
 * @public
 * @since 0.0.1
 * @version 0.0.1
 * @description Returns the user object based on convex users table
 * @param {Object} param0
 * @param {string} param0.userId - Convex user identification based on table "users" and property "_id" */
export const getUserByConvexId = query({
  args: {
    userId: v.id("users")
  },
  handler: async (ctx, args) => await ctx.db.get(args.userId)
})