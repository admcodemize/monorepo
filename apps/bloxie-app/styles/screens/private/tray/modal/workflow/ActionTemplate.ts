import { StyleSheet } from "react-native";
import { STYLES } from "@codemize/constants/Styles";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.40
 * @version 0.0.1
 * @object */
const ActionTemplateStyle = StyleSheet.create({
  view: {
    borderRadius: 14, 
    padding: 4
  },
  header: {
    paddingHorizontal: 8,
    height: 28
  },
  image: {
    height: 18, 
    width: 18
  },
  containerEditor: {
    borderWidth: 1,
    paddingVertical: 4,
    borderRadius: 10,
  },
  editor: {
    gap: 4, 
    paddingHorizontal: 8
  },
  animatedContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    overflow: "hidden",
  },
  animatedDynamic: {
    paddingHorizontal: 14, 
    paddingVertical: 4,
    borderTopWidth: 1, 
    borderBottomWidth: 1, 
  },
  actions: {
    flex: 1, 
    position: "absolute", 
    bottom: 0, 
    width: "100%", 
    gap: 18, 
    paddingRight: 12, 
  },
  footer: {
    height: "100%",
    gap: 14,
    borderRadius: 6,
    paddingHorizontal: 10,
  }
});

export default ActionTemplateStyle;