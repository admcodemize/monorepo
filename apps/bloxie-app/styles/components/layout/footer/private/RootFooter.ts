import { StyleSheet } from "react-native";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.3 */
const RootFooterStyle = StyleSheet.create({
  animated: {
    flexDirection: "column",
    position: "absolute",
    left: 14,
    right: 14,
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  view: {
    gap: 12, 
    padding: 4, 
    paddingRight: 12
  },
  viewButtons: {
    gap: 12, 
    borderRadius: 15, 
    padding: 4, 
    flex: 1, 
    height: 42, 
    paddingHorizontal: 12
  },
  input: {
    flex: 1, 
    marginRight: 8
  }
})

export default RootFooterStyle;