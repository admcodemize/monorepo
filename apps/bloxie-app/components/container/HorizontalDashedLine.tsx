import Svg, { Line } from "react-native-svg";

import { useThemeColors } from "@/hooks/theme/useThemeColor";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.1
 * @type */
export type HorizontalDashedLineProps = {
  strokeColor?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  strokeOpacity?: number;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.1
 * @param {HorizontalDashedLineProps} param0
 * @param {string} param0.strokeColor - The color of the line
 * @param {number} param0.strokeWidth - The width of the line
 * @param {string} param0.strokeDasharray - The dasharray of the line
 * -> Pattern of dashes and gaps used to paint the outline of the shape
 * @param {number} param0.strokeOpacity - The opacity of the line
 * @component */
const HorizontalDashedLine = ({
  strokeColor,
  strokeWidth = 1,
  strokeDasharray = "6, 4",
  strokeOpacity = 0.8
}: HorizontalDashedLineProps) => {
  const colors = useThemeColors();

  return (
    <Svg 
      height="1" 
      width="100%" 
      style={{ position: "absolute" }}>
        <Line
          x1="0"
          y1="0"
          x2="100%"
          y2="0"
          stroke={strokeColor || `${colors.focusedBgColor}80`}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeOpacity={strokeOpacity} />
      </Svg>
  )
}

export default HorizontalDashedLine;