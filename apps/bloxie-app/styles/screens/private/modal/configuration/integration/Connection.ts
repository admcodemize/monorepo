import { StyleSheet } from "react-native";
import { STYLES } from "@codemize/constants/Styles";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.18
 * @version 0.0.1 */
const ScreenConfigurationIntegrationConnectionStyle = StyleSheet.create({
  viewHeader: {
    borderRadius: 10,
    padding: 2
  },
  viewHeaderContent: {
    paddingHorizontal: 8
  },
  image: {
    height: STYLES.sizeFaIcon + 18, 
    width: STYLES.sizeFaIcon + 16
  }
})

export default ScreenConfigurationIntegrationConnectionStyle;