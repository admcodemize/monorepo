import { CalendarCachedWeeksHorizontalProps, TOTAL_WEEKS, useCalendarContextStore, WEEKS_IN_PAST } from "@/context/CalendarContext";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { STYLES } from "@codemize/constants/Styles";
import React from "react";
import { Dimensions, ListRenderItemInfo, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import Animated from "react-native-reanimated";
import CalendarWeekHorizontalItem from "./CalendarWeekHorizontalItem";
import ViewBase from "../container/View";
import { WeeksObjInfoProps } from "@codemize/helpers/DateTime";
import { getWeeks } from "@codemize/helpers/DateTime";
import { addWeeks, subWeeks } from "date-fns";
import { getLocalization } from "@/helpers/System";
import { KEYS } from "@/constants/Keys";

export type CalendarWeekHorizontalListProps = {
  selected: Date;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

const CalendarWeekHorizontalList = React.forwardRef<Animated.FlatList<CalendarWeekHorizontalListProps>, CalendarWeekHorizontalListProps>(({
  selected,
  onScroll,
}, ref) => {
  const cached = useCalendarContextStore((state) => state.cached);
  const config = useCalendarContextStore((state) => state.config);

  const keyExtractor = (item: CalendarCachedWeeksHorizontalProps): string => `${KEYS.calendarWeekHorizontalList}-${item.index}`;

  const renderItem = React.useCallback(({ 
    item 
  }: ListRenderItemInfo<CalendarCachedWeeksHorizontalProps>) => {
    return (
      <CalendarWeekHorizontalItem
        datesInWeek={item.week!.datesInWeek}
        selected={selected}/>
    );
  }, [selected]);

  const getItemLayout = (_: any, index: number) => ({
    length: config.totalWidth,
    offset: config.totalWidth * index,
    index,
});

  return (
    <Animated.FlatList
      ref={ref}
      data={cached.weeksHorizontal}
      horizontal
      onScroll={onScroll}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      initialScrollIndex={WEEKS_IN_PAST}
      snapToInterval={config.totalWidth}
      snapToAlignment="start"
      decelerationRate={"fast"}
      showsHorizontalScrollIndicator={false}
      pagingEnabled={true}
      bounces={false}
      removeClippedSubviews={false}
      nestedScrollEnabled={true}
      overScrollMode="never"
      scrollEventThrottle={16}
      initialNumToRender={3}
      windowSize={5}
      maxToRenderPerBatch={2}
      updateCellsBatchingPeriod={50}
      style={{ height: STYLES.calendarHeaderHeight }} />
  );
});

export default React.memo(CalendarWeekHorizontalList);