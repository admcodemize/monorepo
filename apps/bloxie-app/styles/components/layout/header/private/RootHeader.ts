import { StyleSheet } from "react-native";
import { STYLES } from "@codemize/constants/Styles";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.1 */
const RootHeaderStyle = StyleSheet.create({
  view: {
    height: STYLES.layoutTabHeight,
    paddingHorizontal: STYLES.paddingHorizontal,
  },
  router: {
    height: STYLES.sizeTouchable,
    minWidth: STYLES.sizeTouchable,
  },
  render: {
    overflow: "hidden",
    borderRadius: 8,
    borderWidth: 1
  }
})

export default RootHeaderStyle;