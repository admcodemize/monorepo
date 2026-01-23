import React from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faBrightnessLow, faLayerGroup, faMicrochip } from "@fortawesome/duotone-thin-svg-icons";

import WorkflowFooter from "@/components/layout/footer/WorkflowFooter";
import { WorkflowCanvas, WorkflowNode, WorkflowNodeItemProps, WorkflowNodeItemType } from "@/components/container/WorkflowCanvas";
import { ConvexTemplateAPIProps, ConvexWorkflowActionAPIProps, ConvexWorkflowAPIProps, ConvexWorkflowDecisionAPIProps, ConvexWorkflowQueryAPIProps } from "@codemize/backend/Types";
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
    trigger: "afterEventEnd",
    timePeriod: "minute",
    timePeriodValue: 0,
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

  const handleAddNodeItem = React.useCallback(
    (_node: ConvexWorkflowQueryAPIProps, type: WorkflowNodeItemType, template: ConvexTemplateAPIProps) => {
      setWorkflowState(prev => {
        const base = prev ?? _node;
        if (!base) return prev;

        const templateId =
          (template._id as WorkflowNodeItemProps["_id"]) ??
          (`template-${Date.now()}` as WorkflowNodeItemProps["_id"]);

        const nextItem = {
          ...(template as any),
          _id: templateId as any,
          nodeType: type,
          name: template.name ?? "Neue Aktion",
          activityStatus: (template as any).activityStatus ?? true,
        } as any;

        const processItems = base.process?.items ?? [];

        return {
          ...base,
          process: {
            ...(base.process ?? { isCancellactionTermsIncludes: false }),
            items: [...processItems, nextItem],
          },
        } as ConvexWorkflowQueryAPIProps;
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

  return (
    <>
    <WorkflowCanvas
      workflow={workflowState}
      onAddNodeItem={handleAddNodeItem}
      onRemoveItem={handleRemoveItem}
      onChangeNodeItem={handleChangeNodeItem} />
    <WorkflowFooter />
    </>
  );
};

export default ScreenConfigurationWorkflowBuilder;
