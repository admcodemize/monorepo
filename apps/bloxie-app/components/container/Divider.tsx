import * as React from "react";
import { View, ViewProps, ViewStyle } from "react-native";

import { useThemeColor } from "@/hooks/theme/useThemeColor";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.1
 * @type */
export type DividerProps = ViewProps & {
  style?: ViewStyle|ViewStyle[];
  vertical?: boolean;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns a divider line view
 * @since 0.0.1
 * @version 0.0.1
 * @param {Object} param0
 * @param {ViewStyle|ViewStyle[]} param0.style - Extended custom styling
 * @param {boolean} param0.vertical - Vertical divider  */
const Divider = ({ 
  style,
  vertical = false
}: DividerProps) => {
  const primaryBorderColor = useThemeColor("primaryBorder");

  return (
    <View style={[{
      backgroundColor: primaryBorderColor,
      height: vertical ? 14 : 1,
      width: vertical ? 1 : "100%",
    }, style]} />
  )
}

export default Divider;