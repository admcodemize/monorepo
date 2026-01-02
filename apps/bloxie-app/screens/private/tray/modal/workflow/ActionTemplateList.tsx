import { View } from "react-native";

import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { STYLES } from "@codemize/constants/Styles";
import { ConvexTemplateAPIProps } from "@codemize/backend/Types";

import Divider from "@/components/container/Divider";
import TrayHeader from "@/components/container/TrayHeader";
import ListTemplatesWorkflowAction from "@/components/lists/ListTemplatesWorkflowAction";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.38
 * @version 0.0.1
 * @component */
export type ScreenTrayActionTemplateListProps = {
  onPress: (template: ConvexTemplateAPIProps) => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.38
 * @version 0.0.1
 * @param {ScreenTrayActionTemplateListProps} param0
 * @param {(template: ConvexTemplateAPIProps) => void} param0.onPress - The function to call when a template is pressed
 * @component */
const ScreenTrayActionTemplateList = ({
  onPress,
}: ScreenTrayActionTemplateListProps) => {
  const { primaryBgColor, primaryBorderColor } = useThemeColors();
  return (
    <View style={{ 
      padding: STYLES.paddingHorizontal, 
      backgroundColor: primaryBgColor, 
      borderColor: primaryBorderColor,
    }}>
      <View style={{ gap: STYLES.sizeGap }}>
        <TrayHeader
          title={"i18n.screens.trayWorkflowActionTemplates.title"}
          description={"i18n.screens.trayWorkflowActionTemplates.description"} />
        <Divider />
        <ListTemplatesWorkflowAction
          showListGroup={false}
          onPress={onPress} />
      </View>
    </View>
  );
};

export default ScreenTrayActionTemplateList;