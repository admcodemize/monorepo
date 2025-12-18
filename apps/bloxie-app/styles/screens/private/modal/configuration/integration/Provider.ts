import { Dimensions, StyleSheet } from "react-native";
import { STYLES } from "@codemize/constants/Styles";

const DIM = Dimensions.get("window");

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.15
 * @version 0.0.3 */
const ProviderStyle = StyleSheet.create({
  view: {
    paddingHorizontal: STYLES.paddingHorizontal,
    paddingVertical: STYLES.paddingVertical + 4, 
    gap: STYLES.sizeGap * 2,
    width: DIM.width
  },
  item: {
    borderRadius: 6, 
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
    borderRadius: 4, 
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