import { Dimensions, StyleSheet } from "react-native";

const DIM = Dimensions.get("window");

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.2 */
const RootFooterStyle = StyleSheet.create({
  view: {
    backgroundColor: "#000000",
    height: DIM.height,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0
  },
  content: {
    top: DIM.height - 50,
    paddingHorizontal: 34,
    height: 40,
    gap: 20
  }
})

export default RootFooterStyle;