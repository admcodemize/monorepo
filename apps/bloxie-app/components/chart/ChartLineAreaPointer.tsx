import React from "react";
import { View } from "react-native";

import { getCurrencyCode } from "@/helpers/System";
import { useThemeColors } from "@/hooks/theme/useThemeColor";

import { ChartLineAreaDataProps } from "@/components/chart/ChartLineArea";
import TextBase from "@/components/typography/Text";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalTypographyStyle from "@/styles/GlobalTypography";

/** 
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @readonly
 * @since 0.0.2
 * @version 0.0.1
 * @constant */
export const INITIAL_CHART_POINTER_ITEM: ChartLineAreaDataProps = React.useMemo<ChartLineAreaDataProps>(() => ({
  value: 0,
  now: undefined,
  dataPointLabel: "0.00"
}), []);

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type ChartLineAreaPointerProps = {
  title: string;
  value: string;
  now: Date|undefined;
  showCurrency?: boolean;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @param {DashboardStatisticsChartPointerProps} param0 
 * @param {string} param0.title - The title of the chart pointer (i18n translation)
 * @param {string} param0.value - The value of the chart pointer
 * @param {Date|undefined} param0.now - The current date
 * @param {boolean} param0.showCurrency - Whether to show the currency of the value
 * @component */
export const ChartLineAreaPointer = ({
  title,
  value,
  now,
  showCurrency = false
}: ChartLineAreaPointerProps) => {
  const colors = useThemeColors();

  /** @description The style of the text */
  const textStyle = React.useMemo(() => ({
    color: colors.textColor, 
    fontSize: 10 
  }), []);

  return (
    <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4 }]}>
      <TextBase
        text={title}
        showColon={true}
        style={[GlobalTypographyStyle.titleSubtitle, textStyle]} />
      <View style={[GlobalContainerStyle.rowCenterStart, { gap: 2 }]}>
        <TextBase
          text={value}
          style={[GlobalTypographyStyle.headerSubtitle, textStyle]} />
        {showCurrency && <TextBase
          text={getCurrencyCode()}
          style={[GlobalTypographyStyle.titleSubtitle, textStyle]} />}
      </View>
      {now && <View style={GlobalContainerStyle.rowStartStart}>
        <TextBase 
          type="label" 
          text={now.toLocaleDateString()}
          style={[GlobalTypographyStyle.labelSubtitle, { fontSize: 10 }]} />
      </View>}
    </View>
  )
}