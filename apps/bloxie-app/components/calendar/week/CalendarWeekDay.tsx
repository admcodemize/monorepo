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
 * @version 0.0.2
 * @type */
export type CalendarWeekDayProps = {
  date: DatesInWeekInfoProps;
  idx: number;
  bookingProgress?: number;
  highlight?: string;
  onSelect?: (date: Date) => void;
  onRangeStart?: (date: Date | null) => void;
  onRangeEnd?: (date: Date) => void;
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
 * @version 0.0.2
 * @param {Object} param0 Component props
 * @param {DatesInWeekReturn} param0.date Date object with day information
 * @param {number} param0.idx Day index within the week (0-6) 
 * @param {number} param0.bookingProgress Booking progress (0 to 1) for donut chart. 0 = no bookings, 1 = fully booked
 * @param {string} param0.highlight Highlight color for the day
 * @param {Function} param0.onSelect Callback function to handle date selection
 * @param {Function} param0.onRangeStart Callback function to handle range start
 * @param {Function} param0.onRangeEnd Callback function to handle range end
 * @component */
const CalendarWeekDay = ({
  date,
  idx,
  bookingProgress = 0,
  highlight = "#303030",
  onSelect = () => {},
  onRangeStart = () => {},
  onRangeEnd = () => {},
}: CalendarWeekDayProps) => {
  const rangeStartRef = React.useRef<Date|null>(null);

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
    onSelect(date.now);
    onRangeEnd(date.now);

    /** @description If the range start is the same as the selected day, the range selection will be stopped => Single day selection */
    rangeStartRef.current && isEqual(rangeStartRef.current, date.now) && onRangeStart(null);
  };
  
  /**
   * @description Handles long press interaction to initiate range selection
   * Behavior:
   * - Starts a new range selection with this day as the start point
   * - Previous range selections are reset */
  const onLongPress = () => onRangeStart(date.now);

  return (
    <TouchableHaptic 
      onPress={onPress}
      onLongPress={onLongPress}
      hitSlop={10}
      style={CalendarWeekDayStyle.touchable}>
        <TextBase 
          text={date.shortText} 
          style={[GlobalTypographyStyle.headerSubtitle, CalendarWeekDayStyle.shortText, { color: highlight }]} />
        <CalendarWeekDayChart 
          date={date} 
          bookingProgress={bookingProgress} 
          highlight={highlight} />
        <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 2 }]}>
          <FontAwesomeIcon icon={CIRCLE_ICON} size={ICON_SIZE} color={ICON_COLOR_DARK} />
          <FontAwesomeIcon icon={CIRCLE_ICON} size={ICON_SIZE} color={ICON_COLOR_RED} />
        </View>
    </TouchableHaptic>
  )
}

const CalendarWeekDayChart = React.memo(({
  date,
  bookingProgress = 0,
  highlight = "#303030",
}: {
  date: DatesInWeekInfoProps;
  bookingProgress?: number;
  highlight?: string;
}) => {
  const backgroundColor = React.useMemo(() => `${highlight}10`, [highlight]);
  return (
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
        style={[GlobalTypographyStyle.headerSubtitle, CalendarWeekDayStyle.number, { color: highlight }]} />
    </ChartDonutProgress>
  )
}, (prevProps, nextProps) => {
  return prevProps.date.now.toISOString() === nextProps.date.now.toISOString() &&
         prevProps.bookingProgress === nextProps.bookingProgress &&
         prevProps.highlight === nextProps.highlight;
});

/**
 * @description Custom comparison function for React.memo to prevent unnecessary re-renders
 * Only re-render if the actual date or booking progress changes, not just the object reference */
export default React.memo(CalendarWeekDay, (
prevProps: CalendarWeekDayProps, 
  nextProps: CalendarWeekDayProps
): boolean => {
  const isSameDate = prevProps.date.now.toISOString() === nextProps.date.now.toISOString();
  const isSameIdx = prevProps.idx === nextProps.idx;
  const isSameProgress = prevProps.bookingProgress === nextProps.bookingProgress;
  const isSameHighlight = prevProps.highlight === nextProps.highlight;
  return isSameDate && isSameIdx && isSameProgress && isSameHighlight;
});