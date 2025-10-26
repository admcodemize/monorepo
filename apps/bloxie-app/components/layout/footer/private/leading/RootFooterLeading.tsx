import React from "react";
import { View } from "react-native";

import { STYLES } from "@codemize/constants/Styles";

import GlobalContainerStyle from "@/styles/GlobalContainer";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type RootFooterLeadingProps = {}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @component */
const RootFooterLeading = ({

}: RootFooterLeadingProps) => {
  return (
    <View style={[GlobalContainerStyle.rowCenterCenter, { gap: STYLES.sizeGap }]}>
    </View>
  );
}

export default RootFooterLeading;