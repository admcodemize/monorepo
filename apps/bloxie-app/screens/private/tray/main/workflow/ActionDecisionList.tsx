import { View } from "react-native";

import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { STYLES } from "@codemize/constants/Styles";
import { ConvexRuntimeAPIWorkflowDecisionProps } from "@codemize/backend/Types";

import Divider from "@/components/container/Divider";
import TrayHeader from "@/components/container/TrayHeader";
import ListTemplatesWorkflowDecision from "@/components/lists/ListTemplatesWorkflowDecision";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.38
 * @version 0.0.2
 * @component */
export type ScreenTrayDecisionTemplateListProps = {
  onPress: (decision: ConvexRuntimeAPIWorkflowDecisionProps) => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.38
 * @version 0.0.1
 * @param {ScreenTrayDecisionTemplateListProps} param0
 * @param {(decision: ConvexRuntimeAPIWorkflowDecisionProps) => void} param0.onPress - The function to call when a decision is pressed
 * @component */
const ScreenTrayDecisionTemplateList = ({
  onPress,
}: ScreenTrayDecisionTemplateListProps) => {
  const { primaryBgColor, primaryBorderColor } = useThemeColors();
  return (
    <View style={{ 
      padding: STYLES.paddingHorizontal, 
      backgroundColor: primaryBgColor, 
      borderColor: primaryBorderColor,
    }}>
      <View style={{ gap: STYLES.sizeGap }}>
        <TrayHeader
          title={"i18n.screens.trayWorkflowDecisions.title"}
          description={"i18n.screens.trayWorkflowDecisions.description"} />
        <Divider />
        <ListTemplatesWorkflowDecision
          showListGroup={false}
          onPress={onPress} />
      </View>
    </View>
  );
};

export default ScreenTrayDecisionTemplateList;