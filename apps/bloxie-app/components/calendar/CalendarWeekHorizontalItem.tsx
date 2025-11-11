import React from "react";
import { View } from "react-native";
import { DatesInWeekInfoProps } from "@codemize/helpers/DateTime";

import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { useCalendarContextStore } from "@/context/CalendarContext";
import { KEYS } from "@/constants/Keys";

import CalendarWeekDay from "@/components/calendar/week/CalendarWeekDay";
import ViewBase from "@/components/container/View";

import CalendarWeekHorizontalStyle from "@/styles/components/calendar/CalendarWeekHorizontal";
import GlobalContainerStyle from "@/styles/GlobalContainer";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.2
 * @type */
export type CalendarWeekHorizontalProps = {
  datesInWeek: DatesInWeekInfoProps[];
  selected: Date;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH
 * @since 0.0.5
 * @version 0.0.2
 * @param {CalendarWeekHorizontalProps} param0 - The props for the CalendarWeekHorizontal component
 * @param {DatesInWeekInfoProps[]} param0.datesInWeek - The dates in the week
 * @param {Date} param0.selected - The selected date
 * @component */
const CalendarWeekHorizontalItem = ({
  datesInWeek,
  selected,
}: CalendarWeekHorizontalProps) => {
  const colors = useThemeColors();

  /** @description Get the config from the context for setting the width of the item */
  const config = useCalendarContextStore((state) => state.config);

  return (
    <ViewBase style={{ width: config.totalWidth }}>
    <View style={[GlobalContainerStyle.rowCenterCenter, CalendarWeekHorizontalStyle.view, CalendarWeekHorizontalStyle.header, {
      width: config.totalWidth,
      borderBottomColor: `${colors.secondaryBorderColor}60`,
    }]}>
      {datesInWeek.map((dateInWeek, index) => (
        <CalendarWeekDay
          key={`${KEYS.calendarWeekHorizontal}-${dateInWeek.number}`} 
          dateInWeek={dateInWeek}
          selected={selected}
          index={index}
          />
      ))}
    </View>
    </ViewBase>
  );
};

export default React.memo(CalendarWeekHorizontalItem);