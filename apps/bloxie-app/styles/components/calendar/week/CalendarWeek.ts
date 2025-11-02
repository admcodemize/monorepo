import { STYLES } from "@codemize/constants/Styles";
import { Dimensions, StyleSheet } from "react-native";

/** @description Dimensions of the window */
const DIM = Dimensions.get("window");

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.2 */
const CalendarWeekStyle = StyleSheet.create({
  view: {
    width: DIM.width - STYLES.calendarHourWidth + 0.5,
    gap: 1,
  },
  header: {
    height: STYLES.calendarHeaderHeight,
    borderBottomWidth: 1,
  },
  weekNumber: {
    height: STYLES.calendarHeaderHeight,
    width: STYLES.calendarHourWidth,
    borderRightWidth: 1,
  },
})

export default CalendarWeekStyle;