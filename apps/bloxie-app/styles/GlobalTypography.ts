import { StyleSheet } from "react-native";
import { FAMILIY, SIZES } from "@codemize/constants/Fonts";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.1 */
const GlobalTypographyStyle = StyleSheet.create({
  standardText: {
    fontSize: Number(SIZES.text),
    fontFamily: String(FAMILIY.text) 
  },
  textSubtitle: {
    fontSize: Number(SIZES.text),
    fontFamily: String(FAMILIY.subtitle)
  },
  labelText: {
    fontSize: Number(SIZES.label),
    fontFamily: String(FAMILIY.text)
  },
  labelSubtitle: {
    fontSize: Number(SIZES.label), 
    fontFamily: String(FAMILIY.subtitle)
  },
  titleSubtitle: {
    fontSize: Number(SIZES.title), 
    fontFamily: String(FAMILIY.subtitle) 
  },
  headerSubtitle: {
    fontSize: Number(SIZES.header), 
    fontFamily: String(FAMILIY.header) 
  },
  inputText: {
    textAlign: "center",
    fontSize: Number(SIZES.label),
    fontFamily: String(FAMILIY.subtitle),
    height: 30
  }
})

export default GlobalTypographyStyle;