import { v } from "convex/values";
import { ConvexHandlerError, ConvexHandlerPromiseProps, fetchTypedConvex } from "../../../Fetch";
import { internal } from "../../_generated/api";
import { action } from "../../_generated/server";
import { settingsSchema } from "../../schema";

/**
 * @public
 * @description Create a settings object for a user
 * -> Call internal mutation 
 * @function
 * @since 0.0.15
 * @version 0.0.1
 * @param {object} args
 * @param {v.id("settings")} args._id - The id of the settings object
 * @param {boolean} args.faceId - Face-ID 
 * @param {boolean} args.pushNotifications - Push notifications
 * @param {number} args.durationMinute - Duration of an event in minutes 
 * @param {number} args.breakingTimeBetweenEvents - The breaking time between events in minutes
 * @param {object} args.integrations - The integrations to create
 * @param {string} args.integrations.integrationKey - The key of the integration
 * @param {boolean} args.integrations.state - The state of the integration */
export const create = action({
  args: { ...settingsSchema },
  handler: async ({ runMutation }, { userId, ...data }): Promise<ConvexHandlerPromiseProps> => {
    const [err] = await fetchTypedConvex(runMutation(internal.sync.settings.mutation.create, { userId, ...data }))    
    return {
      hasErr: !!err,
      err: err && err?.data as ConvexHandlerError || undefined 
    }
  }
});

/**
 * @public
 * @description Update a settings object for a user
 * -> Call internal mutation 
 * @function
 * @since 0.0.15
 * @version 0.0.1
 * @param {object} args
 * @param {v.id("settings")} args._id - The id of the settings object
 * @param {boolean} args.faceId - Face-ID 
 * @param {boolean} args.pushNotifications - Push notifications
 * @param {number} args.durationMinute - Duration of an event in minutes 
 * @param {number} args.breakingTimeBetweenEvents - The breaking time between events in minutes
 * @param {object} args.integrations - The integrations to update
 * @param {string} args.integrations.integrationKey - The key of the integration
 * @param {boolean} args.integrations.state - The state of the integration */
export const update = action({
  args: { 
    _id: v.id("settings"), 
    ...settingsSchema 
  },
  handler: async ({ runMutation }, { _id, ...data }): Promise<ConvexHandlerPromiseProps> => {
    const [err] = await fetchTypedConvex(runMutation(internal.sync.settings.mutation.update, { _id, ...data }))    
    return {
      hasErr: !!err,
      err: err && err?.data as ConvexHandlerError || undefined
    }
  }
});