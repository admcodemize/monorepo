import { StyleSheet } from "react-native";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.1 */
const ChartLineAreaStyle = StyleSheet.create({
  view: {
    position: 'relative'
  },
  chartPointerView: {
    width: 10, 
    height: 10,
    borderRadius: 2
  },
  svgView: {
    position: 'absolute'
  },
  averageLineView: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    zIndex: 0,
  },
  averageLineLabelView: {
    position: 'absolute',
    left: 14,
    top: -8,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  }
});

export default ChartLineAreaStyle;