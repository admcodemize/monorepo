import { StyleSheet } from "react-native";
import GlobalContainerStyle from "./GlobalContainer";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.43
 * @version 0.0.2
 * @description Global styles for the workflow components
 * @component */
const GlobalWorkflowStyle = StyleSheet.create({
  touchableParent: {
    gap: 18,
    height: 28,
    paddingHorizontal: 10,
    borderRadius: 8
  },
  right: {
    ...GlobalContainerStyle.rowCenterCenter,
    width: 40,
    gap: 18
  }
});

export default GlobalWorkflowStyle;