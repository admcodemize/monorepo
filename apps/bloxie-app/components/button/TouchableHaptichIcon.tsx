import React from "react";
import { View, ViewStyle } from "react-native";

import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { STYLES } from "@codemize/constants/Styles";

import { useThemeColors } from "@/hooks/theme/useThemeColor";

import TouchableHaptic, { TouchableHapticProps } from "@/components/button/TouchableHaptic";

import GlobalButtonStyle from "@/styles/GlobalButton";
import GlobalContainerStyle from "@/styles/GlobalContainer";

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.2
 * @type */
type TouchableHapticIconProps = TouchableHapticProps & {
  icon: IconProp;
  iconSize?: number;
  hideBorder?: boolean;
  backgroundColor?: string;
  iconColor?: string;
  styleView?: ViewStyle|ViewStyle[];
  hasViewCustomStyle?: boolean;
  viewCustomStyle?: ViewStyle;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns a touchable (opacity) button with included haptic gesture -> Only for platform iOs/android
 * @since 0.0.1
 * @version 0.0.4
 * @param {Object} param0 - Handles the touchable haptic events and styling
 * @param {Function} param0.onPress - Callback function when user pressed the button
 * @param {Function} param0.onLongPress - Callback function when user long presses the button
 * @param {Function} param0.onLayout - Callback function invoked on mount and layout changes 
 * @param {StyleProp<ViewStyle>} param0.style - Extended custom styling for the touchable haptic
 * @param {StyleProp<ViewStyle>} param0.styleView - Extended custom styling for the view
 * @param {boolean} param0.hasViewCustomStyle - Handles the custom styling of the rendered button
 * @param {ViewStyle} param0.viewCustomStyle - Custom styling for the view
 * @param {boolean} param0.disabled - Handles the inactivity of the rendered button
 * @param {number|Insets|null|undefined} param0.hitSlop - Handles the hit slop of the rendered button. 
 * -> A hit slop is a property that allows you to set the area around the button that will trigger the onPress event.
 * @param {boolean} param0.hideNotificationBadge - Handles the visibility of the notification badge
 * @param {boolean} param0.hideBorder - Handles the visibility of the border
 * @param {string} param0.backgroundColor - Handles the background color of the rendered button
 * @param {string} param0.iconColor - Handles the icon color of the rendered button
 * @param {IconProp} param0.icon - Fontawesome icon
 * @param {number} param0.iconSize - Fontawesome icon size */
const TouchableHapticIcon = React.forwardRef<View, TouchableHapticIconProps>(({ 
  onPress = () => {}, 
  onLongPress = () => {}, 
  onLayout = () => {},
  style, 
  styleView,
  hasViewCustomStyle = false,
  viewCustomStyle,
  disabled, 
  hitSlop = 10,
  hideNotificationBadge = true,
  hideBorder = false,
  backgroundColor,
  iconColor,
  icon,
  iconSize = STYLES.sizeFaIcon
}, ref) => {
  const colors = useThemeColors();

  return (
    <TouchableHaptic
      ref={ref}
      onPress={onPress}
      onLongPress={onLongPress}
      onLayout={onLayout}
      style={style}
      disabled={disabled}
      hitSlop={hitSlop}
      hideNotificationBadge={hideNotificationBadge}>
        <View style={hasViewCustomStyle ? viewCustomStyle : [GlobalButtonStyle.spacing, GlobalContainerStyle.columnCenterCenter, GlobalButtonStyle.border, {
          backgroundColor: backgroundColor ? backgroundColor : hideBorder ? colors.primaryBgColor : colors.secondaryBgColor,
          borderColor: colors.primaryBorderColor,
          borderWidth: hideBorder ? 0 : 1,
          height: STYLES.sizeTouchable,
          minWidth: STYLES.sizeTouchable,
        }, styleView]}>
          <FontAwesomeIcon
            icon={icon}
            size={iconSize}
            color={iconColor ? iconColor : colors.primaryIconColor} />
        </View>
    </TouchableHaptic>
  )
})

export default TouchableHapticIcon;