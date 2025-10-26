import { StyleSheet } from "react-native";
import { STYLES } from "@codemize/constants/Styles";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.1 */
const ScreenTabsStyle = StyleSheet.create({
  view: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    gap: 6,
    borderWidth: 1,
    paddingHorizontal: 14
  },
  content: {
    flex: 1,
    gap: 8,
  },
  haptic: {
    borderRadius: 6,
    height: STYLES.sizeTouchable
  },
  iconText: {
    gap: 4, 
    paddingHorizontal: 8
  }
})

export default ScreenTabsStyle;