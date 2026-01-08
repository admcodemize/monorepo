import React from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faBrightnessLow, faCodeCommit, faEnvelope, faEnvelopeCircleCheck, faEnvelopeCircleUser, faEnvelopesBulk, faMessageSlash, faUsersSlash } from "@fortawesome/duotone-thin-svg-icons";

import WorkflowFooter from "@/components/layout/footer/WorkflowFooter";
import { WorkflowCanvas, WorkflowAdditionPayload, WorkflowNodeType } from "@/components/container/WorkflowCanvas";
import type { WorkflowNode, WorkflowNodeItemProps } from "@/components/container/WorkflowCanvas";
import { ConvexTemplateAPIProps } from "@codemize/backend/Types";

type ExtendedWorkflowNode = WorkflowNode & {
  parentId?: string;
  childIds?: string[];
};

type WorkflowNodeId = NonNullable<WorkflowNode["parentNodeId"]>;

const readParentId = (node: ExtendedWorkflowNode): string | undefined => {
  if (typeof node.parentNodeId === "string" && node.parentNodeId.length > 0) {
    return node.parentNodeId;
  }

  if (typeof node.parentId === "string" && node.parentId.length > 0) {
    return node.parentId;
  }

  return undefined;
};

const toWorkflowNodeId = (value?: string): WorkflowNode["parentNodeId"] => {
  if (!value) {
    return undefined;
  }

  return value as WorkflowNodeId;
};

const applyParentId = (node: ExtendedWorkflowNode, parentId?: string): ExtendedWorkflowNode => {
  const currentParentId = readParentId(node);
  if (currentParentId === parentId) {
    return node;
  }

  const next: ExtendedWorkflowNode = { ...node };

  if (parentId) {
    const normalizedParentId = toWorkflowNodeId(parentId);
    if (normalizedParentId) {
      next.parentNodeId = normalizedParentId;
    } else {
      delete next.parentNodeId;
    }
    next.parentId = parentId;
    return next;
  }

  delete next.parentNodeId;
  delete next.parentId;
  return next;
};

const removeChildReference = (node: ExtendedWorkflowNode, childId: string): ExtendedWorkflowNode => {
  const removalId = toWorkflowNodeId(childId);
  const hasChildNodeIds =
    Array.isArray(node.childNodeIds) &&
    (removalId
      ? node.childNodeIds.some(id => id === removalId)
      : node.childNodeIds.some(id => String(id) === childId));
  const hasLegacyChildIds = Array.isArray(node.childIds) && node.childIds.includes(childId);

  if (!hasChildNodeIds && !hasLegacyChildIds) {
    return node;
  }

  const next: ExtendedWorkflowNode = { ...node };

  if (hasChildNodeIds && Array.isArray(node.childNodeIds)) {
    next.childNodeIds = removalId
      ? node.childNodeIds.filter(id => id !== removalId)
      : node.childNodeIds.filter(id => String(id) !== childId);
  }

  if (hasLegacyChildIds) {
    next.childIds = node.childIds?.filter(id => id !== childId);
  }

  return next;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.31
 * @version 0.0.2
 * @component */
const ScreenConfigurationWorkflowProvider = () => {

  const initialNodes: ExtendedWorkflowNode[] = [
    { id: "start", type: "start", icon: faBrightnessLow as IconProp },
    {
      id: "end",
      type: "end",
      title: "Abschluss",
      icon: faBrightnessLow as IconProp,
    },
  ];

  const [_nodes, setNodes] = React.useState<ExtendedWorkflowNode[]>(initialNodes);

  return (
    <>
      <WorkflowCanvas
        nodes={_nodes}
        onAddNode={(connection: WorkflowAdditionPayload|null, type: WorkflowNodeType) => {
          if (!connection) {
            return;
          }

          setNodes(prev => {
            const next = [...prev];

            const targetId = connection.toId;
            const parentId = connection.fromId;

            const newNode = {
              id: `decision-${Date.now()}`,
              type,
              title: `Entscheidung ${next.length + 1}`,
              icon: faCodeCommit as IconProp,
              parentNodeId: toWorkflowNodeId(parentId),
              parentId,
            };

            const insertBeforeIndex = targetId ? next.findIndex(node => node.id === targetId) : -1;

            const insertIndex = insertBeforeIndex >= 0 ? insertBeforeIndex : (() => {
              const endIndex = next.findIndex(node => node.type === 'end');
              return endIndex >= 0 ? endIndex : next.length;
            })();

            next.splice(insertIndex, 0, newNode);

            if (insertBeforeIndex >= 0) {
              const successor = next[insertIndex + 1];
              if (successor) {
                const updatedSuccessor: any = {
                  ...successor,
                  parentNodeId: newNode.id,
                };

                if ('parentId' in successor) {
                  updatedSuccessor.parentId = newNode.id;
                }

                next[insertIndex + 1] = updatedSuccessor;
              }
            }

            return next;
          });
        }}
        onRemoveNode={(node: WorkflowNode) => {
          setNodes(prev => {
            const index = prev.findIndex(existing => existing.id === node.id);
            if (index === -1) {
              return prev;
            }

            const target = prev[index];

            if (target.type === "start" || target.type === "end") {
              return prev;
            }

            const fallbackParentId = readParentId(target) ?? prev[index - 1]?.id;

            const filtered = prev.filter(existing => existing.id !== node.id);

            return filtered.map(existing => {
              let updated = existing;

              if (readParentId(existing) === node.id) {
                updated = applyParentId(existing, fallbackParentId);
              }

              updated = removeChildReference(updated, node.id);

              return updated;
            });
          });
        }}
        onAddNodeItem={(node: WorkflowNode, template: ConvexTemplateAPIProps) => {
          setNodes(prev => {
            const next = prev.map(existing => {
              if (existing.id !== node.id) {
                return existing;
              }

              const items = existing.items ? [...existing.items] : [];
              const templateId =
                (template._id as WorkflowNodeItemProps["_id"]) ??
                (`template-${Date.now()}` as WorkflowNodeItemProps["_id"]);

              const nextItem = {
                id: `action-${Date.now()}`,
                name: template.name ?? '',
                description: template.description ?? '',
                icon: (template.icon as IconProp) ?? faCodeCommit,
                language: template.language as WorkflowNodeItemProps["language"],
                subject: template.subject ?? '',
                content: template.content ?? '',
                _id: templateId,
              };

              items.push(nextItem);

              return {
                ...existing,
                items,
              };
            });

            return next;
          });
        }}
        onRemoveNodeItem={(node: any, key: string) => {
          console.log("onRemoveNodeItemProvider", key);
          setNodes(prev => {
            const next = prev.map(existing => {
              if (existing.id !== node.id) {
                return existing;
              }
              return {
                ...existing,
                items: (existing.items ?? []).filter((item: any) => item.id !== key),
              };
            });
            return next;
          });
        }}
        onChangeNodeItem={(node: WorkflowNode, item: WorkflowNodeItemProps) => {
          setNodes(prev => prev.map(existing => {
            if (existing.id !== node.id) {
              return existing;
            }

            const items = (existing.items ?? []).map((existingItem: WorkflowNodeItemProps) =>
              existingItem.id === item.id ? { ...existingItem, ...item } : existingItem,
            );

            return {
              ...existing,
              items,
            };
          }));
        }}
      />
      <WorkflowFooter />
    </>
  );
};

export default ScreenConfigurationWorkflowProvider;

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
 