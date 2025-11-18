import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

import { KEYS } from "@/constants/Keys";
import { CalendarCachedWeeksHorizontalProps, CalendarContextProps, useCalendarContextStore, WEEKS_IN_PAST } from "@/context/CalendarContext";
import { getLocalization } from "@/helpers/System";
import { STYLES } from "@codemize/constants/Styles";
import { getHours, HoursProps } from "@codemize/helpers/DateTime";
import React from "react";
import { LegendListRenderItemProps, LegendListRef } from "@legendapp/list";
import { AnimatedLegendList } from "@legendapp/list/reanimated";
import { useShallow } from "zustand/react/shallow";
import CalendarWeekHorizontalGridListItem from "./CalendarWeekHorizontalGridListItem";
import Animated from "react-native-reanimated";
const HOURS: HoursProps[] = getHours(24, getLocalization());

export type CalendarWeekHorizontalGridListProps = {
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  scrollViewRef?: React.Ref<Animated.ScrollView>;
}

const CalendarWeekHorizontalGridList = React.forwardRef<LegendListRef, CalendarWeekHorizontalGridListProps>(({
  onScroll,
  scrollViewRef,
}, ref) => {
  const selector = React.useCallback(
    (state: CalendarContextProps) => ({
      config: state.config,
      weeksHorizontal: state.cached.weeksHorizontal,
    }),
    []
  );
  const { config, weeksHorizontal } = useCalendarContextStore(useShallow(selector));

  const keyExtractor = React.useCallback((item: CalendarCachedWeeksHorizontalProps, index: number) => `${KEYS.calendarWeekVerticalGridList}-${index}`, []);
  const renderItem = React.useCallback(({
    item
  }: LegendListRenderItemProps<CalendarCachedWeeksHorizontalProps>) => (
    <CalendarWeekHorizontalGridListItem
      index={item.index}
      week={item.week!}
      shouldRenderEvents={true}/>
  ), []);

  const getEstimatedItemSize = React.useCallback(() => config.totalWidth, [config.totalWidth]);
  
  return (
    <AnimatedLegendList
      ref={ref}
      refScrollView={scrollViewRef}
      data={weeksHorizontal}
      horizontal
      showsHorizontalScrollIndicator={false}
      onScroll={onScroll}
      snapToInterval={config.totalWidth}
      snapToAlignment="start"
      decelerationRate="fast"
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      initialScrollIndex={WEEKS_IN_PAST}
      bounces={false}
      pagingEnabled={true}
      scrollEventThrottle={16}
      overScrollMode="never"
      estimatedItemSize={config.totalWidth}
      getEstimatedItemSize={getEstimatedItemSize}
      drawDistance={config.totalWidth}
      recycleItems
      estimatedListSize={{
        width: config.totalWidth,
        height: HOURS.length * STYLES.calendarHourHeight,
      }}
      style={{
        height: HOURS.length * STYLES.calendarHourHeight,  // Exakte Höhe
        zIndex: 1  // Über dem Background
      }} />
  );
});

export default CalendarWeekHorizontalGridList;