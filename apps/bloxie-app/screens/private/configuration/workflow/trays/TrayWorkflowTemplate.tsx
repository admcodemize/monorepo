import { ConvexTemplateAPIProps } from "@codemize/backend/Types";

import ListWorkflowTemplate from "@/screens/private/configuration/workflow/lists/ListWorkflowTemplate";
import TrayContainer from "@/components/container/TrayContainer";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.38
 * @version 0.0.2
 * @component */
export type ScreenTrayWorkflowTemplateProps = {
  onPress: (template: ConvexTemplateAPIProps) => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.38
 * @version 0.0.2
 * @param {ScreenTrayWorkflowTemplateProps} param0
 * @param {(template: ConvexTemplateAPIProps) => void} param0.onPress - The function to call when a template is pressed
 * @component */
const ScreenTrayWorkflowTemplate = ({
  onPress,
}: ScreenTrayWorkflowTemplateProps) => {
  return (
    <TrayContainer 
      title={"i18n.screens.trayWorkflowActionTemplates.title"} 
      description={"i18n.screens.trayWorkflowActionTemplates.description"}>
        <ListWorkflowTemplate
          showListGroup={false}
          onPress={onPress} />
    </TrayContainer>
  );
};

export default ScreenTrayWorkflowTemplate;