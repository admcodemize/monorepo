
import { View } from "react-native";

import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { useIntegrationContextStore } from "@/context/IntegrationContext";
import { STYLES } from "@codemize/constants/Styles";
import { ConvexWorkflowAPIDecisionTypeEnum } from "@codemize/backend/Types";

import ListItemGroup from "@/components/container/ListItemGroup";
import TrayContainer from "@/components/container/TrayContainer";
import TouchableTag from "@/components/button/TouchableTag";
import GlobalContainerStyle from "@/styles/GlobalContainer";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.52
 * @version 0.0.2
 * @component */
export type ScreenTrayWorkflowDecisionChooseProps = {
  type: ConvexWorkflowAPIDecisionTypeEnum;
  selectedKeys: string[];
  onPress: () => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.52
 * @version 0.0.2
 * @param {ScreenTrayWorkflowDecisionChooseProps} param0
 * @param {() => void} param0.onPress - The function to call when the decision is chosen
 * @param {ConvexWorkflowAPIDecisionTypeEnum} param0.type - The type of the decision for which the choice is made
 * @component */
const ScreenTrayWorkflowDecisionChoose = ({
  type,
  selectedKeys,
  onPress,
}: ScreenTrayWorkflowDecisionChooseProps) => {
  const { linkColor } = useThemeColors();


  const integrations = useIntegrationContextStore((state) => state.integrations);

  return (
    <TrayContainer 
      title={"i18n.screens.trayWorkflowDecision.choose.title"} 
      description={type === "eventType" 
        ? "i18n.screens.trayWorkflowDecision.eventType.title" 
        : "i18n.screens.trayWorkflowDecision.calendarConnection.title"}>
        {integrations.map((integration, idx) => (
          <ListItemGroup
            key={integration._id}
            title={integration.email}
            gap={STYLES.sizeGap}
            style={{ paddingBottom: idx === integrations.length - 1 ? 0 : STYLES.sizeGap * 1.75 }}>
              <View style={[GlobalContainerStyle.rowCenterStart, { flexWrap: "wrap", gap: 4 }]}>
                {integration.calendars?.map((calendar) => (
                  <TouchableTag
                    key={calendar._id}
                    text={calendar.description}
                    colorActive={linkColor}
                    isActive={selectedKeys.includes(calendar._id as string)} />
                ))}
              </View>
          </ListItemGroup>
        ))}
    </TrayContainer>
  );
};

export default ScreenTrayWorkflowDecisionChoose;