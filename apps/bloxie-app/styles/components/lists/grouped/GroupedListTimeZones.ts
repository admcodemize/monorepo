import { StyleSheet } from "react-native";
import { STYLES } from "@codemize/constants/Styles";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1 */
const GroupedListTimeZonesStyle = StyleSheet.create({
  stickyHeader: {
    paddingVertical: 8,
    paddingHorizontal: STYLES.paddingHorizontal
  },
  item: {
    paddingVertical: 8,
    paddingHorizontal: STYLES.paddingHorizontal
  },
  active: {
    borderRadius: 3,
    padding: 2,
    paddingHorizontal: 4,
  },
  gap: {
    gap: 4
  }
})

export default GroupedListTimeZonesStyle