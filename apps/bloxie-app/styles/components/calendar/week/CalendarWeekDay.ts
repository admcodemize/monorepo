import { Dimensions, StyleSheet } from "react-native";

import { STYLES } from "@codemize/constants/Styles";

/** @description Dimensions of the window */
const DIM = Dimensions.get("window");

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1 */
const CalendarWeekDayStyle = StyleSheet.create({
  touchable: {
    width: ((DIM.width - STYLES.calendarHourWidth - 7) / 7),
    alignItems: "center",
    gap: 4,
  },
  shortText: {
    fontSize: 9, 
    textTransform: "uppercase" 
  },
  number: {
    fontSize: 12
  }
});

export default CalendarWeekDayStyle;