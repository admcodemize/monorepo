import React from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faBrightnessLow, faLayerGroup, faMicrochip } from "@fortawesome/duotone-thin-svg-icons";

import WorkflowFooter from "@/components/layout/footer/WorkflowFooter";
import { WorkflowCanvas, WorkflowNode, WorkflowNodeItemProps, WorkflowNodeItemType } from "@/components/container/WorkflowCanvas";
import { ConvexTemplateAPIProps, ConvexWorkflowAPIProps } from "@codemize/backend/Types";
import { Id } from "../../../../../../../packages/backend/convex/_generated/dataModel";

/**
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
    }],*
    items: [],
  },
  { id: "end", type: "end", title: "Abschluss", icon: faBrightnessLow as IconProp },
];
 */

const workflow: ConvexWorkflowAPIProps = 
  {
    _id: "j5744ppd87fwk0njh4qww4a4yx7ywx7h" as Id<"workflow">,
    _creationTime: 1715769600,
    userId: "j5744ppd87fwk0njh4qww4a4yx7ywx7h" as Id<"users">,
    name: "Workflow 1",
    start: {
      trigger: "beforeEventStart",
      timePeriod: "hour",
      timePeriodValue: 24,
      activityStatus: true,
    },
    process: {
      isCancellactionTermsIncludes: false,
      items: ["j5744ppd87fwk0njh4qww4a4yx7ywx7h"] as Id<"workflowAction">[] | Id<"workflowDecision">[],
    },
    end: {
      confirmation: "none",
    },
  };
/**
 * /**
 * @since 0.0.37
 * @version 0.0.2
 * @description Schema definition for table "workflow"
 * -> Handles the workflow template configurations for the user
 * @interface *
export const workflowSchema = {
  userId: v.id("users"),
  name: v.string(),
  start: v.object({
    trigger: v.union(v.literal("beforeEventStart"), v.literal("afterEventEnd"), v.literal("newBooking"), v.literal("afterEventCancellation")),
    timePeriod: v.union(v.literal("week"), v.literal("day"), v.literal("hour"), v.literal("minute")),
    timePeriodValue: v.number(),
    activityStatus: v.optional(v.boolean()), // -> If the workflow is active or inactive => true: active, false: inactive
  }),
  process: v.object({
    isCancellactionTermsIncludes: v.optional(v.boolean()),
    actions: v.array(v.id("workflowAction")),
    decisions: v.array(v.id("workflowDecision")),
  }),
  end: v.object({
    confirmation: v.union(v.literal("none"), v.literal("email"), v.literal("pushNotification")),
  }),
}

/**
 * @since 0.0.47
 * @version 0.0.1
 * @description Schema definition for table "workflowAction"
 * -> Handles the action configuration for a specific workflow
 * @interface *
export const workflowActionSchema = {
  workflowId: v.id("workflow"),
  name: v.string(),
  subject: v.string(),
  content: v.string(),
  activityStatus: v.optional(v.boolean()), // -> If the action is active or inactive => true: active, false: inactive
}

/**
 * @since 0.0.47
 * @version 0.0.1
 * @description Schema definition for table "workflowDecision"
 * -> Handles the decision configuration for a specific workflow
 * @interface *
export const workflowDecisionSchema = {
  workflowId: v.id("workflow"),
  type: v.union(v.literal("eventType"), v.literal("calendarConnection")),
  content: v.array(v.string()),
  activityStatus: v.optional(v.boolean()), // -> If the decision is active or inactive => true: active, false: inactive
}
 */


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
  const [workflowState, setWorkflowState] = React.useState<ConvexWorkflowAPIProps>(workflow);

  const updateGenericNode = React.useCallback(
    (updater: (node: ConvexWorkflowAPIProps) => ConvexWorkflowAPIProps) => {
      setWorkflowState(prev => updater(prev));
    },
    [workflow],
  );

  const handleAddNodeItem = React.useCallback(
    (_node: ConvexWorkflowAPIProps, type: WorkflowNodeItemType, template: ConvexTemplateAPIProps) => {
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
    (_node: ConvexWorkflowAPIProps, key: string) => {
      /*updateGenericNode(existing => ({
        ...existing,
        items: (existing.items ?? []).filter(item => item.id !== key),
      }));*/
    },
    [updateGenericNode],
  );

  const handleChangeNodeItem = React.useCallback(
    (_node: ConvexWorkflowAPIProps, item: WorkflowNodeItemProps) => {
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
        workflow={workflowState}
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
 