import { StyleSheet } from "react-native";
import { STYLES } from "@codemize/constants/Styles";
import { Dimensions } from "react-native";

const DIM = Dimensions.get("window");

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.20
 * @version 0.0.1 */
const ScreenConfigurationIntegrationSynchronisationStyle = StyleSheet.create({
  view: {
    paddingHorizontal: STYLES.paddingHorizontal, 
    paddingVertical: STYLES.paddingVertical + 4, 
    gap: STYLES.sizeGap + 4, 
    width: DIM.width
  },
  viewHeader: {
    borderRadius: 10,
    padding: 2,
    gap: 4
  },
  viewHeaderContent: {
    paddingHorizontal: 8
  },
  viewHeaderContentTouchable: {
    gap: 4, 
    padding: 6, 
    paddingVertical: 6, 
    borderRadius: 4 
  },
  image: {
    height: STYLES.sizeFaIcon + 18, 
    width: STYLES.sizeFaIcon + 16
  },
  viewBottom: {
    paddingVertical: 6, 
    paddingHorizontal: 8, 
    borderRadius: 8, 
    borderWidth: 0.5, 
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  }
})

export default ScreenConfigurationIntegrationSynchronisationStyle;