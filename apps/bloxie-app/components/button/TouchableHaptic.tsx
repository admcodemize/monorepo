import * as Haptics from "expo-haptics";
import React from "react";
import { GestureResponderEvent, Insets, LayoutChangeEvent, Pressable, View, ViewStyle } from "react-native";

import { isWeb } from "@/helpers/System";

import NotificationBadge from "@/components/container/NotificationBadge";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.1
 * @type */
export type TouchableHapticProps = React.PropsWithChildren & {
  onPress?: (e: GestureResponderEvent) => void;
  onLongPress?: (e: GestureResponderEvent) => void;
  onLayout?: (e: LayoutChangeEvent) => void;
  style?: ViewStyle|ViewStyle[];
  disabled?: boolean;
  visible?: boolean;
  hitSlop?: number|Insets|null|undefined;
  hideNotificationBadge?: boolean;
}

/**
 * @description Handles the onPress event with haptic feedback
 * @since 0.0.6
 * @version 0.0.1
 * @param {Function} param0.onPress - Callback function when user pressed the button
 * @param {GestureResponderEvent} param0.e - Gesture responder event
 * @function */
export const onPressHaptic = 
  (onPress: (e: GestureResponderEvent) => void) => 
  (e: GestureResponderEvent) => {
    onPress?.(e);
    if (!isWeb()) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

/**
 * @description Handles the onLongPress event with haptic feedback
 * @since 0.0.6
 * @version 0.0.1
 * @param {Function} param0.onLongPress - Callback function when user long presses the button
 * @param {GestureResponderEvent} param0.e - Gesture responder event
 * @function */
export const onLongPressHaptic = 
  (onLongPress: (e: GestureResponderEvent) => void) => 
  (e: GestureResponderEvent) => {
    onLongPress?.(e);
    if (!isWeb()) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
 * @param {boolean} param0.visible - Handles the visibility of the rendered button
 * @param {number|Insets|null|undefined} param0.hitSlop - Handles the hit slop of the rendered button. 
 * -> A hit slop is a property that allows you to set the area around the button that will trigger the onPress event.
 * @param {boolean} param0.hideNotificationBadge - Handles the visibility of the notification badge
 * @param {ReactNode|undefined} param0.children - Represents all of the things React can render. */
const TouchableHaptic = React.forwardRef<View, TouchableHapticProps>(({ 
  onPress = () => {}, 
  onLongPress = () => {}, 
  onLayout = () => {},
  style, 
  disabled, 
  visible = true,
  hitSlop = 10,
  hideNotificationBadge = true,
  children 
}, ref) => {
  return (
    <>
    {visible && <NotificationBadge hide={hideNotificationBadge}>
      <Pressable 
        ref={ref}
        style={[style, { opacity: disabled ? 0.5 : 1 }]} 
        hitSlop={hitSlop}
        disabled={disabled}
        onLayout={onLayout}
        onPress={onPressHaptic(onPress)}
        onLongPress={onLongPressHaptic(onLongPress)}>
          {children}
      </Pressable>
    </NotificationBadge>}
    </>
  )
})

export default TouchableHaptic;