import { StyleSheet } from "react-native";
import { STYLES } from "@codemize/constants/Styles";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.1 */
const CreateStyle = StyleSheet.create({
  view: {
    paddingHorizontal: STYLES.paddingHorizontal - 8,
    paddingTop: STYLES.paddingVertical,
    gap: STYLES.sizeGap + 20
  },
  groupContent: {
    gap: STYLES.sizeGap,
    paddingHorizontal: 4,
    paddingRight: STYLES.paddingHorizontal - 4,
  }
})

export default CreateStyle;