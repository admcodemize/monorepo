import { StyleSheet } from "react-native"
import { STYLES, LEVEL } from "@codemize/constants/Styles";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.1 */
const CalendarTimeIndicatorStyle = StyleSheet.create({
  animated: {
    position: "absolute", 
    top: 0,
    width: "100%", 
    zIndex: LEVEL.level1
  },
  view: {
    position: 'absolute',
    flexDirection: "row",
    alignItems: "center", 
    justifyContent: "center",
    height: 15,
    marginTop: - 8,
    zIndex: LEVEL.level1
  }
})

export default CalendarTimeIndicatorStyle;