import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import TextBase from "@/components/typography/Text";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalTypographyStyle from "@/styles/GlobalTypography";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.2
 * @type */
export type TrayHeaderProps = {
  title: string;
  description?: string;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.3
 * @param {TrayHeaderProps} param0
 * @param {string} param0.title - The title to display
 * @param {string} param0.description - The description to display (below the title)
 * @component */
const TrayHeader = ({
  title,
  description,
}: TrayHeaderProps) => {
  const { t } = useTranslation();
  return (
    <View style={[GlobalContainerStyle.rowStartBetween]}>
      <View style={{ gap: 4 }}>
        <TextBase 
          text={t(title)}
          style={GlobalTypographyStyle.titleSubtitle} />
        {description && <TextBase 
          text={t(description)}
          type="label"
          numberOfLines={3}
          ellipsizeMode={"tail"}
          style={[GlobalTypographyStyle.labelText]} />}
      </View>
    </View>
  )
}

export default TrayHeader;