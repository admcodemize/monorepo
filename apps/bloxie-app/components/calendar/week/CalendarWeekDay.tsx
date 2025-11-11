import * as React from "react";
import { useShallow } from "zustand/react/shallow";

import { DatesInWeekInfoProps } from "@codemize/helpers/DateTime";

import { useCalendarContextStore } from "@/context/CalendarContext";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { highlightColor } from "@/hooks/calendar/useCalendarHighlight";

import TouchableHaptic from "@/components/button/TouchableHaptic";
import TextBase from "@/components/typography/Text";
import CalendarWeekDayChart from "@/components/calendar/week/CalendarWeekDayChart";

import CalendarWeekDayStyle from "@/styles/components/calendar/week/CalendarWeekDay";
import GlobalTypographyStyle from "@/styles/GlobalTypography";
import CalendarWeekDayCircle from "./CalendarWeekDayCircle";
import { View } from "react-native";
import GlobalContainerStyle from "@/styles/GlobalContainer";
import { STYLES } from "@codemize/constants/Styles";
import { isToday } from "date-fns";
import { useTrays } from "react-native-trays";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.2
 * @type */
export type CalendarWeekDayProps = {
  dateInWeek: DatesInWeekInfoProps;
  selected: Date;
  showDayShortText?: boolean;
  index: number;
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
 * @version 0.0.3
 * @param {Object} param0 Component props
 * @param {DatesInWeekInfoProps} param0.date Date object with day information
 * @param {Date} param0.selected Selected date
 * @param {boolean} param0.showDayShortText Whether to show the short text of the day
 * @component */
const CalendarWeekDay = ({
  dateInWeek,
  selected,
  showDayShortText = true,
  index
}: CalendarWeekDayProps) => {
  //const rangeStartRef = React.useRef<Date|null>(null);
  // console.log("CalendarWeekDay", date.now.toISOString()); // Deactivated for performance testing

  /**
   * @description Handles the opening of the trays which are defined in the @/helpers/Trays.tsx file as screens in the @/screens/private/tray folder
   * @see {@link @/helpers/Trays} */
   const { push } = useTrays('main');
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
    //onSelect(date.now);
    //onRangeEnd(date.now);

    /** @description If the range start is the same as the selected day, the range selection will be stopped => Single day selection */
    //rangeStartRef.current && isEqual(rangeStartRef.current, date.now) && onRangeStart(null);



    /**
      * @description Handles the on press event for opening the action tray
      * @function */
    push("CalendarDayTray", {
      ...dateInWeek
    });
  };
  
  /**
   * @description Handles long press interaction to initiate range selection
   * Behavior:
   * - Starts a new range selection with this day as the start point
   * - Previous range selections are reset */
  //const onLongPress = () => onRangeStart(date.now);

  //const number = React.useMemo(() => date.number, [date.number]);
  const colors = useThemeColors();

  const config = useCalendarContextStore((state) => state.config);

  /** @description Calculate all highlights once (instead of 7 times in each child) */
  const highlight = highlightColor(dateInWeek.now, colors, selected);

  return (
    <TouchableHaptic 
      onPress={onPress}
      hitSlop={10}
      style={[CalendarWeekDayStyle.touchable, {
        width: config.width,
        borderRightWidth: index === 6 ? 0 : 1,
        borderRightColor: `${colors.secondaryBorderColor}60`,
        height: STYLES.calendarHeaderHeight,
        //paddingVertical: 6,
        borderTopWidth: isToday(dateInWeek.now) ? 3 : 0,
        borderTopColor: colors.todayBgColor,
        paddingTop: isToday(dateInWeek.now) ? 5 : 8
      }]}>
        {showDayShortText && <TextBase 
          text={dateInWeek.shortText} 
          style={[GlobalTypographyStyle.headerSubtitle, CalendarWeekDayStyle.shortText, { color: highlight }]} />}
        <CalendarWeekDayChart 
          number={dateInWeek.number}
          highlight={highlight} />
    </TouchableHaptic>
  )
}

export default React.memo(CalendarWeekDay);