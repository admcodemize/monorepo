import React from "react";
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
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
 * @since 0.0.6
 * @version 0.0.1
 * @type */
export type CalendarMonthListProps = {
  onWeeksChange?: (weeks: number) => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.2
 * @param {CalendarMonthListProps} param0
 * @param {function} param0.onWeeksChange - The function to call when the weeks change
 * @component */
const CalendarMonthList = ({
  onWeeksChange,
}: CalendarMonthListProps) => {
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

  /** 
   * @description Key extractor for the months
   * @param {CalendarCachedMonthsHorizontalProps} item - The item to extract the key from */
  const keyExtractor = (item: CalendarCachedMonthsHorizontalProps) => `${item.index}`;

  /** 
   * @description Render item for the months
   * @param {LegendListRenderItemProps<CalendarCachedMonthsHorizontalProps>} item - The item to render
   * @see {@link @/components/calendar/month/CalendarMonthListItem} */
  const renderItem = ({ 
    item 
  }: LegendListRenderItemProps<CalendarCachedMonthsHorizontalProps>) => <CalendarMonthListItem 
    year={item.month.year} 
    month={item.month.month} 
    weeks={item.month.weeks}  />;

  /** 
   * @description Handles the momentum scroll end event for updating the weeks count in the parent component
   * @param {NativeSyntheticEvent<NativeScrollEvent>} e - The event object
   * @param {number} index - The index of the month
   * @param {number} weeks - The weeks count of the month
   * @see {@link @/components/calendar/month/CalendarMonth} */
  const onMomentumScrollEnd = React.useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = e.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / DIM.width);

      /** @description Ensure we are in the range */
      if (index >= 0 && index < months.length) onWeeksChange?.(months[index].month.weeks.length);
    },
    [months, onWeeksChange]
  );

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
      onMomentumScrollEnd={onMomentumScrollEnd}
      keyExtractor={keyExtractor}
      renderItem={renderItem} 
      contentContainerStyle={{
        borderTopWidth: 1, 
        borderTopColor: colors.primaryBorderColor, 
      }} />
  )
}

export default CalendarMonthList;