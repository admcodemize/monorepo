import { StyleSheet } from "react-native"

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.13
 * @version 0.0.1 */
const TouchableHapticSwitchStyle = StyleSheet.create({
  container: {
    width: 40,
    height: 22,
    borderWidth: 0.5,
    borderRadius: 24,
    justifyContent: "center",
  },
  circle: {
    width: 18,
    height: 16,
    borderRadius: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2.5,
    shadowOffset: {
      width: 0,
      height: 2
    }
  }
})

export default TouchableHapticSwitchStyle;