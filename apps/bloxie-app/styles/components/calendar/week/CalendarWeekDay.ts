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
    width: ((DIM.width - (STYLES.paddingHorizontal * 2) - STYLES.paddingHorizontal) / 7),
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 2,
    height: 60,
    gap: 4
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