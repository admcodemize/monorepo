import React from "react";
import { View } from "react-native";
import { faDown, faUp } from "@fortawesome/duotone-thin-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { STYLES } from "@codemize/constants/Styles";

import { useThemeColors } from "@/hooks/theme/useThemeColor";

import { DashboardCardPercentageType } from "@/components/layout/dashboard/DashboardCard";
import TextBase from "@/components/typography/Text";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalTypographyStyle from "@/styles/GlobalTypography";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type DashboardCardValueProps = {
  title: string;
  value: string;
  percentage: string;
  percentageType: DashboardCardPercentageType;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @param {DashboardCardValueProps} param0
 * @param {string} param0.title - The title on top of the card
 * @param {string} param0.value - The value (left side)
 * @param {string} param0.percentage - The percentage (right side)
 * @param {DashboardCardPercentageType} param0.percentageType - The type of the percentage which will determine the color of the percentage
 * @component */
const DashboardCardValue = ({
  title,
  value,
  percentage,
  percentageType,
}: DashboardCardValueProps) => {
  const colors = useThemeColors();

  /** @description The style of the text */
  const textStyle = React.useMemo(() => ({
    fontSize: 10
  }), []);

  return (
    <View>
      <TextBase
        text={title}
        color={colors.dashboardCardTitleColor}
        style={[GlobalTypographyStyle.titleSubtitle, textStyle]} />
      <View style={[GlobalContainerStyle.rowCenterStart, { gap: STYLES.sizeGap }]}>
        <TextBase 
          text={value}
          color={colors.dashboardCardValueColor}
          type="title" />
        <View style={[GlobalContainerStyle.rowCenterStart, { gap: 2 }]}>
          <FontAwesomeIcon
            icon={percentageType === DashboardCardPercentageType.upwards ? faUp as IconProp : faDown as IconProp}
            size={STYLES.sizeFaIcon - 4}
            color={percentageType === DashboardCardPercentageType.upwards ? colors.successColor : colors.errorColor} />
          <TextBase 
            text={`${percentage}%`}
            type="text"
            color={percentageType === DashboardCardPercentageType.upwards ? colors.successColor : colors.errorColor}
            style={[GlobalTypographyStyle.headerSubtitle, textStyle]} />
        </View>
      </View>
    </View>
  )
}

export default DashboardCardValue;