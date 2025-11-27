import { v } from "convex/values";
import { internalMutation } from "../../_generated/server";
import { settingsSchema } from "../../schema";

/**
 * @private
 * @description Create a settings object for a user
 * -> Internal call must be called from another mutation or action
 * @function
 * @since 0.0.15
 * @version 0.0.1
 * @param {object} args
 * @param {v.id("users")} userId - The id of the user */
export const create = internalMutation({
  args: { ...settingsSchema },
  handler: async (ctx, data) => {
    await ctx.db.insert("settings", {
      ...data,
      userId: data.userId
    });
  }
});

/**
 * @private
 * @description Update a settings object for a user
 * -> Internal call must be called from another mutation or action
 * @function
 * @since 0.0.15
 * @version 0.0.1
 * @param {object} args
 * @param {v.id("settings")} _id - The id of the settings object
 * @param {boolean} args.faceId - Face-ID 
 * @param {boolean} args.pushNotifications - Push notifications
 * @param {number} args.durationMinute - Duration of an event in minutes 
 * @param {number} args.breakingTimeBetweenEvents - The breaking time between events in minutes
 * @param {object} args.integrations - The integrations to update
 * @param {string} args.integrations.integrationKey - The key of the integration
 * @param {boolean} args.integrations.state - The state of the integration */
export const update = internalMutation({
  args: {
    _id: v.id("settings"),
    ...settingsSchema
  },
  handler: async (ctx, { _id, ...data }) => {
    await ctx.db.patch(_id, {
      ...data
    });
  }
});