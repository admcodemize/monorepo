import { Dimensions, StyleSheet } from "react-native";

/** @description Dimensions of the window */
const DIM = Dimensions.get("window");

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1 */
const CalendarWeekStyle = StyleSheet.create({
  view: {
    width: DIM.width,
    justifyContent: "center" ,
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 1,
  },
  viewWeek: {
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 2,
    height: 60,
    gap: 11
  }
})

export default CalendarWeekStyle;