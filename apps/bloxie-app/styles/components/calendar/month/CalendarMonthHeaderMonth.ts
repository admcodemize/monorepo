import { StyleSheet } from "react-native"

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalTypographyStyle from "@/styles/GlobalTypography";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.1 */
const CalendarMonthHeaderMonthStyle = StyleSheet.create({
  viewCustomStyle: {
    ...GlobalContainerStyle.rowCenterCenter, 
    gap: 4, 
    paddingVertical: 4, 
    paddingHorizontal: 6, 
    borderRadius: 4
  },
  textCustomStyle: {
    ...GlobalTypographyStyle.titleSubtitle, 
  }
})

export default CalendarMonthHeaderMonthStyle;