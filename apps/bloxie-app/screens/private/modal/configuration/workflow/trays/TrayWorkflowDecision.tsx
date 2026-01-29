import { ConvexRuntimeAPIWorkflowDecisionProps } from "@codemize/backend/Types";

import ListWorkflowDecision from "@/screens/private/modal/configuration/workflow/lists/ListWorkflowDecision";
import TrayContainer from "@/components/container/TrayContainer";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.38
 * @version 0.0.3
 * @component */
export type ScreenTrayWorkflowDecisionProps = {
  onPress: (decision: ConvexRuntimeAPIWorkflowDecisionProps) => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.38
 * @version 0.0.3
 * @param {ScreenTrayWorkflowDecisionProps} param0
 * @param {(decision: ConvexRuntimeAPIWorkflowDecisionProps) => void} param0.onPress - The function to call when a decision is pressed
 * @component */
const ScreenTrayWorkflowDecision = ({
  onPress,
}: ScreenTrayWorkflowDecisionProps) => {
  return (
    <TrayContainer 
      title={"i18n.screens.trayWorkflowDecision.title"} 
      description={"i18n.screens.trayWorkflowDecisions.description"}>
        <ListWorkflowDecision
          showListGroup={false}
          onPress={onPress} />
    </TrayContainer>
  );
};

export default ScreenTrayWorkflowDecision;