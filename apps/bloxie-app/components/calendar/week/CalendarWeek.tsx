import { addWeeks, getMonth, getYear, Month, subWeeks } from "date-fns";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, FlatList, ListRenderItemInfo, NativeScrollEvent, NativeSyntheticEvent, ScrollView, Text, View, ViewToken, VirtualizedList } from "react-native";
import Animated, { useAnimatedRef, useAnimatedScrollHandler, useSharedValue, scrollTo, runOnUI, runOnJS } from "react-native-reanimated";
import { LegendList, LegendListRef, LegendListRenderItemProps } from "@legendapp/list";
import { DatesInWeekInfoProps, getHours, getWeeks, HoursProps, WeeksObjInfoProps } from "@codemize/helpers/DateTime";
import { STYLES } from "@codemize/constants/Styles";

import { CalendarCachedWeeksHorizontalProps, useCalendarContextStore, store, WEEKS_IN_PAST } from "@/context/CalendarContext";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { getLocalization } from "@/helpers/System";

import TextBase from "@/components/typography/Text";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import CalendarWeekStyle from "@/styles/components/calendar/week/CalendarWeek";
import ViewBase from "@/components/container/View";
import ListItemHour from "../list/ListItemHour";
import { KEYS } from "@/constants/Keys";
import CalendarDayListStyle from "@/styles/components/calendar/day/CalendarDayList";
import { highlightColor, useCalendarHighlight } from "@/hooks/calendar/useCalendarHighlight";
import { useShallow } from "zustand/react/shallow";
import GlobalTypographyStyle from "@/styles/GlobalTypography";
import CalendarWeekNumber from "@/components/calendar/CalendarWeekNumber";
import CalendarWeekHorizontalItem from "@/components/calendar/CalendarWeekHorizontalItem";
import CalendarWeekHorizontalList, { CalendarWeekHorizontalListProps } from "../CalendarWeekHorizontalList";
import CalendarWeekVerticalHoursList from "../CalendarWeekVerticalHoursList";
import CalendarHourGrid from "../CalendarHourGrid";
import CalendarWeekVerticalGridList from "../CalendarWeekHorizontalGridList";
import CalendarHeaderMonth from "../CalendarHeaderLeft";
import Divider from "@/components/container/Divider";
import CalendarWeekHorizontalGridList from "../CalendarWeekHorizontalGridList";


/** @description Dimensions of the window */
const DIM = Dimensions.get("window");

const DAY_WIDTH = (DIM.width - STYLES.calendarHourWidth) / 7;
const TOTAL_GRID_WIDTH = DAY_WIDTH * 7;

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
  
  /** 
   * @description Used to set the week to the context state and for displaying the start of week
   * @see {@link context/CalendarContext} */
  const setWeek = useCalendarContextStore((state) => state.setWeek);

  /** 
   * @description Used to get the cached weeks from the context state for maximum performance during scrolling 
   * @see {@link context/CalendarContext} */
  //const cached = useCalendarContextStore((state) => state.cached);
 const weeksHorizontal = useCalendarContextStore((state) => state.cached.weeksHorizontal);

  /** 
   * @description Used to set the today pressed state for further processing in the root footer component when clicking the today button
   * -> handles the scrolling to the current week when the today button is pressed
   * @see {@link context/CalendarContext} */
  const isTodayPressed = useCalendarContextStore((state) => state.isTodayPressed);



  // Refs für Scroll-Synchronisation
  const headerScrollRef = useAnimatedRef<Animated.FlatList<CalendarCachedWeeksHorizontalProps>>();
  const contentScrollRef = useAnimatedRef<Animated.FlatList<CalendarCachedWeeksHorizontalProps>>();
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

  const lastVisibleWeekIndex = React.useRef<number>(WEEKS_IN_PAST);


  // Reanimated scroll handler für Hours ScrollView (links - vertikal)
  const onScrollHoursVertical = useAnimatedScrollHandler({
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

  // Header-Wochen Daten für FlatList (pre-computed for maximum performance)
  /*const headerWeeksData = React.useMemo(() => 
    Array.from({ length: TOTAL_WEEKS }, (_, i) => {
      const index = i - WEEKS_IN_PAST;
      return { 
        itemIndex: index,
        week: getWeekByIndex(index) // Pre-compute from cache
      };
    }),
    [] // Empty deps = compute once after cache is populated
  );*/

  /**
   * @description Updates calendar context when horizontal scrolling ends
   * Uses pre-computed headerWeeksData for instant access (no calculations!)
   * Only updates if week actually changed (prevents unnecessary re-renders)
   * @param scrollX - Current horizontal scroll position in pixels
   */
  const updateContextFromScroll = React.useCallback((scrollX: number) => {
    // Calculate which week index is currently visible
    const visibleIndex = Math.round(scrollX / TOTAL_GRID_WIDTH);
    
    // Skip if same week is still visible (prevents unnecessary re-renders)
    if (visibleIndex === lastVisibleWeekIndex.current) {
      return;
    }
    lastVisibleWeekIndex.current = visibleIndex;
    
    // Get pre-computed week data (instant - no calculation!)
    const weekData = weeksHorizontal[visibleIndex];
    
    if (!weekData?.week) {
      return;
    }
    
    const { week } = weekData;
    
    // Update context state
    setWeek({
      number: week.week,
      month: getMonth(week.startOfWeek) as Month,
      year: getYear(week.startOfWeek),
      startOfWeek: week.startOfWeek,
      endOfWeek: week.endOfWeek
    });
  }, [weeksHorizontal, setWeek]);

  // Reanimated scroll handler für Header FlatList (oben)
  const onScrollHorizontalList = useAnimatedScrollHandler<{
    lastScrollX: number;
    lastVisibleIndex: number;
  }>({
    onScroll: (event, context) => {
      'worklet';
      if (isScrollingFromContent.value) return;
      
      // Berechne aktuellen Index basierend auf Scroll-Position
      const currentIndex = Math.round(event.contentOffset.x / TOTAL_GRID_WIDTH);
      context.lastScrollX = event.contentOffset.x;
      context.lastVisibleIndex = currentIndex;
      
      
      isScrollingFromHeader.value = true;
      horizontalScrollX.value = event.contentOffset.x;
      contentScrollRef.current && scrollTo(contentScrollRef, event.contentOffset.x, 0, false);
    },
    /*onEndDrag: (event) => {
      'worklet';
      isScrollingFromHeader.value = false;
      
      // Update context when user lifts finger (not during momentum!)
      runOnJS(updateContextFromScroll)(event.contentOffset.x);
    },*/
    onMomentumEnd: (event, context) => {
      'worklet';
      isScrollingFromHeader.value = false;
      
      // Finale Position nach Momentum
      const finalIndex = Math.round(event.contentOffset.x / TOTAL_GRID_WIDTH);
      context.lastVisibleIndex = finalIndex;

      runOnJS(updateContextFromScroll)(event.contentOffset.x);


    }
  });

  // Reanimated scroll handler für Content ScrollView (unten)
  const onScrollContentList = useAnimatedScrollHandler({
    onScroll: (event) => {
      'worklet';
      if (isScrollingFromHeader.value) return;
      
      isScrollingFromContent.value = true;
      horizontalScrollX.value = event.contentOffset.x;
      scrollTo(headerScrollRef, event.contentOffset.x, 0, false);
    },
    onEndDrag: (event) => {
      isScrollingFromContent.value = false;
    },
    onMomentumEnd: (event) => {
      if (isScrollingFromHeader.value) return;
      isScrollingFromContent.value = false;
      console.log("updateContextFromScroll 2");
      runOnJS(updateContextFromScroll)(event.contentOffset.x);
    }
  });




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
      //weekRef.current?.scrollToIndex({ index: WEEKS_IN_PAST, animated: false });
    }
  }, [isTodayPressed]);

  /**
   * @description Determines the visual highlight color for this day
   * Priority: Range states override single selection
   * Get the store values with useShallow to prevent infinite loops 
   * @see {@link hooks/calendar/useCalendarHighlight} */
   /*const { selected } = useCalendarContextStore(
    useShallow((state) => ({
      selected: state.selected
    }))
  );*/
  return (
    <ViewBase style={[GlobalContainerStyle.rowStartStart]}>
      <ViewBase>
        <View style={[GlobalContainerStyle.rowStartStart, CalendarWeekStyle.header, {
         //backgroundColor: "#f9f9f9",
          borderBottomColor: colors.primaryBorderColor
        }]}>
          <CalendarWeekNumber />
          <CalendarWeekHorizontalList 
            ref={headerScrollRef as React.Ref<LegendListRef>}
            selected={new Date()}
            onScroll={onScrollHorizontalList} />
        </View>
        <ViewBase style={[GlobalContainerStyle.rowStartStart]}>
          <CalendarWeekVerticalHoursList
            ref={hoursScrollRef as React.Ref<Animated.ScrollView>}
            onScroll={onScrollHoursVertical} />
          <View style={GlobalContainerStyle.columnStartStart}>
          {/*<Animated.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            onScroll={() => {
              console.log("SCROLL");
            }}
            scrollEventThrottle={16}
            bounces={false}
            style={{ borderBottomColor: colors.primaryBorderColor, borderBottomWidth: 1 }}>
              <View style={{ width: TOTAL_GRID_WIDTH, backgroundColor: "white",               height: 30,
              borderBottomColor: colors.primaryBorderColor,
              borderBottomWidth: 1 }} />
              <View style={{ width: TOTAL_GRID_WIDTH, backgroundColor: "lightgray" }} />
          </Animated.ScrollView>*/}
            <Animated.ScrollView
              ref={gridScrollRef}
              showsVerticalScrollIndicator={false}
              onScroll={gridScrollHandler}
              snapToInterval={STYLES.calendarHourHeight / 2}
              scrollEventThrottle={16}
              bounces={false}
              style={{ width: TOTAL_GRID_WIDTH }}>
                <CalendarWeekHorizontalGridList
                  ref={contentScrollRef as React.Ref<LegendListRef>}
                  onScroll={onScrollContentList} />
            </Animated.ScrollView>
          </View>
        </ViewBase>
      </ViewBase>
    </ViewBase>
  );
};

export default CalendarWeek;
