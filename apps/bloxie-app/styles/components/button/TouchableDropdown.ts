import { LEVEL, STYLES } from "@codemize/constants/Styles";
import { StyleSheet } from "react-native";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.1 */
const TouchableDropdownStyle = StyleSheet.create({
  view: {
    position: "absolute",
    overflow: "hidden",
    borderWidth: 1,
    borderRadius: 8,
    padding: 6,
    zIndex: LEVEL.level3
  },
  header: {
    paddingHorizontal: 8, 
    gap: STYLES.sizeGap
  }
});

export default TouchableDropdownStyle;