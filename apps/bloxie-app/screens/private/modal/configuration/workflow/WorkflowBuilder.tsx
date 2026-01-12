import React from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faBrightnessLow, faLayerGroup, faMicrochip } from "@fortawesome/duotone-thin-svg-icons";

import WorkflowFooter from "@/components/layout/footer/WorkflowFooter";
import { WorkflowCanvas, WorkflowNode, WorkflowNodeItemProps, WorkflowNodeItemVariant } from "@/components/container/WorkflowCanvas";
import { ConvexTemplateAPIProps } from "@codemize/backend/Types";

type ExtendedWorkflowNode = WorkflowNode;

const GENERIC_NODE_ID = "generic";

const INITIAL_NODES: ExtendedWorkflowNode[] = [
  { id: "start", type: "start", icon: faBrightnessLow as IconProp },
  {
    id: GENERIC_NODE_ID,
    type: "generic",
    title: "Prozessschritte",
    icon: faMicrochip as IconProp,
    /*groups: [{
      id: "group-1",
      name: "Gruppe 1",
      icon: faLayerGroup as IconProp,
      items: [],
    }],*/
    items: [],
  },
  { id: "end", type: "end", title: "Abschluss", icon: faBrightnessLow as IconProp },
];

const ScreenConfigurationWorkflowBuilder = () => {
  const [nodes, setNodes] = React.useState<ExtendedWorkflowNode[]>(INITIAL_NODES);

  const updateGenericNode = React.useCallback(
    (updater: (node: ExtendedWorkflowNode) => ExtendedWorkflowNode) => {
      setNodes(prev =>
        prev.map(existing =>
          existing.id === GENERIC_NODE_ID ? updater(existing) : existing,
        ),
      );
    },
    [],
  );

  const handleAddNodeItem = React.useCallback(
    (_node: WorkflowNode, variant: WorkflowNodeItemVariant, template: ConvexTemplateAPIProps) => {
      updateGenericNode(existing => {
        const templateId =
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
          variant,
          _id: templateId,
        };

        const items = existing.items ? [...existing.items, nextItem] : [nextItem];

        return {
          ...existing,
          items,
        };
      });
    },
    [updateGenericNode],
  );

  const handleRemoveNodeItem = React.useCallback(
    (_node: WorkflowNode, key: string) => {
      updateGenericNode(existing => ({
        ...existing,
        items: (existing.items ?? []).filter(item => item.id !== key),
      }));
    },
    [updateGenericNode],
  );

  const handleChangeNodeItem = React.useCallback(
    (_node: WorkflowNode, item: WorkflowNodeItemProps) => {
      updateGenericNode(existing => ({
        ...existing,
        items: (existing.items ?? []).map(existingItem =>
          existingItem.id === item.id ? { ...existingItem, ...item } : existingItem,
        ),
      }));
    },
    [updateGenericNode],
  );

  return (
    <>
      <WorkflowCanvas
        nodes={nodes}
        onAddNodeItem={handleAddNodeItem}
        onRemoveNodeItem={handleRemoveNodeItem}
        onChangeNodeItem={handleChangeNodeItem}
      />
      <WorkflowFooter />
    </>
  );
};

export default ScreenConfigurationWorkflowBuilder;

/**
 *     /*{
      id: 'decision-main',
      type: 'decision',
      title: 'Entscheidung 1',
      icon: faCodeCommit as IconProp,
      parentId: 'start',
      /*items: [{
        id: 'action-positive-2',
        name: 'Für Benutzergruppe ...',
        description: '',
        icon: faUsersSlash as IconProp,
      }],
    },
    {
      id: 'action-positive',
      type: 'action',
      title: 'Aktion 1',
      icon: faCodeCommit as IconProp,
      parentId: 'decision-main',
      /*items: [{
        id: 'action-positive-1',
        name: 'E-Mail an alle Teilnehmer senden',
        description: '',
        icon: faEnvelopesBulk as IconProp,
      }/*, {
        id: 'action-positive-1',
        name: 'E-Mail an spezifische Teilnehmer senden',
        description: '',
        icon: faEnvelopesBulk as IconProp,
      }, {
        id: 'action-positive-2',
        name: 'E-Mail an Gastgeber senden',
        description: '',
        icon: faEnvelopeCircleCheck as IconProp,
      }, { 
        id: 'action-positive-2',
        name: 'E-Mail an Drittperson(en) senden',
        description: '',
        icon: faEnvelopeCircleUser as IconProp,
      }*],
    },*/
 