import { StyleSheet } from "react-native";
import { STYLES } from "@codemize/constants/Styles";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.1 */
const GlobalButtonStyle = StyleSheet.create({
  defaultSize: {
    overflow: "hidden",
    height: STYLES.sizeTouchable,
  },
  spacing: {
    paddingHorizontal: 8,
    paddingVertical: 6
  },
  border: {
    borderWidth: 1,
    borderRadius: 6,
  }
})

export default GlobalButtonStyle;