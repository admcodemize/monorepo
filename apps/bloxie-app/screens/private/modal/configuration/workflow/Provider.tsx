import React from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faBrightnessLow, faCodeCommit, faEnvelope, faEnvelopeCircleCheck, faEnvelopeCircleUser, faEnvelopesBulk, faMessageSlash, faUsersSlash } from "@fortawesome/duotone-thin-svg-icons";

import WorkflowFooter from "@/components/layout/footer/WorkflowFooter";
import { WorkflowCanvas } from "@/components/container/WorkflowCanvas";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.31
 * @version 0.0.2
 * @component */
const ScreenConfigurationWorkflowProvider = () => {


  return (
    <>
      <WorkflowCanvas
        nodes={[
          { id: 'start', type: 'start', icon: faBrightnessLow as IconProp },
          {
            id: 'decision-main',
            type: 'decision',
            title: 'Entscheidung 1',
            icon: faCodeCommit as IconProp,
            parentId: 'start',
            functions: [{
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
            functions: [{
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
            }*/],
          },
          {
            id: 'end',
            type: 'end',
            title: 'Abschluss',
            icon: faBrightnessLow as IconProp,
            parentId: 'action-positive',
          },
        ]}
        onNodePress={() => {}}
        onAddNode={afterId => console.log('Add after', afterId)}
      />
      <WorkflowFooter />
    </>
  );
};

export default ScreenConfigurationWorkflowProvider;