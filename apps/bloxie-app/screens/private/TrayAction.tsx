import React from "react";
import { View, Linking } from "react-native";
import { router } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faArrowUpRightFromSquare } from "@fortawesome/duotone-thin-svg-icons";
import { STYLES } from "@codemize/constants/Styles";

import { TRAY_ACCOUNT_ITEMS, TRAY_ACTION_ITEMS, TRAY_CONFIGURATION_ITEMS } from "@/constants/Models";
import { useThemeColors } from "@/hooks/theme/useThemeColor";

import TouchableHaptic from "@/components/button/TouchableHaptic";
import ListItemGroup from "@/components/container/ListItemGroup";
import TrayContainer from "@/components/container/TrayContainer";
import ListItemWithChildren, { ListItemWithChildrenTypeEnum } from "@/components/lists/item/ListItemWithChildren";

import GlobalContainerStyle from "@/styles/GlobalContainer";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.4
 * @component */
const ScreenTrayAction = () => {
  /** @description Used to get the theme based colors */
  const { primaryIconColor } = useThemeColors();

  return (
    <TrayContainer title={"i18n.screens.trayAction.title"}>
      <View style={{ gap: STYLES.sizeGap * 2 }}>
        <ListItemGroup 
          title={"i18n.screens.trayAction.groups.manage"}
          gap={STYLES.sizeGap * 1.5}>
          {TRAY_ACTION_ITEMS.map((item) => (
            <ScreenTrayActionItemChildren 
              key={item.key}
              route={`/action/${item.route}`}
              icon={item.icon} 
              title={item.title} 
              description={item.description}
              isComingSoon={item.isComingSoon} />
          ))}
        </ListItemGroup>
        <ListItemGroup 
          title={"i18n.screens.trayAction.groups.configuration"}
          gap={STYLES.sizeGap * 1.5}>
            {TRAY_CONFIGURATION_ITEMS.map((item) => (
              <ScreenTrayActionItemChildren 
                key={item.key}
                route={item.route ? `/configuration/${item.route}` : undefined}
                icon={item.icon} 
                title={item.title} 
                description={item.description}
                isComingSoon={item.isComingSoon}
                right={item.key === "bookingPage" ? <FontAwesomeIcon
                  icon={faArrowUpRightFromSquare as IconProp}
                  size={STYLES.sizeFaIcon}
                  color={primaryIconColor} /> : undefined}
                onPress={() => item.key === "bookingPage" && Linking.openURL("https://bloxie.ch/mstoeckli7/")} />
            ))}
        </ListItemGroup>
        <ListItemGroup 
          title={"i18n.screens.trayAction.groups.account"}
          gap={STYLES.sizeGap * 1.5}>
            {TRAY_ACCOUNT_ITEMS.map((item) => (
              <ScreenTrayActionItemChildren 
                key={item.key}
                route={`/account/${item.route}`}
                icon={item.icon} 
                title={item.title} 
                description={item.description} />
            ))}
        </ListItemGroup>
      </View>
    </TrayContainer>
  );
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.2
 * @type */
type ScreenTrayActionItemChildrenProps = {
  route?: string;
  icon: IconProp;
  title: string;
  description: string;
  right?: React.ReactNode;
  isComingSoon?: boolean;
  onPress?: () => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.3
 * @param {ScreenTrayActionItemChildrenProps} param0
 * @param {string} param0.route - The route to navigate to
 * @param {IconProp} param0.icon - The icon to display
 * @param {string} param0.title - The title of the list item
 * @param {string} param0.description - The description of the list item
 * @param {React.ReactNode} param0.right - The right component to display on the right side of the list item
 * @param {boolean} param0.isComingSoon - Whether the list item is coming soon
 * @param {() => void} param0.onPress - The function to call when the list item is pressed and no route is provided
 * @component */
const ScreenTrayActionItemChildren = ({
  route,
  icon,
  title,
  description,
  right,
  isComingSoon = false,
  onPress
}: ScreenTrayActionItemChildrenProps) => {
  console.log("route", route);
  /**
   * @description Handles the on press event for the list item
   * @function */
  const onPressInternal = () => !route
    ? onPress?.()
    : route && router.push(`/(private)/(modal)${route}`);

  return (
    <TouchableHaptic
      disabled={isComingSoon}
      onPress={onPressInternal}>
        <View style={[GlobalContainerStyle.columnStartStart]}>
          <ListItemWithChildren
            icon={icon} 
            title={title} 
            description={description}
            type={ListItemWithChildrenTypeEnum.custom}
            isComingSoon={isComingSoon}
            right={right} />
        </View>
    </TouchableHaptic>
  );
};

export default ScreenTrayAction;