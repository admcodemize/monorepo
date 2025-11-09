import { StyleSheet } from "react-native"
import { STYLES } from "@codemize/constants/Styles";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.1 */
const CalendarHourGridStyle = StyleSheet.create({
  view: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 0 
  },
  item: {
    height: STYLES.calendarHourHeight, 
    borderBottomWidth: 1, 
    opacity: 0.5,
    flexDirection: 'row'
  },
  dayItem: {
    height: '100%',
    opacity: 0.5
  }
})

export default CalendarHourGridStyle;