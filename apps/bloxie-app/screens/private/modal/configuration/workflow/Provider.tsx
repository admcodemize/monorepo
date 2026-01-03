import React from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faBrightnessLow, faCodeCommit, faEnvelope, faEnvelopeCircleCheck, faEnvelopeCircleUser, faEnvelopesBulk, faMessageSlash, faUsersSlash } from "@fortawesome/duotone-thin-svg-icons";

import WorkflowFooter from "@/components/layout/footer/WorkflowFooter";
import { WorkflowCanvas, WorkflowAdditionPayload, WorkflowNodeType } from "@/components/container/WorkflowCanvas";
import { ConvexTemplateAPIProps } from "@codemize/backend/Types";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.31
 * @version 0.0.2
 * @component */
const ScreenConfigurationWorkflowProvider = () => {

  const nodes = [
    { id: 'start', type: 'start', icon: faBrightnessLow as IconProp },
    {
      id: 'end',
      type: 'end',
      title: 'Abschluss',
      icon: faBrightnessLow as IconProp,
    },
  ];

  const [_nodes, setNodes] = React.useState<any[]>(nodes);

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
              parentNodeId: parentId,
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
        onAddNodeItem={(node: any, template: ConvexTemplateAPIProps) => {
          setNodes(prev => {
            const next = prev.map(existing => {
              if (existing.id !== node.id) {
                return existing;
              }

              const items = existing.items ? [...existing.items] : [];
              const nextItem = {
                id: `action-${Date.now()}`,
                name: template.name ?? '',
                description: template.description ?? '',
                icon: (template.icon as IconProp) ?? faCodeCommit,
                language: template.language,
                subject: template.subject ?? '',
                content: template.content ?? '',
                _id: template._id,
              };

              items.push(nextItem);

              return {
                ...existing,
                items,
              };
            });

            return next;
          });
          console.log("onAddNodeItem", _nodes);
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
 