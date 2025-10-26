import { StyleSheet } from "react-native";
import { LEVEL, STYLES } from "@codemize/constants/Styles";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1 */
const CalendarDayListStyle = StyleSheet.create({
  left: {
    maxWidth: STYLES.calendarHourWidth,
    borderBottomWidth: STYLES.calendarHourBorderHeight
  },
  right: {
    flex: 1,
  },
  hour: {
    width: STYLES.calendarHourWidth, 
    height: STYLES.calendarHourHeight,
  },
  touchable: {
    position: 'absolute',
    left: 0,
    width: "100%",
    height: STYLES.calendarHourHeight / 2,
    zIndex: LEVEL.level2
  }
})

export default CalendarDayListStyle;