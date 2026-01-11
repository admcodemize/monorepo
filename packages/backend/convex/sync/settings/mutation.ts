import { ConvexError, v } from "convex/values";
import { internalMutation, mutation } from "../../_generated/server";
import { settingsSchema } from "../../schema";
import { convexError } from "../../../Fetch";
import { Id } from "../../_generated/dataModel";
import { ConvexActionServerityEnum } from "../../../Types";

/**
 * @public
 * @since 0.0.19
 * @version 0.0.2
 * @description Handles the database mutation for updating a single property of a settings object
 * -> Hint: Function can be called directly from the client!
 * @param {Object} param0
 * @param {Id<"settings">} param0._id - The settings id to update
 * @param {string} param0.property - The property to update
 * @param {boolean} param0.value - The value to update */
export const updateSettingsProperty = mutation({
  args: {
    _id: v.id("settings"),
    property: v.string(),
    value: v.union(v.boolean(), v.string())
  },
  handler: async (ctx, { _id, property, value }) => {
    try { await ctx.db.patch(_id, { [property]: value }); }
    catch (err) {
      throw new ConvexError(convexError({
        code: 404,
        info: "i18n.convex.sync.settings.mutation.update.notFound",
        severity: ConvexActionServerityEnum.ERROR,
        name: "BLOXIE_MS_U_E01",
        _id: _id as Id<"settings">,
      }));
    }
  }
});

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