import React from "react";
import { View, ViewStyle } from "react-native";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCheck, faXmark } from "@fortawesome/pro-solid-svg-icons";

import { shadeColor } from "@codemize/helpers/Colors";

import TextBase, { TextBaseTypes } from "@/components/typography/Text";
import TouchableHaptic from "@/components/button/TouchableHaptic";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalTypographyStyle from "@/styles/GlobalTypography";
import TouchableTagStyle from "@/styles/components/button/TouchableTag";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.18
 * @version 0.0.4
 * @type */
export type TouchableTagProps = {
  icon?: IconProp;
  text: string;
  type?: TextBaseTypes;
  backgroundColor?: string;
  colorActive?: string;
  colorInactive?: string;
  isActive?: boolean;
  disabled?: boolean;
  showActivityIcon?: boolean;
  activityIconActive?: IconProp;
  activityIconInactive?: IconProp;
  viewStyle?: ViewStyle|ViewStyle[];
  onPress?: (isActive: boolean) => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.18
 * @version 0.0.3
 * @param {TouchableTagProps} param0 
 * @param {IconProp} param0.icon - The icon to display
 * @param {string} param0.text - The text to display
 * @param {TextBaseTypes} param0.type - The type of the text
 * @param {string} param0.backgroundColor - The background color of the TouchableTag -> Custom specific background color
 * @param {string} param0.colorActive - The color of the TouchableTag when active
 * @param {string} param0.colorInactive - The color of the TouchableTag when inactive
 * @param {boolean} param0.isActive - The active state of the TouchableTag
 * @param {boolean} param0.showActivityIcon - The visibility of the activity icon on the right side 
 * @param {IconProp} param0.activityIconActive - The icon to display when the TouchableTag is active
 * @param {IconProp} param0.activityIconInactive - The icon to display when the TouchableTag is inactive
 * @param {ViewStyle|ViewStyle[]} param0.viewStyle - The style to apply to the TouchableTag component
 * @param {boolean} param0.disabled - The disabled state of the TouchableTag
 * @param {Function} param0.onPress - The function to call when the TouchableTag is pressed
 * @component */
const TouchableTag = ({
  icon,
  text,
  type = "label",
  colorActive = "#159F85",
  colorInactive = "#ababab",
  backgroundColor,
  disabled = false,
  isActive = false,
  showActivityIcon = false,
  activityIconActive = faXmark as IconProp,
  activityIconInactive = faCheck as IconProp,
  viewStyle,
  onPress = () => {}
}: TouchableTagProps) => {
  const [_isActive, _setIsActive] = React.useState<boolean>(isActive);

  /** @description Handles the change of the active state of the TouchableTag */
  const onActiveChange = React.useCallback((nextIsActive: boolean) => {
    _setIsActive(nextIsActive);
  }, [_setIsActive]);

  /** @description Handles the onPress event of the TouchableTag -> Changes the state and background color of the TouchableTag */
  const onPressInternal = React.useCallback(() => {
    onActiveChange(!_isActive);
    onPress?.(!_isActive);
  }, [_isActive, onActiveChange, onPress]);

  return (
    <TouchableHaptic
      disabled={disabled}
      opacityDisabled={1}
      onPress={onPressInternal}>
        <View style={[GlobalContainerStyle.rowCenterStart, TouchableTagStyle.view, ...(viewStyle ? [viewStyle] : []), {
          backgroundColor: shadeColor(backgroundColor ? backgroundColor : _isActive ? colorActive : colorInactive, 0.8),
        }]}>
          {icon && <FontAwesomeIcon
            icon={icon} 
            size={12} 
            color={shadeColor(backgroundColor ? backgroundColor : _isActive ? colorActive : colorInactive, -0.1)} />}
          <TextBase
            text={text} 
            type={type} 
            style={[GlobalTypographyStyle.labelText, { color: shadeColor(backgroundColor ? backgroundColor : _isActive ? colorActive : colorInactive, -0.1) }]} />
          {showActivityIcon && 
            <FontAwesomeIcon
              icon={_isActive ? activityIconActive : activityIconInactive}
              size={10}
              color={shadeColor(backgroundColor ? backgroundColor : _isActive ? colorActive : colorInactive, -0.1)} />}
        </View>
    </TouchableHaptic>
  )
}

export default TouchableTag;