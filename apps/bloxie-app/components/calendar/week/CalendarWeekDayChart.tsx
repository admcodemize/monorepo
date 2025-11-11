import React from "react";
import { View } from "react-native";

import TextBase from "@/components/typography/Text";

import GlobalTypographyStyle from "@/styles/GlobalTypography";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import CalendarWeekDayCircle from "./CalendarWeekDayCircle";
import GlobalContainerStyle from "@/styles/GlobalContainer";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.1
 * @type */
export type CalendarWeekDayChartProps = {
  number: number;
  highlight: string;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.1
 * @param {CalendarWeekDayChartProps} param0 - The props for the CalendarWeekDayChart component
 * @param {number} param0.number - The number of the day
 * @param {string} param0.highlight - The highlight color for the day
 * @component */
const CalendarWeekDayChart = ({
  number,
  highlight,
}: CalendarWeekDayChartProps) => {
  return (
    <View style={{ 
      width: 26, 
      height: 26, 
      justifyContent: "flex-start", 
      alignItems: "center", 
      gap: 4,
      paddingTop: 2,
    }}>
      <TextBase 
      type="subtitle" 
      text={number.toString()}
      style={[GlobalTypographyStyle.headerSubtitle, { 
        color: highlight, 
        fontSize: 12,
      }]} />
          {<View style={[GlobalContainerStyle.rowCenterCenter, { gap: 1 }]}>
            {number === 13 && <CalendarWeekDayCircle color={"#159F85"} />}
            {(number === 13 || number === 9) && <CalendarWeekDayCircle color={"#047dd4"} />}
            {(number === 13 || number === 9) && <CalendarWeekDayCircle color={"#D15555"} />}
          </View>}
    </View>
  )
}

export default React.memo(CalendarWeekDayChart);