import React from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faBrightnessLow, faLayerGroup, faMicrochip } from "@fortawesome/duotone-thin-svg-icons";

import WorkflowFooter from "@/components/layout/footer/WorkflowFooter";
import { WorkflowCanvas, WorkflowNode, WorkflowNodeItemProps, WorkflowNodeItemType } from "@/components/container/WorkflowCanvas";
import { ConvexTemplateAPIProps, ConvexWorkflowAPIProps, ConvexWorkflowQueryAPIProps } from "@codemize/backend/Types";
import { Id } from "../../../../../../../packages/backend/convex/_generated/dataModel";
import { useConfigurationContextStore } from "@/context/ConfigurationContext";

const ScreenConfigurationWorkflowBuilder = () => {

  const workflows = useConfigurationContextStore((state) => state.workflows);
  console.log("workflows", workflows);
  const [workflowState, setWorkflowState] = React.useState<ConvexWorkflowQueryAPIProps>(workflows[0]);

  const updateGenericNode = React.useCallback(
    (updater: (node: ConvexWorkflowQueryAPIProps) => ConvexWorkflowQueryAPIProps) => {
      setWorkflowState(prev => updater(prev));
    },
    [workflows],
  );

  const handleAddNodeItem = React.useCallback(
    (_node: ConvexWorkflowQueryAPIProps, type: WorkflowNodeItemType, template: ConvexTemplateAPIProps) => {
      updateGenericNode(existing => {
        return existing;
        /*const templateId =
          (template._id as WorkflowNodeItemProps["_id"]) ??
          (`template-${Date.now()}` as WorkflowNodeItemProps["_id"]);

        const nextItem: WorkflowNodeItemProps = {
          id: `item-${Date.now()}`,
          name: template.name ?? "",
          description: template.description ?? "",
          icon: (template.icon as IconProp) ?? faMicrochip,
          language: (template.language ?? "de") as WorkflowNodeItemProps["language"],
          subject: template.subject ?? "",
          content: template.content ?? "",
          isActive: true,
          type,
          _id: templateId,
        };

        const items = existing.items ? [...existing.items, nextItem] : [nextItem];

        return {
          ...existing,
          items,
        };*/

      });
    },
    [updateGenericNode],
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

  return (
    <>
      <WorkflowCanvas
        workflow={workflows[0]}
        onAddNodeItem={handleAddNodeItem}
        onRemoveNodeItem={handleRemoveNodeItem}
        onChangeNodeItem={handleChangeNodeItem}
      />
      <WorkflowFooter />
    </>
  );
};

export default ScreenConfigurationWorkflowBuilder;
