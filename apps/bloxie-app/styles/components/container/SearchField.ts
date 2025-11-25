import { StyleSheet } from "react-native";
import { STYLES } from "@codemize/constants/Styles";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.1 */
const SearchFieldStyle = StyleSheet.create({
  view: {
    gap: STYLES.sizeGap, 
    height: STYLES.sizeTouchable + 4,
    paddingHorizontal: STYLES.paddingHorizontal - 4, 
    paddingVertical: STYLES.paddingVertical - 2,
    borderWidth: 1, 
    borderRadius: 6,
  }
})

export default SearchFieldStyle;