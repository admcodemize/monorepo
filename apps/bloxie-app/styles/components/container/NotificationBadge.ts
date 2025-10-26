import { StyleSheet } from "react-native";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.1 */
const NotificationBadgeStyle = StyleSheet.create({
  view: {
    position: "absolute",
    top: -2,
    right: -2,
    zIndex: 2,
    width: 10, 
    height: 10, 
    borderRadius: 5,
  }
})

export default NotificationBadgeStyle;