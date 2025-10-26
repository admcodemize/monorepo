import { TextProps } from "react-native";
import Animated, { BaseAnimationBuilder, EntryExitAnimationFunction } from "react-native-reanimated";
import { ReanimatedKeyframe } from "react-native-reanimated/lib/typescript/layoutReanimation/animationBuilder/Keyframe";

import { useTranslation } from "react-i18next";

import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { useFontFamily, useFontSize } from "@/hooks/typography/useFont";

import { COLORS } from "@codemize/constants/Colors";

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
export type TextBaseTypes = "label" | "text" | "subtitle" | "title" | "header";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.1
 * @type */
export type TextBaseProps = TextProps & {
  text: string;
  i18nTranslation?: boolean;
  color?: string;
  light?: string;
  dark?: string;
  type?: TextBaseTypes;
  showColon?: boolean;
  animatedEntering?: EntryOrExitLayoutType;
  animatedExiting?: EntryOrExitLayoutType;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns theme based, flexible and styled view, which will be used as a default container component
 * @since 0.0.1
 * @version 0.0.1
 * @param {Object} param0 - Handles the returning of a generic custom typed and styled text 
 * @param {string} param0.text - Text to display (Will be translated if i18n is used)
 * @param {string} param0.color - Custom hex color
 * @param {boolean} param0.i18nTranslation - Handles the translation of the text
 * @param {string} param0.dark - Custom hex color in dark mode 
 * @param {string} param0.light - Custom hex color in light mode
 * @param {TextBaseTypes} param0.type - Text type handles the font sizes/family -> constants/Styles
 * @param {boolean} param0.showColon - Handles the visibility of the colon after the text
 * @param {StyleProp<TextStyle>} param0.style - Extended custom styling 
 * @param {EntryOrExitLayoutType} param0.animatedEntering - Animated entering layout type
 * @param {EntryOrExitLayoutType} param0.animatedExiting - Animated exiting layout type */
const TextBase = ({
  text,
  color,
  i18nTranslation = true,
  dark,
  light,
  type = "text",
  style,
  showColon = false,
  animatedEntering,
  animatedExiting,
  ...props
}: TextBaseProps) => {
  const { t } = useTranslation();

  return (
    <Animated.Text 
      entering={animatedEntering}
      exiting={animatedExiting}
      style={[{
        color: color ? color : useThemeColor(type as keyof typeof COLORS.light & keyof typeof COLORS.dark, { dark, light }),
        fontSize: useFontSize(type),
        fontFamily: useFontFamily(type)
      }, style]} 
      {...props}>
        {i18nTranslation ? `${showColon 
          ? t(text) + ":" : t(text)}` 
          : `${showColon ? text + ":" : text}`}
    </Animated.Text>
  )
}

export default TextBase;