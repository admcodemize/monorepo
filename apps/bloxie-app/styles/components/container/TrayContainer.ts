import { StyleSheet } from "react-native";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.46
 * @version 0.0.1
 * @object */
const TrayContainerStyle = StyleSheet.create({
  container: {
    borderRadius: 14, 
    paddingHorizontal: 6, 
    paddingVertical: 6
  },
  header: {
    paddingHorizontal: 8,
    paddingVertical: 10
  },
  children: {
    paddingBottom: 10,
    borderRadius: 14,
    paddingHorizontal: 10,
    borderWidth: 1,
  }
});

export default TrayContainerStyle;