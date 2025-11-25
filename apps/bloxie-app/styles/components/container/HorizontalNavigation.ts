import { STYLES } from "@codemize/constants/Styles";
import { StyleSheet } from "react-native";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.13
 * @version 0.0.1 */
const HorizontalNavigationStyle = StyleSheet.create({
  label: {
    height: 20, 
    justifyContent: "center", 
    alignItems: "center"
  },
  tabStyle: {
    width: "auto", 
    padding: 0, 
    height: 24, 
    paddingHorizontal: 6, 
    justifyContent: "flex-start", 
    alignItems: "flex-start"
  },
  contentContainerStyle: {
    borderBottomWidth: 0.5,   
    paddingHorizontal: STYLES.paddingHorizontal
  }
});

export default HorizontalNavigationStyle;