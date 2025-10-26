import { StyleSheet } from "react-native";
import { STYLES } from "@codemize/constants/Styles";

const HEIGHT = 26;
const BORDER_RADIUS = 6;
const BORDER_WIDTH = 1;

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.6
 * @version 0.0.1 */
const DashboardCardStyle = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS,
    gap: STYLES.sizeGap,
    padding: STYLES.paddingVertical - 4,
    paddingHorizontal: STYLES.paddingHorizontal - 4,
  },
  charts: {
    height: HEIGHT, 
    borderRadius: BORDER_RADIUS, 
    borderWidth: BORDER_WIDTH,
    gap: STYLES.sizeGap,
    paddingHorizontal: STYLES.paddingHorizontal - 6,
  },
  details: {
    height: HEIGHT, 
    borderRadius: BORDER_RADIUS, 
    borderWidth: BORDER_WIDTH,
    gap: STYLES.sizeGap,
    paddingHorizontal: STYLES.paddingHorizontal - 4,
  }
})

export default DashboardCardStyle;