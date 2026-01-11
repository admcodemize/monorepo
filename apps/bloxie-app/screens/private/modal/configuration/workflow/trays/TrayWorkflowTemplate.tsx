import { View } from "react-native";

import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { STYLES } from "@codemize/constants/Styles";
import { ConvexTemplateAPIProps } from "@codemize/backend/Types";

import Divider from "@/components/container/Divider";
import TrayHeader from "@/components/container/TrayHeader";
import ListWorkflowTemplate from "@/screens/private/modal/configuration/workflow/lists/ListWorkflowTemplate";
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
  const { primaryBgColor, primaryBorderColor } = useThemeColors();
  return (
    /*<View style={{ 
      padding: STYLES.paddingHorizontal, 
      backgroundColor: primaryBgColor, 
      borderColor: primaryBorderColor,
    }}>
      <View style={{ gap: STYLES.sizeGap + 4 }}>
        <TrayHeader
          title={"i18n.screens.trayWorkflowActionTemplates.title"}
          description={"i18n.screens.trayWorkflowActionTemplates.description"} />
        <Divider />
        <ListWorkflowTemplate
          showListGroup={false}
          onPress={onPress} />
      </View>
    </View>*/
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