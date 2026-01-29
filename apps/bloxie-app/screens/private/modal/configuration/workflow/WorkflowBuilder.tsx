import React from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faBrightnessLow, faLayerGroup, faMicrochip } from "@fortawesome/duotone-thin-svg-icons";

import WorkflowFooter from "@/components/layout/workflow/WorkflowFooter";
import { WorkflowCanvas, WorkflowNode, WorkflowNodeItemProps, WorkflowNodeItemType } from "@/components/layout/workflow/WorkflowCanvas";
import { ConvexRuntimeAPIWorkflowDecisionProps, ConvexTemplateAPIProps, ConvexWorkflowActionAPIProps, ConvexWorkflowAPIProps, ConvexWorkflowDecisionAPIProps, ConvexWorkflowQueryAPIProps } from "@codemize/backend/Types";
import { Id } from "../../../../../../../packages/backend/convex/_generated/dataModel";
import { useConfigurationContextStore } from "@/context/ConfigurationContext";

const createEmptyWorkflow = (): ConvexWorkflowQueryAPIProps => ({
  _id: (`local-${Date.now()}`) as any,
  _creationTime: Date.now(),
  name: "Neuer Workflow",
  userId: "" as any,
  process: {
    isCancellactionTermsIncludes: false,
    items: [],
  } as any,
  start: {
    activityStatus: true,
    trigger: "beforeEventStart",
    timePeriod: "hour",
    timePeriodValue: 24,
  } as any,
  end: {
    confirmation: "none",
  } as any,
});

const ScreenConfigurationWorkflowBuilder = () => {
  const [workflowState, setWorkflowState] = React.useState<ConvexWorkflowQueryAPIProps | undefined>(() => createEmptyWorkflow());

  const selectedWorkflow = useConfigurationContextStore((state) => state.selectedWorkflow);


  React.useEffect(() => {
    if (selectedWorkflow) {
      setWorkflowState(selectedWorkflow);
    } else {
      setWorkflowState(prev => prev ?? createEmptyWorkflow());
    }
  }, [selectedWorkflow]);

  const updateGenericNode = React.useCallback(
    (updater: (node: ConvexWorkflowQueryAPIProps) => ConvexWorkflowQueryAPIProps) => {
      setWorkflowState((prev) => {
        if (!prev) return prev;
        return updater(prev);
      });
    },
    [],
  );


  const handleRemoveNodeItem = React.useCallback(
    (_node: ConvexWorkflowQueryAPIProps, key: string) => {
      /*updateGenericNode(existing => ({
        ...existing,
        items: (existing.items ?? []).filter(item => item.id !== key),
      }));*/
    },
    [updateGenericNode],
  );

  const handleChangeNodeItem = React.useCallback(
    (_node: ConvexWorkflowQueryAPIProps, item: WorkflowNodeItemProps) => {
      /*updateGenericNode(existing => ({
        ...existing,
        items: (existing.items ?? []).map(existingItem =>
          existingItem.id === item.id ? { ...existingItem, ...item } : existingItem,
        ),
      }));*/
    },
    [updateGenericNode],
  );

  /**
   * @description Handles the removal of an item from the workflow canvas state array
   * -> Filters the items array and removes the item with the given convex _id
   * @param {ConvexWorkflowActionAPIProps|ConvexWorkflowDecisionAPIProps} item - The item to remove */
  const handleRemoveItem = React.useCallback(
    (item: ConvexWorkflowActionAPIProps|ConvexWorkflowDecisionAPIProps) => {
      setWorkflowState((prev) => {
        if (!prev || !prev.process?.items) return prev;
        return { ...prev, process: {
          ...prev.process,
          items: prev.process.items.filter((existingItem) => existingItem._id !== item._id),
        }};
      });
    }, [setWorkflowState]);

  /**
   * @description Updates the workflow state with the reordered list of process items
   * @param {Array<ConvexWorkflowActionAPIProps|ConvexWorkflowDecisionAPIProps>} items - Ordered items after drag & drop
   */
  type WorkflowProcessItem = (ConvexWorkflowActionAPIProps & { nodeType: "action" }) | (ConvexWorkflowDecisionAPIProps & { nodeType: "decision" });

  const handleReorderItems = React.useCallback(
    (items: WorkflowProcessItem[]) => {
      setWorkflowState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          process: {
            ...(prev.process ?? { isCancellactionTermsIncludes: false }),
            items,
          },
        };
      });
    },
    [],
  );

  /**
   * @description Fügt eine Aktion in den Workflow-State (process.items) ein.
   */
  const handleAddAction = React.useCallback(
    (action: ConvexWorkflowActionAPIProps) => {
      setWorkflowState((prev) => {
        if (!prev) return prev;
        const processItems = prev.process?.items ?? [];
        const itemWithNodeType = {
          ...action,
          _id: action._id ?? (`local-action-${Date.now()}` as Id<"workflowAction">),
          workflowId: (prev._id ?? action.workflowId) as Id<"workflow">,
          nodeType: "action" as const,
        };
        return {
          ...prev,
          process: {
            ...(prev.process ?? { isCancellactionTermsIncludes: false }),
            items: [...processItems, itemWithNodeType],
          },
        };
      });
    },
    [],
  );

  /**
   * @description Konvertiert eine Runtime-Entscheidung in process.items-Format und fügt sie in den Workflow-State ein.
   */
  const handleAddDecision = React.useCallback(
    (decision: ConvexRuntimeAPIWorkflowDecisionProps) => {
      setWorkflowState((prev) => {
        if (!prev) return prev;
        const processItems = prev.process?.items ?? [];
        const workflowDecision: ConvexWorkflowDecisionAPIProps & { nodeType: "decision" } = {
          _id: (`local-decision-${Date.now()}` as Id<"workflowDecision">),
          workflowId: (prev._id ?? undefined) as Id<"workflow">,
          type: decision.type,
          content: [decision.key],
          activityStatus: true,
          nodeType: "decision",
        };
        return {
          ...prev,
          process: {
            ...(prev.process ?? { isCancellactionTermsIncludes: false }),
            items: [...processItems, workflowDecision],
          },
        };
      });
    },
    [],
  );

  return (
    <>
    <WorkflowCanvas
      workflow={workflowState}
      onAddAction={handleAddAction}
      onAddDecision={handleAddDecision}
      onRemoveItem={handleRemoveItem}
      onChangeNodeItem={handleChangeNodeItem}
      onReorderItems={handleReorderItems} />
    <WorkflowFooter />
    </>
  );
};

export default ScreenConfigurationWorkflowBuilder;
