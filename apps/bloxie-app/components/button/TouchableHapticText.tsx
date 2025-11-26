import React from "react";
import { TextStyle, View, ViewStyle } from "react-native";

import { useThemeColors } from "@/hooks/theme/useThemeColor";

import TouchableHaptic, { TouchableHapticProps } from "@/components/button/TouchableHaptic";
import TextBase, { TextBaseTypes } from "@/components/typography/Text";

import RootHeaderStyle from "@/styles/components/layout/header/private/RootHeader";
import GlobalButtonStyle from "@/styles/GlobalButton";
import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalTypographyStyle from "@/styles/GlobalTypography";

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.2
 * @type */
type TouchableHapticTextProps = TouchableHapticProps & {
  text: string;
  type?: TextBaseTypes;
  i18nTranslation?: boolean;
  hasViewCustomStyle?: boolean;
  viewCustomStyle?: ViewStyle;
  textCustomStyle?: TextStyle;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns a touchable (opacity) button with included haptic gesture -> Only for platform iOs/android
 * @since 0.0.1
 * @version 0.0.2
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
 * @param {boolean} param0.hasViewCustomStyle - Handles the custom styling of the rendered button
 * @param {ViewStyle} param0.viewCustomStyle - Custom styling for the view
 * @param {StyleProp<TextStyle>} param0.textCustomStyle - Custom styling for the text
 * @param {string} param0.text - Text to display
 * @param {TextBaseTypes} param0.type - Text type used for styling */
const TouchableHapticText = React.forwardRef<View, TouchableHapticTextProps>(({ 
  onPress = () => {}, 
  onLongPress = () => {}, 
  onLayout = () => {},
  style, 
  hasViewCustomStyle = false,
  viewCustomStyle,
  textCustomStyle,
  disabled, 
  hitSlop = 10,
  hideNotificationBadge = true,
  i18nTranslation = true,
  text,
  type = "text"
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
        <View style={hasViewCustomStyle ? viewCustomStyle : [GlobalButtonStyle.spacing, GlobalContainerStyle.columnCenterCenter, GlobalButtonStyle.border, RootHeaderStyle.router, {
          backgroundColor: colors.secondaryBgColor,
          borderColor: colors.primaryBorderColor
        }]}>
          <TextBase 
            text={text}
            i18nTranslation={i18nTranslation}
            type={type}
            color={colors.infoColor}
            style={textCustomStyle || [GlobalTypographyStyle.titleSubtitle, { color: colors.infoColor }]} />
        </View>
    </TouchableHaptic>
  )
})

export default TouchableHapticText;