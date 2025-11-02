import * as React from "react";
import { View } from "react-native";
import { useShallow } from "zustand/react/shallow";
import { isEqual, isWeekend, isWithinInterval, max, min } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircle } from "@fortawesome/pro-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

import { DatesInWeekInfoProps } from "@codemize/helpers/DateTime";

import { useCalendarContextStore } from "@/context/CalendarContext";
import { useCalendarHighlight } from "@/hooks/calendar/useCalendarHighlight";

import TouchableHaptic from "@/components/button/TouchableHaptic";
import ChartDonutProgress from "@/components/chart/ChartDonutProgress";
import TextBase from "@/components/typography/Text";

import CalendarWeekDayStyle from "@/styles/components/calendar/week/CalendarWeekDay";
import GlobalTypographyStyle from "@/styles/GlobalTypography";
import GlobalContainerStyle from "@/styles/GlobalContainer";

/** @description Pre-computed icon props for better performance */
const CIRCLE_ICON = faCircle as IconProp;
const ICON_SIZE = 4;
const ICON_COLOR_DARK = "#303030";
const ICON_COLOR_RED = "#D15555";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type CalendarWeekDayProps = {
  date: DatesInWeekInfoProps;
  idx: number;
  bookingProgress?: number;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description High-performance calendar day component with intelligent range selection
 * Features:
 * - Single day selection via tap
 * - Range selection via long press + tap
 * - Smart weekend filtering for business logic
 * - Visual continuity when ranges end on weekends
 * - Event indicators for user activities
 * - Optimized re-rendering for performance
 * @since 0.0.2
 * @version 0.0.1
 * @param {Object} param0 Component props
 * @param {DatesInWeekReturn} param0.date Date object with day information
 * @param {number} param0.idx Day index within the week (0-6) 
 * @param {number} param0.bookingProgress Booking progress (0 to 1) for donut chart. 0 = no bookings, 1 = fully booked
 * @component */
const CalendarWeekDay = ({
  date,
  idx,
  bookingProgress = 0,
}: CalendarWeekDayProps) => {
  const rangeStartRef = React.useRef<Date|null>(null);

  /** 
   * @description Calendar store actions for date selection and range management
   * @see {@link context/CalendarContext} */
  const setSelected = useCalendarContextStore((state) => state.setSelected);
  const setRangeStart = useCalendarContextStore((state) => state.setRangeStart);
  const setRangeEnd = useCalendarContextStore((state) => state.setRangeEnd);

  /**
   * @description Determines the visual highlight color for this day
   * Priority: Range states override single selection
   * @see {@link hooks/calendar/useCalendarHighlight} */
  const highlight = "#303030"; //useCalendarHighlight(date.now);

  /** 
   * @description Handles the events of the day -> Used for highlighting the members of the event as a circle
   * @see {@link hooks/calendar/useCalendarStore}
   * @see {@link helpers/Events/getEventsByNow} */
  //const events = useCalendarStore((state) => state.events);
  /*const memoizedEvents = React.useMemo(() => 
    getEventsByNow(events, date.now)
      .filter((event, index, arr) => 
        !event.isListHeader && 
        arr.findIndex(e => e.userId === event.userId) === index
      ), [events, date.now]);*/

  /**
   * @description Handles the user settings. Used for highlighting the members of the event
   * @see {@link context/UserContext} */
  /*const settings = useUserContextStore((state) => state.settings);
  const memoizedSettings = React.useMemo(() => settings, [settings]);*/

  /*React.useEffect(() => {
    rangeStartRef.current = rangeStart;
  }, [rangeStart]);*/
  
  /**
   * @description Handles tap interaction on calendar day
   * Behavior:
   * - Sets this day as selected
   * - If range selection is active, completes the range */
  const onPress = () => {
    setSelected(date.now);
    setRangeEnd(date.now);

    /** @description If the range start is the same as the selected day, the range selection will be stopped => Single day selection */
    rangeStartRef.current && isEqual(rangeStartRef.current, date.now) && setRangeStart(null);
  };
  
  /**
   * @description Handles long press interaction to initiate range selection
   * Behavior:
   * - Starts a new range selection with this day as the start point
   * - Previous range selections are reset */
  const onLongPress = () => setRangeStart(date.now);

  // Memoize styles to prevent recalculation on every render
  const shortTextStyle = React.useMemo(() => 
    [GlobalTypographyStyle.headerSubtitle, CalendarWeekDayStyle.shortText, { color: highlight }],
    [highlight]
  );
  
  const numberStyle = React.useMemo(() => 
    [GlobalTypographyStyle.headerSubtitle, CalendarWeekDayStyle.number, { color: highlight }],
    [highlight]
  );
  
  const backgroundColor = React.useMemo(() => `${highlight}10`, [highlight]);

  return (
    <TouchableHaptic 
      onPress={onPress}
      onLongPress={onLongPress}
      hitSlop={10}
      style={CalendarWeekDayStyle.touchable}>
        <TextBase 
          text={date.shortText} 
          style={shortTextStyle} />
        <ChartDonutProgress
          size={26}
          strokeWidth={1.25}
          progress={bookingProgress}
          color={highlight}
          backgroundColor={backgroundColor}
          animated={false}>
          <TextBase 
            type="subtitle" 
            text={date.number.toString()}
            style={numberStyle} />
        </ChartDonutProgress>
        <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 2 }]}>
          <FontAwesomeIcon icon={CIRCLE_ICON} size={ICON_SIZE} color={ICON_COLOR_DARK} />
          <FontAwesomeIcon icon={CIRCLE_ICON} size={ICON_SIZE} color={ICON_COLOR_RED} />
        </View>
    </TouchableHaptic>
  )
}

/**
 * @description Custom comparison function for React.memo to prevent unnecessary re-renders
 * Only re-render if the actual date or booking progress changes, not just the object reference
 * Note: We don't compare highlight color here because it's derived from date + context,
 * and context changes will trigger re-render anyway through useCalendarHighlight hook
 */
const arePropsEqual = (
  prevProps: CalendarWeekDayProps, 
  nextProps: CalendarWeekDayProps
): boolean => {
  // Compare date by ISO string (value equality, not reference)
  // This is the most important comparison for preventing unnecessary re-renders
  const isSameDate = prevProps.date.now.toISOString() === nextProps.date.now.toISOString();
  
  // Compare other primitive props
  const isSameIdx = prevProps.idx === nextProps.idx;
  const isSameProgress = prevProps.bookingProgress === nextProps.bookingProgress;
  
  // Only re-render if something actually changed
  return isSameDate && isSameIdx && isSameProgress;
};

export default React.memo(CalendarWeekDay, arePropsEqual);