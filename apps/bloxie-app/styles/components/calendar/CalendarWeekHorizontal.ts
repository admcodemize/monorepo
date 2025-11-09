import { STYLES } from "@codemize/constants/Styles";
import { Dimensions, StyleSheet } from "react-native";

/** @description Dimensions of the window */
const DIM = Dimensions.get("window");

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.2 */
const CalendarWeekHorizontalStyle = StyleSheet.create({
  view: {
    width: DIM.width - STYLES.calendarHourWidth
  },
  header: {
    height: STYLES.calendarHeaderHeight,
    borderBottomWidth: 1,
  }
})

export default CalendarWeekHorizontalStyle;