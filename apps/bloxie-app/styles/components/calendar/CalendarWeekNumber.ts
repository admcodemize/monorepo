import { StyleSheet } from "react-native"

import { STYLES } from "@codemize/constants/Styles";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.1 */
const CalendarWeekNumberStyle = StyleSheet.create({
  number: {
    height: STYLES.calendarHeaderHeight,
    width: STYLES.calendarHourWidth,
    borderRightWidth: 1,
  }
})

export default CalendarWeekNumberStyle;