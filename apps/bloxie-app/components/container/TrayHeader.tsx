import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { useTrays } from "react-native-trays";

import TouchableHapticClose from "@/components/button/TouchableHapticClose";
import TextBase from "@/components/typography/Text";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalTypographyStyle from "@/styles/GlobalTypography";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type TrayHeaderProps = {
  title: string;
  description: string;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @param {TrayHeaderProps} param0
 * @param {string} param0.title - The title to display
 * @param {string} param0.description - The description to display (below the title)
 * @component */
const TrayHeader = ({
  title,
  description,
}: TrayHeaderProps) => {
  const { t } = useTranslation();
  const { dismiss } = useTrays('main');
  
  const onPressClose = React.useCallback(() => dismiss('main'), [dismiss]);

  return (
    <View style={[GlobalContainerStyle.rowStartBetween]}>
      <View style={[]}>
        <TextBase 
          text={t(title)}
          style={GlobalTypographyStyle.titleSubtitle} />
        <TextBase 
          text={t(description)}
          type="label"
          style={[GlobalTypographyStyle.labelText]} />
      </View>
      <TouchableHapticClose onPress={onPressClose} />
    </View>
  )
}

export default TrayHeader;