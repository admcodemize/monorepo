import { v } from "convex/values";
import { internalQuery } from "../../_generated/server";

/**
 * @public
 * @since 0.0.38
 * @version 0.0.1
 * @description Returns the user object based on convex users table
 * @param {Object} param0
 * @param {v.id("users")} param0._id - The id of the user */
export const get = internalQuery({
  args: { _id: v.id("users") },
  handler: async (ctx, { _id }) => await ctx.db.query("users")
    .filter((q) => q.eq(q.field("_id"), _id))
    .unique()
});