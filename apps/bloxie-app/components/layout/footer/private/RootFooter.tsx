import { View } from "react-native";

import RootFooterLeading from "@/components/layout/footer/private/leading/RootFooterLeading";
import RootFooterTrailing from "@/components/layout/footer/private/trailing/RootFooterTrailing";

import RootFooterStyle from "@/styles/components/layout/footer/private/RootFooter";
import GlobalContainerStyle from "@/styles/GlobalContainer";

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
type RootFooterProps = {}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @component */
const RootFooter = ({

}: RootFooterProps) => {
  return (
    <View style={[GlobalContainerStyle.rowCenterBetween, RootFooterStyle.view]}>
      <RootFooterLeading />
      <RootFooterTrailing />
    </View>
  );
}

export default RootFooter;