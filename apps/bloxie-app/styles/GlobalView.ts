import { StyleSheet } from "react-native";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.57
 * @version 0.0.1
 * @description Global styles for the view components
 * @component */
const GlobalViewStyle = StyleSheet.create({
  actionContainer: {
    borderRadius: 8
  },
  actionContainerItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 4,
    gap: 4,
    alignSelf: 'stretch'
  }
});

export default GlobalViewStyle;