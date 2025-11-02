import React from "react";
import { View } from "react-native";

import { useThemeColors } from "@/hooks/theme/useThemeColor";

import TouchableHaptic, { TouchableHapticProps } from "@/components/button/TouchableHaptic";
import TextBase, { TextBaseTypes } from "@/components/typography/Text";

import RootHeaderStyle from "@/styles/components/layout/header/private/RootHeader";
import GlobalButtonStyle from "@/styles/GlobalButton";
import GlobalContainerStyle from "@/styles/GlobalContainer";

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.1
 * @type */
type TouchableHapticTextProps = TouchableHapticProps & {
  text: string;
  type?: TextBaseTypes;
  i18nTranslation?: boolean;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns a touchable (opacity) button with included haptic gesture -> Only for platform iOs/android
 * @since 0.0.1
 * @version 0.0.1
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
 * @param {string} param0.text - Text to display
 * @param {TextBaseTypes} param0.type - Text type used for styling */
const TouchableHapticText = React.forwardRef<View, TouchableHapticTextProps>(({ 
  onPress = () => {}, 
  onLongPress = () => {}, 
  onLayout = () => {},
  style, 
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
        <View style={[GlobalButtonStyle.spacing, GlobalContainerStyle.columnCenterCenter, GlobalButtonStyle.border, RootHeaderStyle.router, {
          backgroundColor: colors.secondaryBgColor,
          borderColor: colors.primaryBorderColor
        }]}>
          <TextBase 
            text={text}
            i18nTranslation={i18nTranslation}
            type={type}
            color={colors.textColor} />
        </View>
    </TouchableHaptic>
  )
})

export default TouchableHapticText;