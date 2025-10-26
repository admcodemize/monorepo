import { isEqual, isWeekend, isWithinInterval, max, min } from "date-fns";
import * as React from "react";

import { DatesInWeekInfoProps } from "@codemize/helpers/DateTime";

import { useCalendarStore } from "@/context/CalendarContext";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { useCalendarHighlight } from "@/hooks/calendar/useCalendarHighlight";

import TouchableHaptic from "@/components/button/TouchableHaptic";
import ChartDonutProgress from "@/components/chart/ChartDonutProgress";
import TextBase from "@/components/typography/Text";

import CalendarWeekDayStyle from "@/styles/components/calendar/week/CalendarWeekDay";
import GlobalTypographyStyle from "@/styles/GlobalTypography";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.7
 * @version 0.0.2
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
 * @since 0.0.7
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
  const { info, primaryBorderColor, secondaryBorderColor, focusedContent } = useThemeColors();

  const rangeStartRef = React.useRef<Date|null>(null);

  /**
   * @description Checks if this specific day is currently selected
   * Note: If day is rangeStart, it should not show as selected (range mode takes precedence)
   * - The range start will be used to check if the day is the start of a range selection
   * - If the range start is the same as the selected day, the range selection will be stopped => Single day selection
   * - isRangeStart will be used to check if the day is the start of a range selection
   * - isRangeEnd will be used to check if the day is the end of a range selection
   * @see {@link context/CalendarContext} */
  const isSelected = useCalendarStore((state) => (isEqual(state.selected, date.now) && !state.rangeStart));
  const isRangeStart = useCalendarStore((state) => state.rangeStart ? isEqual(state.rangeStart, date.now) : false);
  const isRangeEnd = useCalendarStore((state) => state.rangeEnd ? isEqual(state.rangeEnd, date.now) : false);
  const rangeStart = useCalendarStore((state) => state.rangeStart);
  
  /**
   * @description Determines if this day falls within a date range selection
   * @optimization Only re-renders affected days for maximum performance
   * Business Logic:
   * - Start/End days are always included (even if weekends)
   * - If range ends on weekend: all days shown (visual continuity)
   * - If range ends on weekday: weekends excluded (business logic)
   * @see {@link context/CalendarContext} */
  const isInRange = useCalendarStore((state) => {
    /** 
     * @description Early exit conditions
     * - If range start or end is not set or if range start and end are the same */
    if (!state.rangeStart || !state.rangeEnd) return false;
    if (isEqual(state.rangeStart, state.rangeEnd)) return false;
    
    /** @description Normalize range order (start always before end) */
    const rangeStart = min([state.rangeStart, state.rangeEnd]);
    const rangeEnd = max([state.rangeStart, state.rangeEnd]);
    
    /** @description Check if current day falls within date range bounds */
    const isInDateRange = isWithinInterval(date.now, {
      start: rangeStart,
      end: rangeEnd
    });
    
    if (!isInDateRange) return false;
    
    /** @description Start and end days are always included */
    const isStartOrEnd = isEqual(date.now, rangeStart) || isEqual(date.now, rangeEnd);
    if (isStartOrEnd) return true;
    
    /** @description Apply weekend filtering based on range end type */
    const isEndWeekend = isWeekend(rangeEnd);
    const isCurrentWeekend = isWeekend(date.now);
    
    /** @description Visual continuity: if range ends on weekend, show all days */
    if (isEndWeekend) return true;
    
    /** @description Business logic: if range ends on weekday, exclude weekends */
    return !isCurrentWeekend;
  });

  /** 
   * @description Calendar store actions for date selection and range management
   * @see {@link context/CalendarContext} */
  const setSelected = useCalendarStore((state) => state.setSelected);
  const setRangeStart = useCalendarStore((state) => state.setRangeStart);
  const setRangeEnd = useCalendarStore((state) => state.setRangeEnd);

  /**
   * @description Determines the visual highlight color for this day
   * Priority: Range states override single selection
   * @see {@link hooks/calendar/useCalendarHighlight} */
  const highlight = useCalendarHighlight(date.now, isRangeStart || isRangeEnd || isInRange || (isSelected && !isRangeStart));

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

  React.useEffect(() => {
    rangeStartRef.current = rangeStart;
  }, [rangeStart]);
  
  /**
   * @description Handles tap interaction on calendar day
   * Behavior:
   * - Sets this day as selected
   * - If range selection is active, completes the range
   * @optimization Memoized to prevent unnecessary re-renders */
  const onPress = React.useCallback(() => {
    setSelected(date.now);
    setRangeEnd(date.now);

    /** @description If the range start is the same as the selected day, the range selection will be stopped => Single day selection */
    rangeStartRef.current && isEqual(rangeStartRef.current, date.now) && setRangeStart(null);
  }, [date.now, rangeStartRef, setSelected, setRangeEnd]);
  
  /**
   * @description Handles long press interaction to initiate range selection
   * Behavior:
   * - Starts a new range selection with this day as the start point
   * - Previous range selections are reset
   * @optimization Memoized to prevent unnecessary re-renders */
  const onLongPress = React.useCallback(() => setRangeStart(date.now), [date.now, setRangeStart]);

  return (
    <TouchableHaptic 
      onPress={onPress}
      onLongPress={onLongPress}
      hitSlop={10}
      style={[CalendarWeekDayStyle.touchable]}>
        <TextBase 
          text={date.shortText} 
          style={[GlobalTypographyStyle.headerSubtitle, CalendarWeekDayStyle.shortText, { 
            color: highlight 
          }]} />
        <ChartDonutProgress
          size={26}
          strokeWidth={1.25}
          progress={bookingProgress}
          color={highlight}
          backgroundColor={`${highlight}10`}
          animated={true}>
          <TextBase 
            type="subtitle" 
            text={date.number.toString()}
            style={[GlobalTypographyStyle.headerSubtitle, CalendarWeekDayStyle.number, { 
              color: highlight
            }]} />
        </ChartDonutProgress>
    </TouchableHaptic>
  )
}

/**
 * @description Memoized calendar day component with custom comparison function
 * Performance Optimization:
 * - Only re-renders when props actually change
 * - Uses date-fns isEqual for reliable date comparison
 * - Prevents unnecessary renders in large calendar grids
 * @param {CalendarWeekDayProps} prevProps Previous component props
 * @param {CalendarWeekDayProps} nextProps New component props */
export default React.memo(CalendarWeekDay, (prevProps, nextProps) => {
  return (
    isEqual(prevProps.date.now, nextProps.date.now) &&
    prevProps.date.number === nextProps.date.number &&
    prevProps.idx === nextProps.idx
  );
});