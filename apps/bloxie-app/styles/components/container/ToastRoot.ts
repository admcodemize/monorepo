import { StyleSheet } from "react-native"
import { STYLES, LEVEL } from "@codemize/constants/Styles";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.14
 * @version 0.0.1 */
const ToastRootStyle = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: LEVEL.level1,
    elevation: LEVEL.level1,
    justifyContent: "flex-end"
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#00000030",
  },
  animated: {
    position: "absolute",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingHorizontal: STYLES.paddingHorizontal,
    paddingVertical: STYLES.paddingVertical,
    borderRadius: 12,
    marginHorizontal: 10,
  }
});

export default ToastRootStyle;