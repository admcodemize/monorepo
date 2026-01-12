import { ConvexTemplateAPIProps } from "@codemize/backend/Types";

import ListWorkflowTemplate from "@/screens/private/modal/configuration/workflow/lists/ListWorkflowTemplate";
import TrayContainer from "@/components/container/TrayContainer";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.46
 * @version 0.0.1
 * @component */
export type ScreenTrayWorkflowEventTypeProps = {
  onPress: () => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.46
 * @version 0.0.1
 * @param {ScreenTrayWorkflowEventTypeProps} param0
 * @param {(template: ConvexTemplateAPIProps) => void} param0.onPress - The function to call when a template is pressed
 * @component */
const ScreenTrayWorkflowEventType = ({
  onPress,
}: ScreenTrayWorkflowEventTypeProps) => {
  return (
    <TrayContainer 
      title={"i18n.screens.trayWorkflowEventType.title"} 
      description={"i18n.screens.trayWorkflowEventType.description"}>

    </TrayContainer>
  );
};

export default ScreenTrayWorkflowEventType;