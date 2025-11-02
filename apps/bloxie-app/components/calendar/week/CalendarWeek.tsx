import { addWeeks, getMonth, getYear, Month, subWeeks } from "date-fns";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, FlatList, ListRenderItemInfo, NativeScrollEvent, NativeSyntheticEvent, ScrollView, Text, View, ViewToken, VirtualizedList } from "react-native";
import Animated, { useAnimatedRef, useAnimatedScrollHandler, useSharedValue, scrollTo, runOnUI, runOnJS } from "react-native-reanimated";
import { LegendList, LegendListRef, LegendListRenderItemProps } from "@legendapp/list";
import { getHours, getWeeks, HoursProps, WeeksObjInfoProps } from "@codemize/helpers/DateTime";
import { STYLES } from "@codemize/constants/Styles";

import { useCalendarContextStore } from "@/context/CalendarContext";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { getLocalization } from "@/helpers/System";

import CalendarWeekDay from "@/components/calendar/week/CalendarWeekDay";
import TextBase from "@/components/typography/Text";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import CalendarWeekStyle from "@/styles/components/calendar/week/CalendarWeek";
import ViewBase from "@/components/container/View";
import CalendarWeekList from "./CalendarWeekList";
import ListItemHour from "../list/ListItemHour";
import { KEYS } from "@/constants/Keys";
import CalendarDayListStyle from "@/styles/components/calendar/day/CalendarDayList";
import { highlightColor, useCalendarHighlight } from "@/hooks/calendar/useCalendarHighlight";
import { useShallow } from "zustand/react/shallow";
import GlobalTypographyStyle from "@/styles/GlobalTypography";


/** @description Dimensions of the window */
const DIM = Dimensions.get("window");
const WEEK_WIDTH = DIM.width;
const WEEKS_IN_PAST = 260;
const WEEKS_IN_FUTURE = 260;
const TOTAL_WEEKS = WEEKS_IN_PAST + WEEKS_IN_FUTURE;
const CACHE_SIZE = TOTAL_WEEKS; // Cache ALL weeks for maximum performance

/** 
 * @description Mock booking progress data (replace with real data later)
 * @todo delete this after implementing the real data */
const BOOKING_PROGRESS_DATA = [0.4, 0.02, 0, 0.7, 0.2, 0.4, 0.85];

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type CalendarWeekProps = {
  now: Date;
  componentId?: string;
}

/**
 * @private
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type CalendarWeekVirtualizedListItem = {
  itemIndex: number;
  week?: WeeksObjInfoProps; // Pre-computed week data for maximum performance
};

/**
 * @private
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type CalendarWeekCacheEntry = {
  data: WeeksObjInfoProps;
  lastAccess: number;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type CalendarWeekListHoursProps = {};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description High-performance calendar week component with intelligent range selection
 * Features:
 * - Single day selection via tap
 * - Range selection via long press + tap
 * @since 0.0.2
 * @version 0.0.1
 * @param {Object} param0 
 * @param {Date} param0.now The current date to display the initial calendar for
 * @param {string} param0.componentId The id of the component for different usage of the component
 * @component */
const CalendarWeek = ({
  now,
  componentId = "week",
}: CalendarWeekProps) => {
  const colors = useThemeColors();
  const locale = getLocalization();
  
  const weekRef = React.useRef<VirtualizedList<CalendarWeekVirtualizedListItem>|null>(null);
  const weekCache = React.useRef<Map<number, CalendarWeekCacheEntry>>(new Map());
  const isMounted = React.useRef(true);
  
  // Throttle state updates to reduce JS thread load during fast scrolling
  const lastStateUpdate = React.useRef<number>(0);
  const STATE_UPDATE_THROTTLE = 100; // ms between state updates

  /** @description Used to set the week to the context state and for displaying the start of week */
  const setWeek = useCalendarContextStore((state) => state.setWeek);
  
  /** @description Current visible week number for display in the header */
  const [currentWeekNumber, setCurrentWeekNumber] = React.useState(1);

  /** 
   * @description Used to set the today pressed state for further processing in the root footer component when clicking the today button
   * -> handles the scrolling to the current week when the today button is pressed */
  const isTodayPressed = useCalendarContextStore((state) => state.isTodayPressed);
  const setIsTodayPressed = useCalendarContextStore((state) => state.setIsTodayPressed);

  /** 
   * @description Unmount ref to prevent memory leaks when component is unmounted 
   * Also pre-populates the cache with all weeks for instant access during scrolling
   */
  React.useEffect(() => {
    isMounted.current = true;
    
    /** 
     * @description Pre-calculate and cache ALL weeks (5 years past + 5 years future)
     * This prevents on-demand calculations during fast scrolling, ensuring 60 FPS
     * The calculation happens ONCE on mount in the background
     */
    const prePopulateCache = () => {
      // Only populate if cache is empty (prevent re-population on re-renders)
      if (weekCache.current.size > 0) {
        console.log('ℹ️ Cache already populated, skipping...');
        return;
      }
      
      console.log('🚀 Pre-populating week cache for 520 weeks...');
      const startTime = Date.now();
      
      for (let i = -WEEKS_IN_PAST; i < WEEKS_IN_FUTURE; i++) {
        if (!isMounted.current) break; // Stop if component unmounts
        
        const date = i >= 0 ? addWeeks(now, i) : subWeeks(now, Math.abs(i));
        const [week] = getWeeks({ now: date, weeksInPast: 0, weeksInFuture: 0, locale });
        
        if (week) {
          weekCache.current.set(i, {
            data: week,
            lastAccess: Date.now()
          });
        }
      }
      
      const duration = Date.now() - startTime;
      console.log(`✅ Cache populated with ${weekCache.current.size} weeks in ${duration}ms`);
    };
    
    // Run cache population in next tick to not block initial render
    setTimeout(prePopulateCache, 100);
    
    return () => {
      isMounted.current = false;
      weekRef.current = null;
      weekCache.current.clear();
    };
  }, []); // ← Empty deps = only run ONCE on mount!

  /** @description Configures the viewability of the calendar week component */
  const viewabilityConfig = React.useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 200
  }).current;
  
  /** @description Configures the viewability for the header week list */
  const headerViewabilityConfig = React.useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 200 // Increased from 100ms to reduce callback frequency
  }).current;

  /**
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
  const trimCache = () => {
    if (weekCache.current.size <= CACHE_SIZE) return;
    
    /** @description Sort by last access time (oldest first) for LRU eviction */
    const sortedByAccess = Array.from(weekCache.current.entries()).sort((a, b) => a[1].lastAccess - b[1].lastAccess);
    const itemsToRemove = weekCache.current.size - (CACHE_SIZE / 2);
    const keysToRemove = sortedByAccess.slice(0, itemsToRemove).map(([key]) => key);
    
    /** @description Remove the items from the cache */
    keysToRemove.forEach((key) => weekCache.current.delete(key));
  };

  /**
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
  const getWeekByIndex = (
    index: number
  ): WeeksObjInfoProps => {
    /** @description Safety check: Prevent cache access after component unmount */
    if (!isMounted.current) return getWeeks({ now, weeksInPast: 0, weeksInFuture: 0, locale })[0];

    /** 
     * @description Cache hit: Simply return cached data
     * OPTIMIZED: No LRU timestamp updates needed since we cache ALL weeks and never evict
     */
    const cached = weekCache.current.get(index);
    if (cached) {
      return cached.data;
    }
    
    /** @description Calculate the target date for this week index */
    const date = index >= 0 ? addWeeks(now, index) : subWeeks(now, Math.abs(index));
    
    /** @description Generate week data for the target date */
    const [week] = getWeeks({ now: date, weeksInPast: 0, weeksInFuture: 0, locale });
    
    /** @description Cache the result if component is still mounted and data is valid */
    if (isMounted.current && week) {
      weekCache.current.set(index, {
        data: week,
        lastAccess: Date.now()
      });
      // trimCache() not needed - we cache ALL 520 weeks and never evict
    } return week;
  };

  // Refs für Scroll-Synchronisation
  const headerScrollRef = useAnimatedRef<Animated.FlatList<any>>();
  const contentScrollRef = useAnimatedRef<Animated.FlatList<any>>();
  const hoursScrollRef = useAnimatedRef<Animated.ScrollView>();
  const gridScrollRef = useAnimatedRef<Animated.ScrollView>();
  
  // Reanimated shared values für horizontales Scrolling
  const horizontalScrollX = useSharedValue(0);
  const isScrollingFromHeader = useSharedValue(false);
  const isScrollingFromContent = useSharedValue(false);
  
  // Reanimated shared values für vertikales Scrolling
  const verticalScrollY = useSharedValue(0);
  const isScrollingFromHours = useSharedValue(false);
  const isScrollingFromGrid = useSharedValue(false);

  const currentWeekIndex = useSharedValue(WEEKS_IN_PAST);
  const lastVisibleWeekIndex = React.useRef<number>(WEEKS_IN_PAST);

  const { t } = useTranslation();
  
  /** @description Initialize hours for displaying in a vertical view */
  const hoursData: HoursProps[] = React.useMemo(() => getHours(24, locale), [locale]);

  // Reanimated scroll handler für Hours ScrollView (links - vertikal)
  const hoursScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      if (isScrollingFromGrid.value) return;
      
      isScrollingFromHours.value = true;
      verticalScrollY.value = event.contentOffset.y;
      scrollTo(gridScrollRef, 0, event.contentOffset.y, false);
    },
    onEndDrag: () => {
      isScrollingFromHours.value = false;
    },
    onMomentumEnd: () => {
      isScrollingFromHours.value = false;
    }
  });

  // Reanimated scroll handler für Grid ScrollView (rechts - vertikal)
  const gridScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      if (isScrollingFromHours.value) return;
      
      isScrollingFromGrid.value = true;
      verticalScrollY.value = event.contentOffset.y;
      scrollTo(hoursScrollRef, 0, event.contentOffset.y, false);
    },
    onEndDrag: () => {
      isScrollingFromGrid.value = false;
    },
    onMomentumEnd: () => {
      isScrollingFromGrid.value = false;
    }
  });

  // Berechne Day Width für 7 Tage
  const dayWidth = React.useMemo(() => (DIM.width - STYLES.calendarHourWidth) / 7, []);
  const totalGridWidth = React.useMemo(() => dayWidth * 7, [dayWidth]);
  
  // Header-Wochen Daten für FlatList (pre-computed for maximum performance)
  const headerWeeksData = React.useMemo(() => 
    Array.from({ length: TOTAL_WEEKS }, (_, i) => {
      const index = i - WEEKS_IN_PAST;
      return { 
        itemIndex: index,
        week: getWeekByIndex(index) // Pre-compute from cache
      };
    }),
    [] // Empty deps = compute once after cache is populated
  );

  /**
   * @description Updates calendar context when horizontal scrolling ends
   * Uses pre-computed headerWeeksData for instant access (no calculations!)
   * Only updates if week actually changed (prevents unnecessary re-renders)
   * @param scrollX - Current horizontal scroll position in pixels
   */
  const updateContextFromScroll = React.useCallback((scrollX: number) => {
    // Calculate which week index is currently visible
    const visibleIndex = Math.round(scrollX / totalGridWidth);
    
    // Skip if same week is still visible (prevents unnecessary re-renders)
    if (visibleIndex === lastVisibleWeekIndex.current) return;
    lastVisibleWeekIndex.current = visibleIndex;
    
    // Get pre-computed week data (instant - no calculation!)
    const weekData = headerWeeksData[visibleIndex];
    if (!weekData?.week) return;
    
    const { week } = weekData;
    
    // Update context state
    setWeek({
      number: week.week,
      month: getMonth(week.startOfWeek) as Month,
      year: getYear(week.startOfWeek),
      startOfWeek: week.startOfWeek
    });
    setCurrentWeekNumber(week.week);
  }, [headerWeeksData, totalGridWidth, setWeek]);

  // Reanimated scroll handler für Header FlatList (oben)
  const headerScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      if (isScrollingFromContent.value) return;
      
      isScrollingFromHeader.value = true;
      horizontalScrollX.value = event.contentOffset.x;
      scrollTo(contentScrollRef, event.contentOffset.x, 0, false);
    },
    onEndDrag: (event) => {
      isScrollingFromHeader.value = false;
      // Update context when user lifts finger (not during momentum!)
      //runOnJS(updateContextFromScroll)(event.contentOffset.x);
    },
    onMomentumEnd: () => {
      isScrollingFromHeader.value = false;
    }
  });

  // Reanimated scroll handler für Content ScrollView (unten)
  const contentScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      if (isScrollingFromHeader.value) return;
      
      isScrollingFromContent.value = true;
      horizontalScrollX.value = event.contentOffset.x;
      scrollTo(headerScrollRef, event.contentOffset.x, 0, false);
    },
    onEndDrag: (event) => {
      isScrollingFromContent.value = false;
     // Update context when user lifts finger on content (not on header!)
      //runOnJS(updateContextFromScroll)(event.contentOffset.x);
    },
    onMomentumEnd: () => {
      isScrollingFromContent.value = false;
    }
  });
  
  // Render-Funktion für Header Wochen (optimized: no getWeekByIndex call!)
  const renderHeaderWeekItem = React.useCallback(({ item }: { item: CalendarWeekVirtualizedListItem }) => {
    // Use pre-computed week data from item, avoiding expensive cache lookups during render
    if (!item.week) return null;
    
    return (
      <ViewBase style={{ width: totalGridWidth }}>
        <CalendarWeekHorizontal 
          key={item.week.week.toString()} 
          item={item.week} />
      </ViewBase>
    );
  }, [totalGridWidth, colors.primaryBorderColor]);
  
  // Key extractor für Header FlatList
  const keyExtractorHeaderWeeks = React.useCallback(
    (item: CalendarWeekVirtualizedListItem) => `header-week-${item.itemIndex}`,
    []
  );
  
  // getItemLayout für Header FlatList (optimierte Performance)
  const getItemLayoutHeaderWeeks = React.useCallback(
    (_: any, index: number) => ({
      length: totalGridWidth,
      offset: totalGridWidth * index,
      index,
    }),
    [totalGridWidth]
  );

  // Render-Funktion für Hours-Liste (links)
  const renderHourItem = React.useCallback(({ 
    item 
  }: ListRenderItemInfo<HoursProps>) => (
    <CalendarWeekHourItem {...item} />
  ), []);

  // Render-Funktion für Grid-Row (eine Stunde mit 3 Wochen horizontal)
  const renderHourGridItem = React.useCallback(({ 
    item 
  }: ListRenderItemInfo<CalendarWeekVirtualizedListItem>) => (
    <CalendarWeekGridItem {...item} />
  ), []);

  
  /** @description Initialize current week number on mount and scroll to current week */
  React.useEffect(() => {
    const currentWeek = headerWeeksData[0].week;
    setCurrentWeekNumber(currentWeek.week);
    setWeek({
      number: currentWeek.week, 
      month: getMonth(currentWeek.startOfWeek) as Month, 
      year: getYear(currentWeek.startOfWeek), 
      startOfWeek: currentWeek.startOfWeek
    });
    
    // Scroll to current week position after mount
    setTimeout(() => {
      if (headerScrollRef.current) {
        headerScrollRef.current.scrollToIndex({ 
          index: WEEKS_IN_PAST, 
          animated: false 
        });
      }
    }, 100);
  }, []);
  
  /** @description Scroll to current week when today button is pressed */
  React.useEffect(() => {
    if (isTodayPressed) {
      // Scroll header FlatList to current week
      if (headerScrollRef.current) {
        headerScrollRef.current.scrollToIndex({ index: WEEKS_IN_PAST, animated: true });
      }
      
      // Scroll content grid FlatList to current week (synced with header)
      if (contentScrollRef.current) {
        contentScrollRef.current.scrollToIndex({ index: WEEKS_IN_PAST, animated: true });
      }
      
      // Also scroll the old VirtualizedList if it exists
      weekRef.current?.scrollToIndex({ index: WEEKS_IN_PAST, animated: false });
    }
  }, [isTodayPressed]);

  return (
    <ViewBase style={[GlobalContainerStyle.rowStartStart]}>
      <View style={{ flex: 1 }}>
        {/* OBERE REIHE: Test 43 + Horizontal scrollbare Wochentage */}
        <View style={[GlobalContainerStyle.rowStartStart, CalendarWeekStyle.header, {
          backgroundColor: "#fcfcfc",
          borderBottomColor: colors.primaryBorderColor
        }]}>
          {/* Links oben: Fixierte Box mit dynamischer Wochennummer - scrollt NIE */}
          <View style={[GlobalContainerStyle.columnCenterCenter, CalendarWeekStyle.weekNumber, { 
            borderRightColor: colors.primaryBorderColor
          }]}>
            <TextBase text={t("i18n.calendar.week")} style={[GlobalTypographyStyle.headerSubtitle, { fontSize: 9, color: colors.infoColor }]} />
            <TextBase text={currentWeekNumber.toString()} style={[GlobalTypographyStyle.headerSubtitle, { fontSize: 10, color: colors.infoColor }]} />
          </View>

          {/* Rechts oben: Horizontal scrollbare Wochentage mit virtualisierter Liste */}
          <Animated.FlatList
            ref={headerScrollRef}
            data={headerWeeksData}
            horizontal
            showsHorizontalScrollIndicator={false}
            onScroll={headerScrollHandler}
            snapToInterval={totalGridWidth}
            snapToAlignment="start"
            decelerationRate={"fast"}
            pagingEnabled={false}
            bounces={false}
            keyExtractor={keyExtractorHeaderWeeks}
            renderItem={renderHeaderWeekItem}
            getItemLayout={getItemLayoutHeaderWeeks}
            removeClippedSubviews={true}
            overScrollMode="never"
            scrollEventThrottle={16}
            maxToRenderPerBatch={1}
            windowSize={21}
            initialNumToRender={3}
            //updateCellsBatchingPeriod={50}
            style={{ height: STYLES.calendarHeaderHeight, borderBottomWidth: 1, borderBottomColor: colors.primaryBorderColor }} />
        </View>

        {/* UNTERE REIHE: Stunden (links fixiert) + Content Grid (rechts scrollbar) */}
        <View style={[GlobalContainerStyle.rowStartStart, { flex: 1 }]}>
          {/* Links unten: Vertikal scrollbare Stunden */}
          <Animated.ScrollView
            ref={hoursScrollRef}
            showsVerticalScrollIndicator={false}
            onScroll={hoursScrollHandler}
            scrollEventThrottle={16}
            bounces={false}
            style={{ width: STYLES.calendarHourWidth }}>
            {hoursData.map((item) => (
              <CalendarWeekHourItem key={`hour-${item.idx}`} {...item} />
            ))}
          </Animated.ScrollView>

          {/* Rechts unten: Vertikal + Horizontal scrollbar (Grid) */}
          <Animated.ScrollView
            ref={gridScrollRef}
            showsVerticalScrollIndicator={false}
            onScroll={gridScrollHandler}
            scrollEventThrottle={16}
            bounces={false}
            style={{ position: 'relative', width: totalGridWidth 
              //flex: 1
            }}>

            {/* ===== LAYER 1: Background - Stunden-Raster (NUR 1x!) ===== */}
            <View style={{ 
              position: 'absolute',
              left: 0,
              top: 0,
              width: totalGridWidth,
              height: hoursData.length * STYLES.calendarHourHeight,
              zIndex: 0  // Hinter den Wochen
            }}>
              {hoursData.map((hour) => (
                <View 
                  key={`hour-line-${hour.idx}`}
                  style={{ 
                    height: STYLES.calendarHourHeight,
                    borderBottomWidth: 0.5,
                    borderBottomColor: colors.primaryBorderColor
                  }} 
                />
              ))}
            </View>

            {/* Horizontal scrollbare Wochen */}
            <Animated.FlatList
              ref={contentScrollRef}
              data={headerWeeksData}
              horizontal
              showsHorizontalScrollIndicator={false}
              onScroll={contentScrollHandler}
              snapToInterval={totalGridWidth}
              snapToAlignment="start"
              decelerationRate="fast"
              pagingEnabled={false}
              bounces={false}
              keyExtractor={keyExtractorHeaderWeeks}
              renderItem={renderHourGridItem}
              getItemLayout={getItemLayoutHeaderWeeks}
              initialScrollIndex={WEEKS_IN_PAST}
              removeClippedSubviews={true}
              scrollEventThrottle={16}
              maxToRenderPerBatch={1}
              windowSize={21}
              initialNumToRender={3}
              overScrollMode="never"
              style={{ 
                height: hoursData.length * STYLES.calendarHourHeight,  // Exakte Höhe
                zIndex: 1  // Über dem Background
              }} />
          </Animated.ScrollView>

          {/*<Animated.ScrollView
            ref={contentScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            onScroll={contentScrollHandler}
            snapToInterval={totalGridWidth}
            snapToAlignment="start"
            decelerationRate={"fast"}
            pagingEnabled={false}
            bounces={false}
            scrollEventThrottle={16}
            style={{ width: totalGridWidth }}>
            <Animated.FlatList
              ref={gridListRef}
              data={hoursData}
              showsVerticalScrollIndicator={false}
              snapToInterval={STYLES.calendarHourHeight}
              onScroll={gridScrollHandler}
              bounces={false}
              keyExtractor={keyExtractorHours}
              renderItem={renderGridItem}
              getItemLayout={getItemLayoutHours}
              removeClippedSubviews={true}
              scrollEventThrottle={16}
              maxToRenderPerBatch={hoursData.length}
              windowSize={21}
              initialNumToRender={hoursData.length}
              style={{ width: totalGridWidth, backgroundColor: 'blue' }} />
            </Animated.ScrollView>*/}
        </View>
      </View>

      {/*<VirtualizedList<CalendarWeekVirtualizedListItem>
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
        removeClippedSubviews={false}
        maxToRenderPerBatch={2}
        windowSize={3}
        initialNumToRender={1}
        updateCellsBatchingPeriod={50}
        scrollEventThrottle={16}
        disableIntervalMomentum={true}
        pagingEnabled={false}
        bounces={false}
        overScrollMode="never" />*/}
    </ViewBase>
  );
};

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @description Week item component
 * @since 0.0.2
 * @version 0.0.2
 * @param {Object} param0
 * @param {WeeksObjInfoProps} param0.item - The week item to display
 * @param {string} param0.borderColor - Border color for the component
 * @component */
const CalendarWeekHorizontal = React.memo(({ 
  item,
}: { item: WeeksObjInfoProps; }) => {
  const colors = useThemeColors();

  /**
   * @description Determines the visual highlight color for this day
   * Priority: Range states override single selection
   * Get the store values with useShallow to prevent infinite loops 
   * @see {@link hooks/calendar/useCalendarHighlight} */
  const { selected, rangeStart, rangeEnd } = useCalendarContextStore(
    useShallow((state) => ({
      selected: state.selected,
      rangeStart: state.rangeStart,
      rangeEnd: state.rangeEnd
    }))
  );

  /** @description Calculate all highlights once (instead of 7 times in each child) */
  const highlights = React.useMemo(() => 
    item.datesInWeek.map(date => highlightColor(date.now, colors, selected, rangeStart, rangeEnd)),
    [item.datesInWeek, colors, selected, rangeStart, rangeEnd]
  );

  return (
    <View style={[GlobalContainerStyle.rowCenterCenter, CalendarWeekStyle.view, CalendarWeekStyle.header, { 
      backgroundColor: "#fcfcfc",
      borderBottomColor: colors.primaryBorderColor,
    }]}>
      {item.datesInWeek.map((date, idx) => (
        <CalendarWeekDay 
          key={`${item.week}-${idx}`} 
          idx={idx}
          date={date}
          highlight={highlights[idx]}
          bookingProgress={BOOKING_PROGRESS_DATA[idx]} />
      ))}
    </View>
  );
}, (prevProps, nextProps) => {
  // Only re-render if the week number or border color actually changes
  return prevProps.item.week === nextProps.item.week &&
         prevProps.item.startOfWeek.getTime() === nextProps.item.startOfWeek.getTime()
});

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @description Week item component - Renders the hours on the left side of the calendar without scrolling
 * @since 0.0.2
 * @version 0.0.2
 * @param {HoursProps} param0
 * @param {number} param0.idx - Index of the hour
 * @param {string} param0.hour - Hour of the day
 * @component */
const CalendarWeekHourItem = React.memo(({
  idx,
  hour
}: HoursProps) => {
  const colors = useThemeColors();
  return (
    <View style={[GlobalContainerStyle.rowStartStart]}>
      <View style={[GlobalContainerStyle.columnCenterStart, CalendarDayListStyle.left, { 
        borderColor: colors.primaryBorderColor
      }]}>
        <ListItemHour
          key={`${KEYS.calendarHours}-${idx}`}
          idx={idx}
          hour={hour} />        
      </View>
    </View>
  );
}, () => true);

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @description Week grid column - Renders one complete week with 24 hours vertically
 * @since 0.0.2
 * @version 0.0.3
 * @param {CalendarWeekVirtualizedListItem} param0
 * @component */
const CalendarWeekGridItem = React.memo(({
  itemIndex,
  week
}: CalendarWeekVirtualizedListItem) => {
  const colors = useThemeColors();
  const totalGridWidth = ((DIM.width - STYLES.calendarHourWidth) / 7) * 7;
  const hoursData: HoursProps[] = React.useMemo(() => getHours(24, getLocalization()), []);


  if (!week) return null;
  
  return (
    <View style={{ 
      width: totalGridWidth,
      height: hoursData.length * STYLES.calendarHourHeight,
      backgroundColor: 'transparent',  // Transparent, Background zeigt durch!
    }}>
      {/* HIER kommen später deine Events/Termine pro Woche */}
      {/* Für jetzt: Debug-Text */}
      {[{id: "1", title: "Test", time: new Date(), duration: 200}].map((event) => {
        //const topPosition = calculateEventPosition(event.time);
        //const eventHeight = calculateEventHeight(event.duration);
        
        return (
          <>
          <View 
            style={{
              position: 'absolute',
              top: 400,
              height: 200,
              left: 0,
              padding: 4,
              width: ((DIM.width - STYLES.calendarHourWidth - 7) / 7) - 1,
              backgroundColor: '#ffda60',
              // ...
            }}>
            <Text style={{ fontSize: 10 }}>{"Test"}</Text>
          </View>
          {week.week === 44 && <View 
            style={{
              position: 'absolute',
              top: 200,
              height: 300 - 1,
              padding: 4,
              left: ((DIM.width - STYLES.calendarHourWidth - 7) / 7),
              width: ((DIM.width - STYLES.calendarHourWidth - 7) / 7) - 1,
              backgroundColor: '#ff65ed',
              // ...
            }}>
            <Text style={{ fontSize: 10 }}>{"Test"}</Text>
          </View>}
          <View 
            style={{
              position: 'absolute',
              top: 500,
              height: 130,
              padding: 4,
              left: ((DIM.width - STYLES.calendarHourWidth - 7) / 7),
              width: ((DIM.width - STYLES.calendarHourWidth - 7) / 7) - 1,
              backgroundColor: '#65ccff',
              // ...
            }}>
            <Text style={{ fontSize: 10 }}>{"Test"}</Text>
          </View>
          <View 
            style={{
              position: 'absolute',
              top: 250,
              height: 100,
              padding: 4,
              left: ((DIM.width - STYLES.calendarHourWidth - 7) / 7) * 2,
              width: ((DIM.width - STYLES.calendarHourWidth - 7) / 7) - 1,
              backgroundColor: '#65ffbc',
              // ...
            }}>
            <Text style={{ fontSize: 10 }}>{"Test"}</Text>
          </View>
          </>
        );
      })}
    </View>
  );
}, (prevProps, nextProps) => {
  return prevProps.itemIndex === nextProps.itemIndex &&
         prevProps.week?.week === nextProps.week?.week;
});

export default CalendarWeek;