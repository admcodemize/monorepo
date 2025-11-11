import { Dimensions, StyleSheet } from "react-native"

const DIM = Dimensions.get("window");

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.1 */
const CalendarMonthHeaderStyle = StyleSheet.create({
  top: {
    paddingHorizontal: 14, 
    paddingVertical: 6, 
    gap: 4, 
  },
  bottom: {
    width: DIM.width,
    borderTopWidth: 1,
    height: 30,
  },
  days: {
    width: DIM.width / 8,
  },
  day: {
    fontSize: 9,
    textTransform: "uppercase"
  }
})

export default CalendarMonthHeaderStyle;