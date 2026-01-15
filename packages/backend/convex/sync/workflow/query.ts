import { query } from "../../_generated/server";
import { v } from "convex/values";

import { ConvexWorkflowActionAPIProps, ConvexWorkflowDecisionAPIProps, ConvexWorkflowQueryAPIProps } from "../../../Types";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.37
 * @version 0.0.3
 * @description Returns all the workflows for currently signed in user */
export const get = query({
  args: {
    _id: v.id("users"),
  },
  handler: async (ctx, { _id }): Promise<ConvexWorkflowQueryAPIProps[]> => {
    const workflows: ConvexWorkflowQueryAPIProps[] = [];
    
    /** @description Get all the workflows for the currently signed in user */
    const workflowQuery = await ctx.db.query("workflow")
      .withIndex("byUserId", (q) => q.eq("userId", _id))
      .collect();

    await Promise.all(workflowQuery.map(async (workflow) => {
      const actions: ConvexWorkflowActionAPIProps[] = await ctx.db.query("workflowAction")
        .withIndex("byWorkflowId", (q) => q.eq("workflowId", workflow._id))
        .collect();

      const decisions: ConvexWorkflowDecisionAPIProps[] = await ctx.db.query("workflowDecision")
        .withIndex("byWorkflowId", (q) => q.eq("workflowId", workflow._id))
        .collect();

      workflows.push({
        ...workflow,
        process: {
          ...workflow.process,
          isCancellactionTermsIncludes: workflow.process.isCancellactionTermsIncludes ?? false,
          items: [...actions.map((action) => ({ ...action, nodeType: "action" as const })), ...decisions.map((decision) => ({ ...decision, nodeType: "decision" as const }))],
        },
      });
    }));

    return workflows;
  }
});