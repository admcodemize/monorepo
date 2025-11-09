import React from "react";
import { Dimensions } from "react-native";
import { LegendList, LegendListRenderItemProps } from "@legendapp/list";

import { DatesInMonthInfoProps, getDatesInMonth } from "@codemize/helpers/DateTime";

import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { getLocalization } from "@/helpers/System";

import CalendarMonthListItem from "@/components/calendar/month/CalendarMonthListItem";
import { CalendarCachedMonthsHorizontalProps, useCalendarContextStore } from "@/context/CalendarContext";

const DIM = Dimensions.get("window");

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.1
 * @component */
const CalendarMonthList = () => {
  const colors = useThemeColors();

  /** 
   * @description Loads the months with the dates in the month
   * @see {@link @codemize/helpers/DateTime/getDatesInMonth} */
  const months = useCalendarContextStore((state) => state.cached.monthsHorizontal);

  /** @description Handles the initial scroll index for the list */
  const initialScrollIndex = React.useMemo(() => {
    const now = new Date();
    return months.findIndex(({ month }) => month.year === now.getFullYear() && month.month === now.getMonth());
  }, [months]);

  /** @description Key extractor for the months */
  const keyExtractor = (item: CalendarCachedMonthsHorizontalProps) => `${item.index}`;

  /** @description Render item for the months */
  const renderItem = ({ 
    item 
  }: LegendListRenderItemProps<CalendarCachedMonthsHorizontalProps>) => <CalendarMonthListItem 
    year={item.month.year} 
    month={item.month.month} 
    weeks={item.month.weeks}  />;

  /** @description Content container style for the list */
  const contentContainerStyle = React.useMemo(() => ({ 
    borderTopWidth: 1, 
    borderTopColor: colors.primaryBorderColor, 
  }), [colors.primaryBorderColor]);

  return (
    <LegendList
      data={months}
      horizontal
      snapToInterval={DIM.width}
      snapToAlignment="start"
      decelerationRate="fast"
      showsHorizontalScrollIndicator={false}
      nestedScrollEnabled={false}
      overScrollMode="never"
      scrollEventThrottle={16}
      initialScrollIndex={initialScrollIndex}
      estimatedItemSize={DIM.width}
      contentContainerStyle={contentContainerStyle}
      keyExtractor={keyExtractor}
      renderItem={renderItem} />
  )
}

export default CalendarMonthList;