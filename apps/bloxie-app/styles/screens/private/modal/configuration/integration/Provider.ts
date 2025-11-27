import { StyleSheet } from "react-native";
import { STYLES } from "@codemize/constants/Styles";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.15
 * @version 0.0.1 */
const ProviderStyle = StyleSheet.create({
  view: {
    paddingHorizontal: STYLES.paddingHorizontal,
    paddingVertical: STYLES.paddingVertical + 4, 
    gap: STYLES.sizeGap * 3
  },
  item: {
    borderRadius: 10, 
    padding: 2 
  },
  itemHeader: {
    paddingHorizontal: 8
  },
  itemImage: {
    height: STYLES.sizeFaIcon + 18, 
    width: STYLES.sizeFaIcon + 16
  },
  itemBottom: {
    paddingVertical: 6, 
    paddingHorizontal: 8, 
    borderRadius: 8, 
    borderWidth: 0.5
  },
  itemBottomContent: {
    gap: 4,
    padding: 6, 
    paddingVertical: 4, 
    borderRadius: 4
  }
})

export default ProviderStyle;