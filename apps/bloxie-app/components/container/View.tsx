import React from "react";
import { ViewProps } from "react-native";
import Animated, { BaseAnimationBuilder, EntryExitAnimationFunction } from "react-native-reanimated";
import { ReanimatedKeyframe } from "react-native-reanimated/lib/typescript/layoutReanimation/animationBuilder/Keyframe";

import { useThemeColor } from "@/hooks/theme/useThemeColor";

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.1
 * @type */
type EntryOrExitLayoutType =
  | BaseAnimationBuilder
  | typeof BaseAnimationBuilder
  | EntryExitAnimationFunction
  | ReanimatedKeyframe;

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.1
 * @type */
export type ViewSchemeProperty = "primaryBg" | "secondaryBg" | "tertiaryBg";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.1
 * @type */
export type ViewBaseProps = ViewProps & {
  light?: string;
  dark?: string;
  schemeProperty?: ViewSchemeProperty;
  animatedEntering?: EntryOrExitLayoutType;
  animatedExiting?: EntryOrExitLayoutType;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns theme based, flexible and styled view, which will be used as a default container component
 * @since 0.0.1
 * @version 0.0.2
 * @param {Object} param0 - Handles the returning of a view component with themed background color and custom styling
 * @param {string} param0.dark - Custom hex color in dark mode 
 * @param {string} param0.light - Custom hex color in light mode
 * @param {SafeAreaViewSchemeProperty} param0.schemeProperty - Defines the object property in color object -> constants/Colors 
 * @param {EntryOrExitLayoutType} param0.animatedEntering - The entering animation
 * @param {EntryOrExitLayoutType} param0.animatedExiting - The exiting animation
 * @param {StyleProp<ViewStyle>} param0.style - Extended custom styling */
const ViewBase = React.forwardRef<Animated.View, ViewBaseProps>(({
  dark,
  light,
  schemeProperty = "primaryBg",
  animatedEntering,
  animatedExiting,
  style,
  ...props
}, ref) => (
  <Animated.View 
    ref={ref}
    entering={animatedEntering}
    exiting={animatedExiting}
    style={[{ 
      flex: 1,
      backgroundColor: useThemeColor(schemeProperty, { 
        dark, 
        light 
      })
    }, style]} 
    {...props} />
));

export default ViewBase;