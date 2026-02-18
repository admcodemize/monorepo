import React from "react";
import { TextInput, View } from "react-native";
import { t } from "i18next";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

import { FAMILIY, SIZES } from "@codemize/constants/Fonts";
import { STYLES } from "@codemize/constants/Styles";

import { useDropdown } from "@/hooks/button/useDropdown";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { DROPDOWN_DURATION_ITEMS } from "@/constants/Models";

import { ListItemDropdownProps } from "@/components/lists/item/ListItemDropdown";
import TextBase from "@/components/typography/Text";
import ListDropdown from "@/components/lists/ListDropdown";
import TouchableHapticDropdown from "@/components/button/TouchableHapticDropdown";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalWorkflowStyle from "@/styles/GlobalWorkflow";
import TouchableHaptic from "../TouchableHaptic";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import TouchableHapticSwitch from "../TouchableHapticSwitch";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.62
 * @version 0.0.1
 * @enum */
export enum TouchableHapticAddItemTypeEnum {
  SWITCH = "switch",
  BUTTON = "button",
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.62
 * @version 0.0.1
 * @type */
export type TouchableHapticAddItemType = "switch" | "button";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.61
 * @version 0.0.1
 * @type */
export type TouchableHapticAddItemProps = {
  text: string;
  icon: IconProp;
  type?: TouchableHapticAddItemType;
  state?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  onStateChange?: (state: boolean) => void;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns a touchable (opacity) button with included haptic gesture -> Only for platform iOs/android
 * @since 0.0.61
 * @version 0.0.1
 * @param {TouchableHapticAddItemProps} param0 
 * @param {string} param0.text - The text of the button
 * @param {IconProp} param0.icon - The icon of the button
 * @param {Function} param0.onPress - Callback function when user pressed the button
 * @param {boolean} param0.disabled - Whether the button is disabled
 * @component */
const TouchableHapticAddItem = ({
  text = "Geschäfts-/Privatadresse hinzufügen",
  icon,
  type = TouchableHapticAddItemTypeEnum.BUTTON,
  state,
  disabled = false,
  onPress = () => {},
  onStateChange = () => {},
}: TouchableHapticAddItemProps) => {
  const { secondaryBgColor, infoColor, linkColor } = useThemeColors();
  const [stateInternal, setStateInternal] = React.useState<boolean>(state ?? false);
  
  /**
   * @description Used to change the state of the switch
   * @param {boolean} state - The new state of the switch
   * @function */
  const onStateChangeInternal = 
  (state: boolean) => {
    setStateInternal(state);
    onStateChange?.(state);
  };

  return (
    <View
      style={[GlobalContainerStyle.rowCenterBetween, GlobalWorkflowStyle.touchableParent, {
        backgroundColor: secondaryBgColor,
      }]}>
      <View style={[GlobalContainerStyle.rowCenterStart, { gap: STYLES.sizeGap }]}>
        <FontAwesomeIcon 
          icon={icon} 
          size={STYLES.sizeFaIcon} />
        <TextBase
          text={text} 
          style={{ color: infoColor }} />
      </View>
      <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 12 }]}>
        {type === TouchableHapticAddItemTypeEnum.BUTTON && <TouchableHaptic 
          onPress={onPress}
          disabled={disabled}>
          <FontAwesomeIcon
              icon={faPlus as IconProp}
              size={STYLES.sizeFaIcon}
              color={linkColor} />
        </TouchableHaptic>}
        {type === TouchableHapticAddItemTypeEnum.SWITCH && <TouchableHapticSwitch
          state={stateInternal}
          onStateChange={onStateChangeInternal} />}
      </View>
    </View>
  );
};

export default TouchableHapticAddItem;