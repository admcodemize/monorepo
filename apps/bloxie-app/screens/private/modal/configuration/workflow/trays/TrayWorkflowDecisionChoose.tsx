import ListItemGroup from "@/components/container/ListItemGroup";
import TrayContainer from "@/components/container/TrayContainer";
import ListItemWithChildren from "@/components/lists/item/ListItemWithChildren";
import { TRAY_ACTION_ITEMS, TRAY_CONFIGURATION_ITEMS } from "@/constants/Models";
import { STYLES } from "@codemize/constants/Styles";

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
  return (
    <TrayContainer 
      title={"i18n.screens.trayWorkflowDecisionChoose.title"} 
      description={"i18n.screens.trayWorkflowDecisionChoose.description"}>
        <ListItemGroup
          title={"i18n.screens.trayAction.groups.manage"}
          gap={STYLES.sizeGap * 1.5}>
          {TRAY_ACTION_ITEMS.map((item) => (
            <ListItemWithChildren
              key={item.key}
              icon={item.icon} 
              title={item.title} 
              description={item.description} />
          ))}
        </ListItemGroup>
        <ListItemGroup 
          title={"i18n.screens.trayAction.groups.configuration"}
          gap={STYLES.sizeGap * 1.5}>
            {TRAY_CONFIGURATION_ITEMS.map((item) => (
              <ListItemWithChildren
                key={item.key}
                icon={item.icon} 
                title={item.title} 
                description={item.description} />
            ))}
        </ListItemGroup>
    </TrayContainer>
  );
};

export default ScreenTrayWorkflowDecisionChoose;