import { View } from "react-native";

import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { STYLES } from "@codemize/constants/Styles";
import { ConvexRuntimeAPIWorkflowDecisionProps } from "@codemize/backend/Types";

import Divider from "@/components/container/Divider";
import TrayHeader from "@/components/container/TrayHeader";
import ListWorkflowDecision from "@/screens/private/modal/configuration/workflow/lists/ListWorkflowDecision";

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
 * @version 0.0.2
 * @param {ScreenTrayWorkflowDecisionProps} param0
 * @param {(decision: ConvexRuntimeAPIWorkflowDecisionProps) => void} param0.onPress - The function to call when a decision is pressed
 * @component */
const ScreenTrayWorkflowDecision = ({
  onPress,
}: ScreenTrayWorkflowDecisionProps) => {
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
        <ListWorkflowDecision
          showListGroup={false}
          onPress={onPress} />
      </View>
    </View>
  );
};

export default ScreenTrayWorkflowDecision;