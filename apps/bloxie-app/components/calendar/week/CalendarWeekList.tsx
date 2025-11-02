import { addDays, format, startOfWeek } from "date-fns";
import * as React from "react";
import { Dimensions, FlatList, ListRenderItemInfo, Pressable, ScaledSize, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LegendList, LegendListRef, LegendListRenderItemProps } from "@legendapp/list";

import { useThemeColor, useThemeColors } from "@/hooks/theme/useThemeColor";
import { STYLES } from "@codemize/constants/Styles";
import { ConvexEventsAPIProps } from "@codemize/backend/Types";
import { getHours, getMinutesBetweenDates, getMinutesSinceMidnight, HoursProps, MINUTES_IN_DAY, MINUTES_IN_DAY_WITH_BORDER } from "@codemize/helpers/DateTime";
import { useCalendarContextStore } from "@/context/CalendarContext";

import { KEYS } from "@/constants/Keys";
import TextBase from "@/components/typography/Text";

import CalendarDayListStyle from "@/styles/components/calendar/day/CalendarDayList";
import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalTypographyStyle from "@/styles/GlobalTypography";

import { GlobalLayoutProps } from "@/types/GlobalLayout";
import ListItemDivider from "@/components/calendar/list/ListItemDivider";
import ListItemHour from "@/components/calendar/list/ListItemHour";
import { getLocalization } from "@/helpers/System";
import CalendarBlockedScope from "../CalendarBlockedScope";
import { convertFromConvex } from "@codemize/backend/Convert";
import { useUserContextStore } from "@/context/UserContext";
import ListRenderItemEvent from "../list/ListItemEvent";
import { Id } from "../../../../../packages/backend/convex/_generated/dataModel";
import ViewBase from "@/components/container/View";

/** 
 * @description Hour style height plus the additional border height!
 * @constant */
const SNAP_TO_INTERVAL: number = STYLES.calendarHourHeight;
const DIM: ScaledSize = Dimensions.get("window");

/**
 * @description Initialize hours for displaying in a vertical view 
 * @constant */
const locale = getLocalization();
const data: HoursProps[] = getHours(24, locale);

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type CalendarWeekListItemProps = CalendarWeekListProps & {
  item: HoursProps;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type CalendarWeekListProps = {
  startOfWeek?: Date;
  showHours?: boolean;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Week view displaying 7 days horizontally with hours and all-day sections
 * @since 0.0.2
 * @version 0.0.1
 * @param {Object} param0
 * @param {Date} param0.startOfWeek - Start of the week to display
 * @param {boolean} param0.showHours - Handles the visibility of the hours */
const CalendarWeekList = ({
  startOfWeek,
  showHours = true,
}: CalendarWeekListProps) => {
  const colors = useThemeColors();

  const ref = React.useRef<LegendListRef|null>(null);
  
  
  /** @description Get startOfWeek from Context instead of props to avoid re-renders */
  const startOfWeekFromContext = useCalendarContextStore((state) => state.week.startOfWeek);

  /**
   * @description Used for not displaying the flatlist in the bottom safe area */
  const insets = useSafeAreaInsets();

  /** 
   * @description Calculate width for each day column
   * Total available width minus hour column width, divided by 7 days */
  const dayWidth: number = (DIM.width - STYLES.calendarHourWidth) / 7;

  /** @description Total width of the calendar */
  const totalWidth: number = (DIM.width);

  /** 
   * @description Get the times (blocked times) for the current user from the convex database
   * @see {@link context/UserContext} */
  //const { times } = useUserContextStore((state) => state);



  /**
   * @description Generate array of 7 dates for the week
   * @constant */
  /*const weekDates = React.useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(startOfWeek, i));
  }, [startOfWeek]);*/

  /**
   * @description Pre-compute blocked times per day to avoid filtering on every render
   * This is the CRITICAL optimization - prevents 24×7 = 168 filter operations per scroll!
   * @constant */
  /*const blockedTimesByDay = React.useMemo(() => {
    if (!times) return new Map();
    
    const blockedMap = new Map<number, Array<{ start: any; end: any }>>();
    
    for (let day = 0; day < 7; day++) {
      const blocked = times.filter(({ isBlocked, day: timeDay }) => isBlocked && timeDay === day);
      if (blocked.length > 0) {
        blockedMap.set(day, blocked);
      }
    }
    
    return blockedMap;
  }, [times]);*/

  /**
   * @description Calculate initial scroll offset to center current time in viewport
   * Uses offset instead of index for precise positioning without visible scrolling
   * @constant */
  const contentOffsetY = React.useMemo(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    /** @description Calculate the exact position in pixels for the current time */
    const minutesSinceMidnight = currentHour * 60 + currentMinute;
    const pixelPosition = (minutesSinceMidnight / 60) * SNAP_TO_INTERVAL;
    
    /** @description Calculate viewport height and center offset */
    const viewportHeight = DIM.height - insets.top - insets.bottom - 30; // 30 is the all-day section height
    const centerOffset = viewportHeight / 2;
    
    /** @description Return offset to position current time in center */
    return Math.max(0, pixelPosition - centerOffset);
  }, [insets]);

  /**
   * @description Used to extract a unique key for a given item at the specified index
   * @function */
  const keyExtractor = React.useCallback((_: any, index: number) => index.toString(), []);

  /**
   * @description Used to render the item of the flatlist.
   * @param {ListRenderItemInfo<HoursProps>} param0 - The item to be rendered.
   * @param {number} param0.index - The index of the item.
   * @param {HoursProps} param0.item - The item to be rendered.
   * @function */
  const renderItem = React.useCallback(({ item }: LegendListRenderItemProps<HoursProps, string|undefined>) => {
    return (
      <></>
    );
  }, [showHours, startOfWeek]);

  return (
    <ViewBase>
      {/** @description All-day events section */}
      {/*<View style={{
        height: 30,
        flexDirection: 'row',
        borderBottomColor: colors.secondaryBorderColor,
        borderBottomWidth: 1
      }}>
        /* Left column for "Ganztags" label 
        <View style={{
          width: STYLES.calendarHourWidth,
          backgroundColor: colors.tertiaryBgColor,
          justifyContent: "center",
          alignItems: "center",
          borderRightWidth: 1,
          borderRightColor: colors.primaryBorderColor
        }}>
          <TextBase 
            text="Ganztags"
            style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: colors.infoColor }]} />
        </View>

        {/* 7 columns for all-day events 
        {weekDates.map((date, dayIndex) => (
          <View 
            key={`allday-${dayIndex}`}
            style={{
              maxWidth: dayWidth,
              minWidth: dayWidth,
              backgroundColor: colors.tertiaryBgColor,
              paddingHorizontal: 4,
              justifyContent: 'center',
              alignItems: "center",
              borderRightWidth: dayIndex < 6 ? 1 : 1,
              borderRightColor: colors.primaryBorderColor
            }}>
            {/* All-day events for this day would go here 
          </View>
        ))}
      </View>*/}

      {data && data.length > 0 && <LegendList
        ref={ref}
        estimatedListSize={{ height: STYLES.calendarHourHeight * data.length, width: totalWidth }}
        estimatedItemSize={STYLES.calendarHourHeight}
        showsVerticalScrollIndicator={false}
        style={{ paddingBottom: insets.bottom }}
        keyExtractor={keyExtractor}
        snapToAlignment="start"
        decelerationRate={"fast"}
        snapToInterval={SNAP_TO_INTERVAL}
        //initialScrollOffset={contentOffsetY}
        bounces={false}
        overScrollMode="never"
        data={data}
        renderItem={renderItem} />}
    </ViewBase>
  );
};

const CalendarWeekListItemDays = React.memo(({
  showHours,
  startOfWeek,
  item,
}: {
  showHours?: boolean;
  startOfWeek?: Date;
  item: HoursProps;
}) => {
  const colors = useThemeColors();
  const dayWidth: number = (DIM.width - STYLES.calendarHourWidth) / 7;
  const weekDates = React.useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(startOfWeek ?? new Date(), i));
  }, [startOfWeek]);
  
  return (
    <View style={{ flexDirection: 'row', height: "100%" }}>
    {weekDates.map((date, dayIndex, index) => (
      <View 
        key={`day-${dayIndex}-hour-${index}`}
        style={[CalendarDayListStyle.right, { 
          maxWidth: dayWidth,
          minWidth: dayWidth,
          borderRightWidth: dayIndex < 6 ? 1 : 0,
          borderRightColor: colors.primaryBorderColor,
        }]}>
                {[0, 30].map((minute) => (
                  <View key={`longpress-${dayIndex}-${index}-${minute}`} style={[GlobalContainerStyle.columnCenterCenter, { 
                    marginLeft: minute === 0 ? -6 : 0,
                  }]}>
                  <Pressable
                    key={`longpress-${dayIndex}-${index}-${minute}`}
                    delayLongPress={200}
                    disabled={false}
                    style={[CalendarDayListStyle.touchable, { 
                      top: minute === 0 ? 0 : STYLES.calendarHourHeight / 2,
                      borderBottomWidth: 1,
                      borderBottomColor: colors.primaryBorderColor,
                    }]}
                    onLongPress={() => {
                   
                    }} />
                  </View>
                ))}
        </View>
      ))}
    </View>
  );
}, () => true);

export default CalendarWeekList;


/**
 * 
        <View style={[GlobalContainerStyle.rowStartStart]}>
          {showHours && <View style={[GlobalContainerStyle.columnCenterStart, CalendarDayListStyle.left, { 
            borderColor: colors.primaryBorderColor,
            //backgroundColor: tertiaryBgColor
          }]}>
            {/** @description Renders the hours on the left side of the calendar *
            <ListItemHour
              key={`${KEYS.calendarHours}-${item.idx}`}
              {...item} />        
          </View>}

          {/** @description Renders the 7 day columns *
          <View style={{ flexDirection: 'row' }}>
            {weekDates.map((date, dayIndex) => (
              <View 
                key={`day-${dayIndex}-hour-${index}`}
                style={[CalendarDayListStyle.right, { 
                  maxWidth: dayWidth,
                  minWidth: dayWidth,
                  borderRightWidth: dayIndex < 6 ? 1 : 0,
                  borderRightColor: colors.primaryBorderColor
                }]}>
                {/** @description Renders the blocked times for the current user based on the day of the week *
                {/*index === 0 && blockedTimesByDay.get(date.getDay())?.map(({ start, end }) => 
                  <CalendarBlockedScope
                    key={`blocked-${dayIndex}-${start}`}
                    layout={{ 
                      top: getMinutesSinceMidnight(convertFromConvex(start)) / MINUTES_IN_DAY * MINUTES_IN_DAY_WITH_BORDER, 
                      left: 0, 
                      width: dayWidth - 1, 
                      height: getMinutesBetweenDates(convertFromConvex(start), convertFromConvex(end)) / MINUTES_IN_DAY * MINUTES_IN_DAY_WITH_BORDER
                    }}/>
                )*

                {/*index === 0 && date.getDay() === 3 && <ListRenderItemEvent 
                    key={`${"test"}-${index}`}
                    event={{
                      userId: "a" as Id<"users">,
                      title: `Event ${index}`,
                      descr: `Description ${index}`,
                      start: "2025-10-29T10:00:00.000Z",
                      end: "2025-10-29T10:30:00.000Z"
                    }} 
                    layout={{
                      top: 510,
                      left: 0, width: dayWidth - 1, height: 80 }}/>}

                {[0, 30].map((minute) => (
                  <Pressable
                    key={`longpress-${dayIndex}-${index}-${minute}`}
                    delayLongPress={200}
                    disabled={false}
                    style={[CalendarDayListStyle.touchable, { 
                      top: minute === 0 ? 0 : STYLES.calendarHourHeight / 2 
                    }]}
                    onLongPress={() => {
                      // Handle long press for creating events
                      const eventDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), index, minute, 0);
                      console.log('Long press on:', eventDate);
                    }} />
                ))}
                {Array.from({ length: 4 }).map((_, idx) => 
                  <ListItemDivider
                    key={`${KEYS.calendarHoursDivider}-${item.hour}-${dayIndex}-${idx}`}
                    showBorder={Boolean(idx % 2)} />
                )*
              </View>
            ))}
          </View>
        </View>
 **/