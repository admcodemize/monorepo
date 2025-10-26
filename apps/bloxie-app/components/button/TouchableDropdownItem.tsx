import React, { PropsWithChildren } from "react";
import { GestureResponderEvent, ViewStyle } from "react-native";

import { STYLES } from "@codemize/constants/Styles";

import { useDropdown } from "@/hooks/button/useDropdown";
import { useThemeColors } from "@/hooks/theme/useThemeColor";

import TouchableHaptic from "@/components/button/TouchableHaptic";

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
type DropdownItemProps = PropsWithChildren & {
  itemKey: string|number;
  isSelected?: boolean;
  onPress: (key: string|number) => void;
  style?: ViewStyle;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns a positioned dropdown based on parent component
 * @since 0.0.2
 * @version 0.0.1
 * @param {Object} param0 
 * @param {string|number} param0.itemKey - The key of the dropdown item
 * @param {boolean} param0.isSelected - Handles the selected state of the dropdown item
 * @param {boolean} param0.onPress - Callback function called when user has clicked an item
 * @param {ViewStyle} param0.style - Custom dropdown style */
const TouchableDropdownItem = ({ 
  itemKey,
  isSelected = false,
  onPress,
  style,
  children,
}: DropdownItemProps) => {  
  const colors = useThemeColors();

  /**
   * @description Get the dropdown functions for closing after .
   * @see {@link hooks/container/useDropdown} */
  const { close } = useDropdown();

  /**
   * @description Used to handle the press event of the dropdown item
   * @param {string|number} itemKey - The key of the dropdown item
   * @function */
  const onPressInternal = React.useCallback(
    (itemKey: string|number) =>
    (e: GestureResponderEvent) => {
      onPress(itemKey);
      close();
    }, [onPress, close]);

  return (
    <TouchableHaptic
      onPress={onPressInternal(itemKey)}
      style={[{
        padding: STYLES.paddingVertical - 2,
        backgroundColor: isSelected ? colors.focusedBgColor : undefined,
        borderRadius: 6,
        ...style
      }]}>
        {children}
    </TouchableHaptic>
  )
}

export default TouchableDropdownItem;