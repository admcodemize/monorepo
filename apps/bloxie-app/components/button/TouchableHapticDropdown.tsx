import React from "react";
import { GestureResponderEvent, TextStyle, View, ViewStyle } from "react-native";

import { faAngleDown, faAngleUp } from "@fortawesome/duotone-thin-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { STYLES } from "@codemize/constants/Styles";

import { useThemeColors } from "@/hooks/theme/useThemeColor";

import TouchableHaptic, { TouchableHapticProps } from "@/components/button/TouchableHaptic";
import TextBase, { TextBaseTypes } from "@/components/typography/Text";


import GlobalButtonStyle from "@/styles/GlobalButton";
import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalTypographyStyle from "@/styles/GlobalTypography";

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.2
 * @type */
type TouchableHapticDropdownProps = TouchableHapticProps & {
  text: string;
  icon?: IconProp;
  type?: TextBaseTypes;
  i18nTranslation?: boolean;
  backgroundColor?: string;
  hasViewCustomStyle?: boolean;
  viewCustomStyle?: ViewStyle;
  textCustomStyle?: TextStyle;
  hasAngleChange?: boolean;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns a touchable (opacity) button with included haptic gesture -> Only for platform iOs/android
 * @since 0.0.2
 * @version 0.0.3
 * @param {Object} param0 - Handles the touchable haptic events and styling
 * @param {Function} param0.onPress - Callback function when user pressed the button
 * @param {Function} param0.onLongPress - Callback function when user long presses the button
 * @param {Function} param0.onLayout - Callback function invoked on mount and layout changes 
 * @param {StyleProp<ViewStyle>} param0.style - Extended custom styling
 * @param {boolean} param0.disabled - Handles the inactivity of the rendered button
 * @param {number|Insets|null|undefined} param0.hitSlop - Handles the hit slop of the rendered button. 
 * -> A hit slop is a property that allows you to set the area around the button that will trigger the onPress event.
 * @param {boolean} param0.hideNotificationBadge - Handles the visibility of the notification badge
 * @param {boolean} param0.i18nTranslation - Handles the translation of the text
 * @param {string} param0.backgroundColor - Handles the background color of the rendered button
 * @param {boolean} param0.hasViewCustomStyle - Handles the custom styling of the rendered button
 * @param {ViewStyle} param0.viewCustomStyle - Custom styling for the view
 * @param {StyleProp<TextStyle>} param0.textCustomStyle - Custom styling for the text
 * @param {boolean} param0.hasAngleChange - Handles the angle change of the icon when pressed
 * @param {IconProp} param0.icon - Icon to display on the left side
 * @param {string} param0.text - Text to display after the icon (when visible)
 * @param {TextBaseTypes} param0.type - Text type used for styling */
const TouchableHapticDropdown = React.forwardRef<View, TouchableHapticDropdownProps>(({ 
  onPress = () => {}, 
  onLongPress = () => {}, 
  onLayout = () => {},
  style, 
  disabled, 
  hitSlop = 10,
  hideNotificationBadge = true,
  i18nTranslation = true,
  backgroundColor,
  hasViewCustomStyle = false,
  viewCustomStyle,
  textCustomStyle,
  hasAngleChange = false,
  text,
  icon,
  type = "text"
}, ref) => {
  const colors = useThemeColors();

  /** @description Handles the angle change of the icon when pressed */
  const [iconAngle, setIconAngle] = React.useState<IconProp>(faAngleDown as IconProp);

  /** @description Handles the press event of the dropdown */
  const onPressInternal = React.useCallback(
    (e: GestureResponderEvent) => {
      hasAngleChange && setIconAngle(iconAngle === faAngleDown ? faAngleUp as IconProp : faAngleDown as IconProp);
      onPress(e);
    }, [onPress, iconAngle, hasAngleChange]);

  return (
    <TouchableHaptic
      ref={ref}
      onPress={onPressInternal}
      onLongPress={onLongPress}
      onLayout={onLayout}
      style={style}
      disabled={disabled}
      hitSlop={hitSlop}
      hideNotificationBadge={hideNotificationBadge}>
        <View style={hasViewCustomStyle ? viewCustomStyle : [
          GlobalContainerStyle.rowCenterBetween,
          GlobalButtonStyle.spacing, 
          GlobalButtonStyle.defaultSize,  
          GlobalButtonStyle.border, {
            gap: STYLES.sizeGap - 2,
            height: STYLES.sizeTouchable,
            backgroundColor: backgroundColor ? backgroundColor : colors.secondaryBgColor,
            borderColor: colors.primaryBorderColor
        }]}>
          <View style={[GlobalContainerStyle.rowCenterStart, { gap: STYLES.sizeGap - 2 }]}>
            {icon && <FontAwesomeIcon
              icon={icon as IconProp}
              size={STYLES.sizeFaIcon}
              color={colors.primaryIconColor} />}
            <TextBase 
              text={text}
              i18nTranslation={i18nTranslation}
              type={type}
              style={[GlobalTypographyStyle.titleSubtitle, { color: colors.infoColor }, textCustomStyle]} />
          </View>
          <FontAwesomeIcon
            icon={iconAngle}
            size={STYLES.sizeFaIcon - 4}
            color={colors.primaryIconColor} />
        </View>
    </TouchableHaptic>
  )
})

export default TouchableHapticDropdown;