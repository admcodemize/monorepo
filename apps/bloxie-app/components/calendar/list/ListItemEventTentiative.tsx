import React, { PropsWithChildren } from "react";
import { View } from "react-native";
import Svg, { Rect, Defs, Pattern, Line } from "react-native-svg";

import { shadeColor } from "@codemize/helpers/Colors";

import ListItemEventStyle from "@/styles/components/calendar/list/ListItemEvent";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.7
 * @version 0.0.1
 * @type */
export type ListItemEventTentiativeProps = PropsWithChildren & {
  width?: number;
  height?: number;
  top?: number;
  left?: number;
  borderColor?: string;
  borderWidth?: number;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.7
 * @version 0.0.1
 * @param {ListItemEventTentiativeProps} param0
 * @param {number} param0.width - The width of the event.
 * @param {number} param0.height - The height of the event.
 * @param {number} param0.top - The top position of the event.
 * @param {number} param0.left - The left position of the event.
 * @param {string} param0.borderColor - The color of the leftborder.
 * @param {number} param0.borderWidth - The width of the left border.
 * @param {React.ReactNode} param0.children - The children of the event.
 * @component */
const ListItemEventTentiative = ({
  width = 0,
  height = 0,
  top = 0,
  left = 0,
  borderColor = "#40b2a7",
  borderWidth = 3,
  children,
}: ListItemEventTentiativeProps) => {
  return (
    <View style={[ListItemEventStyle.view, { 
      width: width - 1, 
      height: height - 1.5, 
      top: top + 0.5,
      left: left + 0.5,
    }]}>
      <Svg width="100%" height="100%">
        <Defs>
          {/* Hatch pattern */}
          <Pattern
            id="diagonalHatch"
            patternUnits="userSpaceOnUse"
            width="10"
            height="10">
            <Line
              x1="0"
              y1="10"
              x2="10"
              y2="0"
              stroke="white"
              strokeWidth="1.5"
              opacity="0.4"/>
          </Pattern>
        </Defs>
        {/* Left border */}
        <Rect
          x="0"
          y="0"
          width={borderWidth}
          height="100%"
          fill={borderColor}/>
        {/* Background */}
        <Rect
          x={borderWidth}
          y="0"
          width={width - borderWidth}
          height="100%"
          fill={borderColor}
          opacity={0.4}/>
        {/* Hatch pattern */}
        <Rect
          x={borderWidth}
          y="0"
          width={width - borderWidth}
          height="100%"
          fill="url(#diagonalHatch)"/>
      </Svg>
      <View style={[ListItemEventStyle.content]}>
        {children}
      </View>
    </View>
  );
};

export default React.memo(ListItemEventTentiative);