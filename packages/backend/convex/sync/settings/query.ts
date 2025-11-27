import { v } from "convex/values";
import { query } from "../../_generated/server";

/**
 * @public
 * @since 0.0.15
 * @version 0.0.1
 * @description Returns all the settings for currently signed in user 
 * @param {object} args
 * @param {v.id("users")} args._id - The id of the user */
export const get = query({
  args: { _id: v.id("users") },
  handler: async ({ db }, { _id }) => {
    return await db.query("settings")
      .withIndex("byUserId", (q) => q.eq("userId", _id))
      .unique();
  }
});