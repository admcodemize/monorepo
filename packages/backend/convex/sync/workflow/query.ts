import { query } from "../../_generated/server";
import { v } from "convex/values";

import { ConvexWorkflowAPIProps, ConvexWorkflowNodeAPIProps, ConvexWorkflowQueryAPIProps } from "../../../Types";

/**
 * @public
 * @since 0.0.37
 * @version 0.0.1
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

    /** @description Get all the nodes for each workflow */
    await Promise.all(workflow.map(async (workflow: ConvexWorkflowAPIProps) => {
      const nodes = await ctx.db.query("workflowNodes")
        .withIndex("byWorkflowId", (q) => q.eq("workflowId", workflow._id))
        .collect();

      workflows.push({
        ...workflow,
        nodes: nodes as ConvexWorkflowNodeAPIProps[]
      });
    }));

    return workflows;
  }
});