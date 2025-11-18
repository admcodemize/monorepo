import { CalendarCachedWeeksHorizontalProps, CalendarContextProps, TOTAL_WEEKS, useCalendarContextStore, WEEKS_IN_PAST } from "@/context/CalendarContext";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { STYLES } from "@codemize/constants/Styles";
import React from "react";
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import Animated from "react-native-reanimated";
import { LegendListRenderItemProps, LegendListRef } from "@legendapp/list";
import { AnimatedLegendList } from "@legendapp/list/reanimated";
import CalendarWeekHorizontalItem from "./CalendarWeekHorizontalItem";
import ViewBase from "../container/View";
import { WeeksObjInfoProps } from "@codemize/helpers/DateTime";
import { getWeeks } from "@codemize/helpers/DateTime";
import { addWeeks, subWeeks } from "date-fns";
import { getLocalization } from "@/helpers/System";
import { KEYS } from "@/constants/Keys";
import { useShallow } from "zustand/react/shallow";

export type CalendarWeekHorizontalListProps = {
  selected: Date;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  scrollViewRef?: React.Ref<Animated.ScrollView>;
}

const CalendarWeekHorizontalList = React.forwardRef<LegendListRef, CalendarWeekHorizontalListProps>(({
  selected,
  onScroll,
  scrollViewRef,
}, ref) => {
  /**const cached = useCalendarContextStore((state) => state.cached);
  const config = useCalendarContextStore((state) => state.config);*/

  const selector = React.useCallback(
    (state: CalendarContextProps) => ({
      config: state.config,
      weeksHorizontal: state.cached.weeksHorizontal,
    }),
    [],
  );

  const { config, weeksHorizontal } = useCalendarContextStore(useShallow(selector));

  const keyExtractor = React.useCallback((item: CalendarCachedWeeksHorizontalProps): string => `${KEYS.calendarWeekHorizontalList}-${item.index}`, []);

  const renderItem = React.useCallback(({ 
    item 
  }: LegendListRenderItemProps<CalendarCachedWeeksHorizontalProps>) => {
    return (
      <CalendarWeekHorizontalItem
        datesInWeek={item.week!.datesInWeek}
        selected={selected}/>
    );
  }, [selected]);

  const getEstimatedItemSize = React.useCallback(() => config.totalWidth, [config.totalWidth]);
  /*const itemsAreEqual = React.useCallback((prev: CalendarCachedWeeksHorizontalProps, next: CalendarCachedWeeksHorizontalProps) => {
    if (prev.index !== next.index) return false;
    if (prev.week === next.week) return true;
    if (!prev.week || !next.week) return false;
    return prev.week.week === next.week.week &&
      prev.week.startOfWeek.getTime() === next.week.startOfWeek.getTime() &&
      prev.week.endOfWeek.getTime() === next.week.endOfWeek.getTime();
  }, []);*/

  return (
    <AnimatedLegendList
      ref={ref}
      refScrollView={scrollViewRef}
      data={weeksHorizontal}
      horizontal
      onScroll={onScroll}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      initialScrollIndex={WEEKS_IN_PAST}
      snapToInterval={config.totalWidth}
      snapToAlignment="start"
      decelerationRate={"fast"}
      showsHorizontalScrollIndicator={false}
      pagingEnabled={true}
      bounces={false}
      overScrollMode="never"
      scrollEventThrottle={16}
      estimatedItemSize={config.totalWidth}
      getEstimatedItemSize={getEstimatedItemSize}
      drawDistance={config.totalWidth}
      recycleItems
      estimatedListSize={{
        width: config.totalWidth,
        height: STYLES.calendarHeaderHeight,
      }}
      //itemsAreEqual={itemsAreEqual}
      style={{ height: STYLES.calendarHeaderHeight }} />
  );
});

export default React.memo(CalendarWeekHorizontalList);