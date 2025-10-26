import { StyleSheet } from "react-native";
import { STYLES } from "@codemize/constants/Styles";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.1 */
const DashboardStyle = StyleSheet.create({
  view: {
    padding: STYLES.paddingHorizontal,
    gap: STYLES.sizeGap * 2
  }
})

export default DashboardStyle;