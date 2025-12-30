import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faArrowUpRightFromSquare } from "@fortawesome/duotone-thin-svg-icons";
import { STYLES } from "@codemize/constants/Styles";

import { TRAY_ACCOUNT_ITEMS, TRAY_ACTION_ITEMS, TRAY_CONFIGURATION_ITEMS } from "@/constants/Models";
import { useThemeColors } from "@/hooks/theme/useThemeColor";

import TouchableHaptic from "@/components/button/TouchableHaptic";
import Divider from "@/components/container/Divider";
import ListItemGroup from "@/components/container/ListItemGroup";
import TrayHeader from "@/components/container/TrayHeader";
import ListItemWithChildren, { ListItemWithChildrenTypeEnum } from "@/components/lists/item/ListItemWithChildren";

import GlobalContainerStyle from "@/styles/GlobalContainer";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @component */
const ScreenTrayAction = () => {
  /** @description Used to get the theme based colors */
  const colors = useThemeColors();

  return (
    <View style={{ 
      padding: STYLES.paddingHorizontal, 
      backgroundColor: colors.primaryBgColor, 
      borderColor: colors.primaryBorderColor 
    }}>
      <View style={{ gap: STYLES.sizeGap }}>
        <TrayHeader
          title={"i18n.screens.trayAction.title"}
          description={"i18n.screens.trayAction.description"} />
        <Divider />
      </View>
      <View style={{ paddingVertical: STYLES.paddingVertical, gap: STYLES.sizeGap * 2 }}>
        <ListItemGroup 
          title={"i18n.screens.trayAction.groups.manage"}
          gap={STYLES.sizeGap * 1.75}>
          {TRAY_ACTION_ITEMS.map((item) => (
            <ScreenTrayActionItemChildren 
              key={item.key}
              route={`/action/${item.route}`}
              icon={item.icon} 
              title={item.title} 
              description={item.description} />
          ))}
        </ListItemGroup>
        <ListItemGroup 
          title={"i18n.screens.trayAction.groups.configuration"}
          gap={STYLES.sizeGap * 1.75}>
            {TRAY_CONFIGURATION_ITEMS.map((item) => (
              <ScreenTrayActionItemChildren 
                key={item.key}
                route={`/configuration/${item.route}`}
                icon={item.icon} 
                title={item.title} 
                description={item.description}
                isComingSoon={item.isComingSoon}
                right={item.key === "bookingPage" ? <FontAwesomeIcon
                  icon={faArrowUpRightFromSquare as IconProp}
                  size={STYLES.sizeFaIcon}
                  color={colors.primaryIconColor} /> : undefined} />
            ))}
        </ListItemGroup>
        <ListItemGroup 
          title={"i18n.screens.trayAction.groups.account"}
          gap={STYLES.sizeGap * 1.75}>
            {TRAY_ACCOUNT_ITEMS.map((item) => (
              <ScreenTrayActionItemChildren 
                key={item.key}
                route={`/account/${item.route}`}
                icon={item.icon} 
                title={item.title} 
                description={item.description}
                right={item.key === "bookingPage" ? <FontAwesomeIcon
                  icon={faArrowUpRightFromSquare as IconProp}
                  size={STYLES.sizeFaIcon}
                  color={colors.primaryIconColor} /> : undefined} />
            ))}
        </ListItemGroup>
      </View>
    </View>
  );
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
type ScreenTrayActionItemChildrenProps = {
  route?: string;
  icon: IconProp;
  title: string;
  description: string;
  right?: React.ReactNode;
  isComingSoon?: boolean;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.2
 * @param {ScreenTrayActionItemChildrenProps} param0
 * @param {string} param0.route - The route to navigate to
 * @param {IconProp} param0.icon - The icon to display
 * @param {string} param0.title - The title of the list item
 * @param {string} param0.description - The description of the list item
 * @param {React.ReactNode} param0.right - The right component to display on the right side of the list item
 * @component */
const ScreenTrayActionItemChildren = ({
  route,
  icon,
  title,
  description,
  right,
  isComingSoon = false
}: ScreenTrayActionItemChildrenProps) => {
  /**
   * @description Handles the on press event for the list item
   * @function */
  const onPress = () => route && router.push(`/(private)/(modal)${route}`);

  return (
    <TouchableHaptic
      disabled={isComingSoon}
      onPress={onPress}>
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