import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";

const DIM = Dimensions.get("window");

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.29
 * @version 0.0.3 */
const TabsLayoutStyle = StyleSheet.create({
  view: {
    position: "relative"
  },
  container: {
    zIndex: 1, 
    flex: 1,
    overflow: "hidden"
  }
})

export default TabsLayoutStyle;