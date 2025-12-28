import React from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faBrightnessLow, faCodeCommit, faFlagCheckered } from "@fortawesome/duotone-thin-svg-icons";

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
          { id: "blub", type: "decision", title: "Erste Entscheidung", icon: faCodeCommit as IconProp },
          { id: 'action1', type: 'action', title: 'HTTP API-Aktion', icon: faCodeCommit as IconProp },
        ]}
        onNodePress={(node) => {}}
        onAddNode={(afterId) => console.log('Add after', afterId)}
      />
      <WorkflowFooter />
    </>
  );
};

export default ScreenConfigurationWorkflowProvider;