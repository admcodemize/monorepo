import { internalQuery, query } from "../../_generated/server";
import { v } from "convex/values";

import { ConvexTemplateAPIProps } from "../../../Types";

/**
 * @public
 * @since 0.0.37
 * @version 0.0.1
 * @description Returns all the templates for currently signed in user and also the global templates
 * -> The templates are used to generate the content for the workflows */
export const get = query({
  args: { _id: v.id("users") },
  handler: async (ctx, { _id }): Promise<ConvexTemplateAPIProps[]> => {
    /** @description Get all the global templates */
    const globalTemplates = await ctx.db
      .query("template")
      .filter((q) => q.eq(q.field("isGlobal"), true))
      .collect();

    /** @description Get all the templates for the currently signed in user */
    const userTemplates = await ctx.db
      .query("template")
      .withIndex("byUserId", (q) => q.eq("userId", _id))
      .filter((q) => q.eq(q.field("isGlobal"), false))
      .collect();

    return [...globalTemplates, ...userTemplates];
  },
});

/**
 * @public
 * @since 0.0.37
 * @version 0.0.1
 * @description Returns the global templates which are not associated with a user
 * -> The templates are used to generate the content for the workflows */
export const getWithoutUserId = internalQuery({
  args: {},
  handler: async (ctx): Promise<ConvexTemplateAPIProps[]> => {
    return await ctx.db
    .query("template")
    .filter((q) => q.eq(q.field("isGlobal"), true))
    .collect();
  },
});

/**
 * @public
 * @since 0.0.37
 * @version 0.0.1
 * @description Returns all the templates for currently signed in user
 * -> The templates are used to generate the content for the workflows */
export const getByUserId = internalQuery({
  args: {
    _id: v.id("users"),
  },
  handler: async (ctx, { _id }): Promise<ConvexTemplateAPIProps[]> => {
    return await ctx.db
      .query("template")
      .withIndex("byUserId", (q) => q.eq("userId", _id))
      .filter((q) => q.eq(q.field("isGlobal"), false))
      .collect();
  }
});