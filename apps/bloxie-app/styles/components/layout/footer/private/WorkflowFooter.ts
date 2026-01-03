import { Dimensions, StyleSheet } from "react-native";

const DIM = Dimensions.get("window");

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.33
 * @version 0.0.1 */
const WorkflowFooterStyle = StyleSheet.create({
  floating: {
    position: "absolute",
    flexDirection: "column",
    left: 0,
    right: 0,
    paddingHorizontal: 14,
    alignItems: "center",
  },
  bubble: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    alignSelf: "center",
  },
  view: {
    gap: 12, 
    padding: 4, 
    paddingRight: 12,
  },
  left: {
    gap: 12,
    borderRadius: 15, 
    padding: 4,
    minHeight: 42,
    paddingHorizontal: 12
  }
})

export default WorkflowFooterStyle;