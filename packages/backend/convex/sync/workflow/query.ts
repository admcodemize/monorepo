import { query } from "../../_generated/server";
import { v } from "convex/values";

import { ConvexWorkflowActionAPIProps, ConvexWorkflowAPIProps, ConvexWorkflowDecisionAPIProps, ConvexWorkflowQueryAPIProps } from "../../../Types";

/**
 * @public
 * @since 0.0.37
 * @version 0.0.2
 * @description Returns all the workflows for currently signed in user */
export const get = query({
  args: {
    _id: v.id("users"),
  },
  handler: async (ctx, { _id }): Promise<ConvexWorkflowQueryAPIProps[]> => {
    const workflows: ConvexWorkflowQueryAPIProps[] = [];
    
    /** @description Get all the workflows for the currently signed in user */
    const workflow = await ctx.db.query("workflow")
      .withIndex("byUserId", (q) => q.eq("userId", _id))
      .collect();

    await Promise.all(workflow.map(async (workflow1: ConvexWorkflowAPIProps) => {
      const actions = await ctx.db.query("workflowAction")
        .withIndex("byWorkflowId", (q) => q.eq("workflowId", workflow1._id))
        .collect();

      const decisions = await ctx.db.query("workflowDecision")
        .withIndex("byWorkflowId", (q) => q.eq("workflowId", workflow1._id))
        .collect();

      workflows.push({
        ...workflow1,
        process: {
          ...workflow1.process,
          items: [...actions, ...decisions] as ConvexWorkflowActionAPIProps[] | ConvexWorkflowDecisionAPIProps[]
        }
      });
    }));

    return workflows;
  }
});