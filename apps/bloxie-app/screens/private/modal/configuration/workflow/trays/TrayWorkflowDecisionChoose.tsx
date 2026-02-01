import TouchableHapticSwitch from "@/components/button/TouchableHapticSwitch";
import ListItemGroup from "@/components/container/ListItemGroup";
import TrayContainer from "@/components/container/TrayContainer";
import ListItemWithChildren, { ListItemWithChildrenTypeEnum } from "@/components/lists/item/ListItemWithChildren";
import { TRAY_ACTION_ITEMS, TRAY_CONFIGURATION_ITEMS } from "@/constants/Models";
import { useConfigurationContextStore } from "@/context/ConfigurationContext";
import { useIntegrationContextStore } from "@/context/IntegrationContext";
import { STYLES } from "@codemize/constants/Styles";
import { faClouds } from "@fortawesome/duotone-thin-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { View } from "react-native";
import { PNG_ASSETS } from "@/assets/png";
import { SIZES } from "@codemize/constants/Fonts";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.52
 * @version 0.0.1
 * @component */
export type ScreenTrayWorkflowDecisionChooseProps = {
  onPress: () => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.52
 * @version 0.0.1
 * @param {ScreenTrayWorkflowDecisionChooseProps} param0
 * @param {() => void} param0.onPress - The function to call when the decision is chosen
 * @component */
const ScreenTrayWorkflowDecisionChoose = ({
  onPress,
}: ScreenTrayWorkflowDecisionChooseProps) => {
  const integrations = useIntegrationContextStore((state) => state.integrations);

  console.log(integrations);

  return (
    <TrayContainer 
      title={"i18n.screens.trayWorkflowDecisionChoose.title"} 
      description={"i18n.screens.trayWorkflowDecisionChoose.description"}>
          {integrations.map((integration) => (
            <ListItemGroup
              key={integration._id}
              title={integration.email}
              gap={STYLES.sizeGap}
              style={{ paddingBottom: STYLES.sizeGap * 2 }}>
                {integration.calendars?.map((calendar) => {
                  console.log(calendar)
                  return (
                  <ListItemWithChildren
                    key={calendar._id}
                    title={calendar.description} 
                    description={calendar.accessRole === "reader" ? "" : "Administrator / Anzahl Termine: " + calendar.eventsCount} 
                    descriptionNumberOfLines={1}
                    styleDescriptionComponent={[{ fontSize: Number(SIZES.label) - 1 }]}
                    image={PNG_ASSETS.googleCalendar}
                    imageWidth={STYLES.sizeFaIcon + 10}
                    imageHeight={STYLES.sizeFaIcon + 14}
                    type={ListItemWithChildrenTypeEnum.custom}
                    right={
                      <TouchableHapticSwitch
                        state={calendar.accessRole === "reader"}
                        onStateChange={(value) => {
                          console.log(value)
                        }} />
                    } />
                  )})}
            </ListItemGroup>
          ))}
    </TrayContainer>
  );
};

export default ScreenTrayWorkflowDecisionChoose;