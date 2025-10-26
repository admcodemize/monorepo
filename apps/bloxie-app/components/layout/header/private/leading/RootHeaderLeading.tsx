import { View } from "react-native";
import { Link } from "expo-router";

import TextBase from "@/components/typography/Text";

import RootHeaderLeadingStyle from "@/styles/components/layout/header/private/leading/RootHeaderLeading";
import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalTypographyStyle from "@/styles/GlobalTypography";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @component */
const RootHeaderLeading = () => {
  return (
    <View style={RootHeaderLeadingStyle.view}>
      <View style={GlobalContainerStyle.columnStartStart}>
        <TextBase 
          text="Dashboard"
          style={GlobalTypographyStyle.titleSubtitle} />
        <Link href="https://bloxie.ch/codemize">
          <TextBase 
            text="bloxie.ch/codemize"
            type="label" 
            style={[GlobalTypographyStyle.labelText]} />
        </Link>
        {/*<TextBase 
          text="bloxie.app.ch/codemize"
          type="label" 
          style={[GlobalTypographyStyle.labelText]} />*/}
      </View>
    </View>
  )
}

export default RootHeaderLeading;