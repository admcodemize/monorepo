import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { StyleSheet } from "react-native";
import Svg, { Circle, Defs, Pattern, Rect } from 'react-native-svg';

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.53
 * @version 0.0.1
 * @description A dotted background component
 * @component */
const DottedBackground = () => {
  const { primaryTemplateBgColor } = useThemeColors();
  return (
    <Svg 
      style={[StyleSheet.absoluteFill, { zIndex: -1 }]} 
      pointerEvents="none">
      <Defs>
        <Pattern 
          id="dots" 
          patternUnits="userSpaceOnUse" 
          width={22} 
          height={22}>
            <Circle 
              cx={1} 
              cy={1} 
              r={1} 
              fill={primaryTemplateBgColor} />
        </Pattern>
      </Defs>
      <Rect 
        width="100%" 
        height="100%" 
        fill="url(#dots)" />
    </Svg>
  );
};

export default DottedBackground;