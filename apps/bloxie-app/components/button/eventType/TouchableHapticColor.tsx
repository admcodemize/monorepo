import React from "react";
import { View } from "react-native";
import { t } from "i18next";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faBrush, faCheck } from "@fortawesome/pro-thin-svg-icons";

import { STYLES } from "@codemize/constants/Styles";

import { useThemeColors } from "@/hooks/theme/useThemeColor";

import { ListItemDropdownProps } from "@/components/lists/item/ListItemDropdown";
import TextBase from "@/components/typography/Text";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalWorkflowStyle from "@/styles/GlobalWorkflow";
import { faSquare } from "@fortawesome/pro-solid-svg-icons";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.58
 * @version 0.0.1
 * @type */
export type TouchableHapticColorProps = {
  onPress: (item: ListItemDropdownProps) => void;
  onChangeValue: (value: string) => void;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns a touchable (opacity) button with included haptic gesture -> Only for platform iOs/android
 * @since 0.0.58
 * @version 0.0.1
 * @param {TouchableHapticColorProps} param0 
 * @param {Function} param0.onPress - Callback function when user pressed the button
 * @component */
const TouchableHapticColor = ({
  onPress,
  onChangeValue,
}: TouchableHapticColorProps) => {
  const { secondaryBgColor, errorColor, infoColor } = useThemeColors();

  return (
    <View
      style={[GlobalContainerStyle.rowCenterBetween, GlobalWorkflowStyle.touchableParent, {
        backgroundColor: secondaryBgColor
      }]}>
      <View style={[GlobalContainerStyle.rowCenterStart, { gap: STYLES.sizeGap }]}>
        <FontAwesomeIcon 
          icon={faBrush as IconProp} 
          size={STYLES.sizeFaIcon} />
        <TextBase
          text={t("Farbliche Hervorhebung")} 
          style={{ color: infoColor }} />
      </View>
      <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 12 }]}>
        <FontAwesomeIcon 
          icon={faSquare as IconProp} 
          color={errorColor}
          size={STYLES.sizeFaIcon} />
      </View>
    </View>
  );
};

export default TouchableHapticColor;