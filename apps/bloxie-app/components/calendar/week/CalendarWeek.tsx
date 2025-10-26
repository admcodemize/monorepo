import { addWeeks, getMonth, getYear, Month, subWeeks } from "date-fns";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, ListRenderItemInfo, NativeScrollEvent, NativeSyntheticEvent, View, ViewToken, VirtualizedList } from "react-native";
import { getWeeks, WeeksObjInfoProps } from "@codemize/helpers/DateTime";
import { captureException } from "@codemize/helpers/Sentry";

import { KEYS } from "@/constants/Keys";
import { useCalendarStore } from "@/context/CalendarContext";
import { useThemeColors } from "@/hooks/theme/useThemeColor";

import CalendarWeekDay from "@/components/calendar/week/CalendarWeekDay";
import TextBase from "@/components/typography/Text";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalTypographyStyle from "@/styles/GlobalTypography";
import CalendarWeekStyle from "@/styles/components/calendar/week/CalendarWeek";
import { getLocalization } from "@/helpers/System";

/** @description Dimensions of the window */
const DIM = Dimensions.get("window");
const WEEK_WIDTH = DIM.width;
const WEEKS_IN_PAST = 260;
const WEEKS_IN_FUTURE = 260;
const TOTAL_WEEKS = WEEKS_IN_PAST + WEEKS_IN_FUTURE;
const CACHE_SIZE = 30;

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.7
 * @version 0.0.1
 * @type */
export type CalendarWeekProps = {
  now?: Date;
  componentId?: string;
}

/**
 * @private
 * @since 0.0.7
 * @version 0.0.1
 * @type */
export type CalendarWeekVirtualizedListItem = {
  itemIndex: number;
};

/**
 * @private
 * @since 0.0.7
 * @version 0.0.1
 * @type */
export type CalendarWeekCacheEntry = {
  data: WeeksObjInfoProps;
  lastAccess: number;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description High-performance calendar week component with intelligent range selection
 * Features:
 * - Single day selection via tap
 * - Range selection via long press + tap
 * @since 0.0.28
 * @version 0.0.29
 * @param {Object} param0 
 * @param {Date} param0.now The current date to display the initial calendar for
 * @param {string} param0.componentId The id of the component for different usage of the component
 * @component */
const CalendarWeek = ({
  now = new Date(),
  componentId = "week",
}: CalendarWeekProps) => {
  const { info: infoColor, label } = useThemeColors();
  const { t } = useTranslation();
  const locale = getLocalization();
  
  const weekRef = React.useRef<VirtualizedList<CalendarWeekVirtualizedListItem>|null>(null);
  const weekCache = React.useRef<Map<number, CalendarWeekCacheEntry>>(new Map());
  const isMounted = React.useRef(true);

  /** @description Used to set the week to the context state and for displaying the start of week */
  const setWeek = useCalendarStore((state) => state.setWeek);

  /** 
   * @description Used to set the today pressed state for further processing in the root footer component when clicking the today button
   * -> handles the scrolling to the current week when the today button is pressed */
  const isTodayPressed = useCalendarStore((state) => state.isTodayPressed);
  const setIsTodayPressed = useCalendarStore((state) => state.setIsTodayPressed);

  /** @description Unmount ref to prevent memory leaks when component is unmounted */
  React.useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      weekRef.current = null;
      weekCache.current.clear();
    };
  }, []);

  React.useEffect(() => {
    isTodayPressed && weekRef.current?.scrollToIndex({ index: WEEKS_IN_PAST, animated: false });
  }, [isTodayPressed, weekRef]);

  /**
   * @private
   * @description Configures the viewability of the calendar week component
   * @function */
  const viewabilityConfig = React.useMemo(() => ({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 100
  }), []);

  /**
   * @private
   * @description Implements Least Recently Used (LRU) cache eviction strategy to prevent memory leaks
   * and maintain optimal performance. When the cache exceeds the maximum size limit, this function
   * removes the least recently accessed week entries to reduce memory footprint.
   * @performance The function performs an O(n log n) sort operation where n is the cache size.
   * This is acceptable since cache size is limited and trimming occurs infrequently.
   * @behavior
   * - Only triggers when cache size exceeds CACHE_SIZE (30 items)
   * - Removes oldest half of cache entries (15 items) to prevent frequent re-trimming
   * - Preserves most recently accessed weeks which are likely to be accessed again
   * - Uses timestamp-based LRU algorithm for fair eviction
   * @example
   * ```typescript
   * // Cache has 35 items, CACHE_SIZE = 30
   * trimCache(); 
   * // Result: Cache now has 15 items (oldest 20 removed)
   * @memory Prevents unbounded memory growth in scenarios where users extensively
   * navigate through calendar weeks over long periods
   * @function */
  const trimCache = React.useCallback(() => {
    if (weekCache.current.size <= CACHE_SIZE) return;
    
    /** @description Sort by last access time (oldest first) for LRU eviction */
    const sortedByAccess = Array.from(weekCache.current.entries()).sort((a, b) => a[1].lastAccess - b[1].lastAccess);
    const itemsToRemove = weekCache.current.size - (CACHE_SIZE / 2);
    const keysToRemove = sortedByAccess.slice(0, itemsToRemove).map(([key]) => key);
    
    /** @description Remove the items from the cache */
    keysToRemove.forEach((key) => weekCache.current.delete(key));
  }, []);

  /**
   * @private
   * @description Retrieves week data for a given relative index with intelligent LRU caching.
   * This function serves as the primary data source for the VirtualizedList, converting
   * relative week indices to actual calendar week objects while maintaining performance
   * through aggressive caching strategies.
   * @param {number} index - Relative week index where 0 represents the current week,
   * positive values represent future weeks, and negative values represent past weeks.
   * Range: -260 to +260 (approximately 10 years total)
   * @performance 
   * - Cache hit: O(1) - Immediate return with LRU timestamp update
   * - Cache miss: O(k) - Where k is complexity of date calculations (~5-10ms)
   * - Memory: Maintains maximum 30 week objects in memory (~60KB total)
   * @behavior
   * - **Cache Strategy**: Implements LRU (Least Recently Used) caching
   * - **Bounds Checking**: Handles extreme indices gracefully without crashes
   * - **Memory Safety**: Prevents cache access after component unmount
   * - **Error Recovery**: Falls back to current week on any calculation errors
   * - **Lazy Loading**: Only calculates weeks when actually requested
   * @caching
   * - Successful lookups update LRU timestamp for cache retention
   * - New calculations are cached with current timestamp
   * - Cache automatically trims when exceeding size limits
   * - Component unmount safely clears all cached data
   * @function */
  const getWeekByIndex = React.useCallback((
    index: number
  ): WeeksObjInfoProps => {
    /** @description Safety check: Prevent cache access after component unmount */
    if (!isMounted.current) return getWeeks({ now, weeksInPast: 0, weeksInFuture: 0, locale })[0];

    /** @description Cache hit: Update LRU timestamp and return cached data */
    const cached = weekCache.current.get(index);
    if (cached) {
      cached.lastAccess = Date.now();
      return cached.data;
    }
    
    try {
      /** @description Calculate the target date for this week index and generate week data for the target date */
      const date = index >= 0 ? addWeeks(now, index): subWeeks(now, Math.abs(index));
      const [week] = getWeeks({ now: date, weeksInPast: 0, weeksInFuture: 0, locale });
      
      /** @description Cache the result if component is still mounted and data is valid */
      if (isMounted.current && week) {
        weekCache.current.set(index, {
          data: week,
          lastAccess: Date.now()
        });

        trimCache();
      } return week || getWeeks({ now, weeksInPast: 0, weeksInFuture: 0, locale })[0];
    } catch (err) {
      /** @description Fallback to current week on any errors */
      captureException(err as Error, "error", true);
      return getWeeks({ now, weeksInPast: 0, weeksInFuture: 0, locale })[0];
    }
  }, [now, trimCache]);

  /**
   * @private
   * @description Handles the changing of the visible items during swiping gesture
   * @function */
  const onViewableItemsChanged = React.useCallback((info: {
    viewableItems: ViewToken<CalendarWeekVirtualizedListItem>[];
    changed: ViewToken<CalendarWeekVirtualizedListItem>[];
  }) => {
    /** @description Get the viewable item, which is used for further processing such as setting the week and start of week to the context state */
    const viewableItem = info.viewableItems.find(item => item.isViewable);
    if (!viewableItem?.item) return;

    /** @description Set the week and start of week to the context state for updating the root calendar header  */
    const week = getWeekByIndex(viewableItem.item.itemIndex);
    setWeek({
      number: week.week, 
      month: getMonth(week.startOfWeek) as Month, 
      year: getYear(week.startOfWeek), 
      startOfWeek: week.startOfWeek
    });
  }, [getWeekByIndex]);

  /**
   * @private
   * @description Handles the user interaction when pressing the today button in the root footer component
   * @see {@link components/footer/private/RootFooter}
   * @function */
  const onMomentumScrollEnd = React.useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    /** 
     * @description Reset the today pressed state for further processing in the root footer component
     * @see {@link components/footer/private/RootFooter} */
    if (isTodayPressed) setIsTodayPressed(false);
  }, [isTodayPressed, setIsTodayPressed]);

  /**
   * @private
   * @description Returns the total number of weeks to display
   * @function */
  const getItemCount = React.useCallback(() => TOTAL_WEEKS, []);

  /**
   * @private
   * @description Returns the item for the given index
   * @param {VirtualizedListItem} item
   * @param {number} index
   * @function */
  const getItem = React.useCallback((
    item: CalendarWeekVirtualizedListItem, 
    index: number
  ): CalendarWeekVirtualizedListItem => ({ itemIndex: index - WEEKS_IN_PAST }), []);

  /**
   * @private
   * @description Optional optimization that lets us skip measurement of dynamic content if you know the height of items
   * @param {VirtualizedListItem} _
   * @param {number} index - The index of the item.
   * @function */
  const getItemLayout = React.useCallback((item: CalendarWeekVirtualizedListItem, index: number) => ({
    length: WEEK_WIDTH,
    offset: WEEK_WIDTH * index,
    index
  }), []);

  /**
   * @private
   * @description Returns the key for the given item (calendar week day)
   * @param {VirtualizedListItem} item
   * @function */
  const keyExtractor = React.useCallback((
    item: CalendarWeekVirtualizedListItem
  ) => `${componentId}-${item.itemIndex}`, []);

  /**
   * @private
   * @description Renders the item (calendar week day) for the given index
   * @param {ListRenderItemInfo<VirtualizedListItem>} info
   * @function */
  const renderItem = React.useCallback((
    info: ListRenderItemInfo<CalendarWeekVirtualizedListItem>
  ) => {
    return (
      <View style={CalendarWeekStyle.view}>
        <View style={[GlobalContainerStyle.columnCenterCenter, CalendarWeekStyle.viewWeek, { width: 20, marginLeft: 10}]}>
          <TextBase 
            text={t("i18n.calendar.week")} 
            style={[GlobalTypographyStyle.headerSubtitle, { 
              color: infoColor,
              fontSize: 9
            }]} />
          <TextBase 
            text={getWeekByIndex(info.item.itemIndex).week.toString()} 
            style={[GlobalTypographyStyle.headerSubtitle, { 
              color: label,
              fontSize: 10
            }]} />
        </View>
        {getWeekByIndex(info.item.itemIndex).datesInWeek.map((date, idx) => (
          <CalendarWeekDay 
            key={`${componentId}-${KEYS.calendarWeekDay}-${date.now.toISOString()}`} 
            date={date} 
            idx={idx}
            bookingProgress={[0.4, 0.02, 0, 0.7, 0.2, 0.4, 0.85][idx]} />
        ))}
      </View>
    );
  }, [getWeekByIndex]);

  return (
    <VirtualizedList<CalendarWeekVirtualizedListItem>
      ref={weekRef}
      data={null}
      horizontal
      showsHorizontalScrollIndicator={false}
      initialScrollIndex={WEEKS_IN_PAST}
      snapToInterval={WEEK_WIDTH}
      snapToAlignment="start"
      decelerationRate="fast"
      getItemCount={getItemCount}
      getItem={getItem}
      getItemLayout={getItemLayout}
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={onViewableItemsChanged}
      onMomentumScrollEnd={onMomentumScrollEnd}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      removeClippedSubviews={true}
      maxToRenderPerBatch={1}
      windowSize={2}
      initialNumToRender={1}
      updateCellsBatchingPeriod={100}
      scrollEventThrottle={16}
      disableIntervalMomentum={true}
      pagingEnabled={false}
      bounces={false}
      overScrollMode="never" />
  );
};

export default CalendarWeek;