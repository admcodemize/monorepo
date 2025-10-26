import { View, ViewStyle } from "react-native";
import { STYLES } from "@codemize/constants/Styles";

import TextBase from "@/components/typography/Text";

import GlobalTypographyStyle from "@/styles/GlobalTypography";

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
type TitleWithDescriptionProps = {
  title: string;
  description: string;
  gapBetween?: number;
  numberOfLines?: number;
  ellipsizeMode?: "head" | "middle" | "tail";
  style?: ViewStyle|ViewStyle[];
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @param {TitleWithDescriptionProps} param0
 * @param {string} param0.title - The title 
 * @param {string} param0.description - The description
 * @param {number} param0.gapBetween - The gap between the title and description
 * @param {number} param0.numberOfLines - The number of lines to show
 * @param {string} param0.ellipsizeMode - The ellipsize mode
 * @param {ViewStyle|ViewStyle[]} param0.style - The style of the component
 * @component */
const TitleWithDescription = ({
  title,
  description,
  gapBetween = STYLES.sizeGap / 2,
  numberOfLines = 2,
  ellipsizeMode = "tail",
  style
}: TitleWithDescriptionProps) => {
  return (
    <View style={[style, { gap: gapBetween }]}>
      <TextBase 
        text={title} 
        style={[GlobalTypographyStyle.textSubtitle]} />
      <TextBase 
        type="label" 
        text={description} 
        numberOfLines={numberOfLines}
        ellipsizeMode={ellipsizeMode}
        style={[GlobalTypographyStyle.labelText]} />
    </View>
  )
}

export default TitleWithDescription;