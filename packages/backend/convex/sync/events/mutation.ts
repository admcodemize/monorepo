import { ConvexError, v } from "convex/values";
import { internalMutation } from "../../_generated/server";
import { eventSchema } from "../../schema";
import { convexError } from "../../../Fetch";
import { ConvexActionServerityEnum } from "../../../Types";
import { Id } from "../../_generated/dataModel";

/**
 * @public
 * @since 0.0.8
 * @version 0.0.1
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

/**
 * @public
 * @since 0.0.11
 * @version 0.0.2
 * @description Handles the internal database mutation for updating an existing event
 * -> Hint: Function can not be called directly from the client!
 * @param {Object} param0
 * @param {Id<"events">} param0._id - The event id to update
 * @param {Object<eventSchema>} param0.event - The event data to update */
export const update = internalMutation({
  args: { 
    _id: v.id("events"), 
    ...eventSchema 
  },
  handler: async (ctx, { _id, ...args }) => {
    try { await ctx.db.patch(_id, { ...args }); }
    catch (err) {
      throw new ConvexError(convexError({
        code: 404,
        info: "i18n.convex.sync.events.mutation.update.notFound",
        severity: ConvexActionServerityEnum.ERROR,
        name: "BLOXIE_IME_U_E01",
        _id: _id as Id<"events">,
      }));
    }
  }
});

/**
 * @public
 * @since 0.0.14
 * @version 0.0.2
 * @description Handles the internal database mutation for removing an existing event
 * -> Hint: Function can not be called directly from the client!
 * @param {Object} param0
 * @param {Id<"events">} param0._id - The event id to remove */
export const remove = internalMutation({
  args: { _id: v.id("events") },
  handler: async (ctx, { _id }) => {
    try { await ctx.db.delete(_id); } 
    catch (err) {
      throw new ConvexError(convexError({
        code: 404,
        info: "i18n.convex.sync.events.mutation.remove.notFound",
        severity: ConvexActionServerityEnum.ERROR,
        name: "BLOXIE_IME_R_E01",
        _id: _id as Id<"events">,
      }));
    }
  }
});