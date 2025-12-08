import { Text, TextProps, TextStyle } from "react-native";
import Animated, { BaseAnimationBuilder, EntryExitAnimationFunction } from "react-native-reanimated";
import { ReanimatedKeyframe } from "react-native-reanimated/lib/typescript/layoutReanimation/animationBuilder/Keyframe";

import { useTranslation } from "react-i18next";

import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { useFontFamily, useFontSize } from "@/hooks/typography/useFont";

import { COLORS } from "@codemize/constants/Colors";
import GlobalTypographyStyle from "@/styles/GlobalTypography";

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
  preText?: string;
  color?: string;
  light?: string;
  dark?: string;
  type?: TextBaseTypes;
  showColon?: boolean;
  preTextStyle?: TextStyle;
  animatedEntering?: EntryOrExitLayoutType;
  animatedExiting?: EntryOrExitLayoutType;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns theme based, flexible and styled view, which will be used as a default container component
 * @since 0.0.1
 * @version 0.0.2
 * @param {Object} param0 - Handles the returning of a generic custom typed and styled text 
 * @param {string} param0.text - Text to display (Will be translated if i18n is used)
 * @param {string} param0.preText - Text to display before the text with a bold font as highlight information
 * @param {string} param0.color - Custom hex color
 * @param {boolean} param0.i18nTranslation - Handles the translation of the text
 * @param {string} param0.dark - Custom hex color in dark mode 
 * @param {string} param0.light - Custom hex color in light mode
 * @param {TextBaseTypes} param0.type - Text type handles the font sizes/family -> constants/Styles
 * @param {boolean} param0.showColon - Handles the visibility of the colon after the text
 * @param {StyleProp<TextStyle>} param0.style - Extended custom styling for the text
 * @param {StyleProp<TextStyle>} param0.preTextStyle - Extended custom styling for the pre text
 * @param {EntryOrExitLayoutType} param0.animatedEntering - Animated entering layout type
 * @param {EntryOrExitLayoutType} param0.animatedExiting - Animated exiting layout type */
const TextBase = ({
  text,
  preText,
  color,
  i18nTranslation = true,
  dark,
  light,
  type = "text",
  style,
  preTextStyle,
  showColon = false,
  animatedEntering,
  animatedExiting,
  ...props
}: TextBaseProps) => {
  const { t } = useTranslation();
  const themedColor = useThemeColor(type as keyof typeof COLORS.light & keyof typeof COLORS.dark, { dark, light });
  const fontSize = useFontSize(type);

  return (
    <Animated.Text
      entering={animatedEntering}
      exiting={animatedExiting}
      style={[{
        color: color ? color : themedColor,
        fontSize,
        fontFamily: useFontFamily(type),
      }, style]} >
      {preText && <Animated.Text  
        style={[GlobalTypographyStyle.titleSubtitle, { 
          color: themedColor, 
          fontSize,
          marginRight: 4
        }, preTextStyle]}>
          {preText}{"\u00A0"} {/* protected space as gap */} 
        </Animated.Text>}
      <Animated.Text 
        style={[{
          color: color ? color : themedColor,
          fontSize,
          fontFamily: useFontFamily(type)
        }, style]} 
        {...props}>
          {i18nTranslation ? `${showColon 
            ? t(text) + ":" : t(text)}` 
            : `${showColon ? text + ":" : text}`}
      </Animated.Text>
    </Animated.Text>
  )
}

export default TextBase;