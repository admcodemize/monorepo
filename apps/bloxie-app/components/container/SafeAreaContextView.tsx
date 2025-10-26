import { ViewProps } from "react-native";
import { Edge, SafeAreaView } from "react-native-safe-area-context";

import { useThemeColor } from "@/hooks/theme/useThemeColor";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.1
 * @type */
export type SafeAreaViewSchemeProperty = "primaryBg" | "secondaryBg" | "tertiaryBg";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.1
 * @type */
export type SafeAreaViewProps = ViewProps & {
  light?: string;
  dark?: string;
  edges?: Edge[];
  schemeProperty?: SafeAreaViewSchemeProperty;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns theme based, flexible and styled safe context view, which will be used as a default container component
 * @since 0.0.1
 * @version 0.0.1
 * @param {Object} param0 - Handles the returning of a view component with themed background color and custom styling
 * @param {string} param0.dark - Custom hex color in dark mode 
 * @param {string} param0.light - Custom hex color in light mode
 * @param {Edge[]} param0.edges - The edges to apply the safe area view to
 * @param {SafeAreaViewSchemeProperty} param0.schemeProperty - Defines the object property in color object -> constants/Colors 
 * @param {StyleProp<ViewStyle>} param0.style - Extended custom styling */
const SafeAreaContextViewBase = ({
  dark,
  light,
  edges = ["right", "left", "top"],
  schemeProperty = "primaryBg",
  style,
  ...props
}: SafeAreaViewProps) => (
  <SafeAreaView 
    edges={edges}
    style={[{ 
      flex: 1,
      backgroundColor: useThemeColor(schemeProperty, { 
        dark, 
        light 
      })
    }, style]} 
    {...props} />
)

export default SafeAreaContextViewBase;