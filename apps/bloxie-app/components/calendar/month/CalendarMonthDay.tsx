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

import { Dimensions, View } from "react-native";
import GlobalContainerStyle from "@/styles/GlobalContainer";
import CalendarWeekDayCircle from "../week/CalendarWeekDayCircle";
import { endOfWeek, getWeek, isSameDay, startOfWeek } from "date-fns";
import { getLocalization } from "@/helpers/System";
import { shadeColor } from "@codemize/helpers/Colors";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.1
 * @type */
export type CalendarWeekDayProps = {
  dateInWeek: DatesInWeekInfoProps;
  selected: Date;
  month: number;
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
const CalendarMonthDay = ({
  dateInWeek,
  selected,
  month,
}: CalendarWeekDayProps) => {
  //const rangeStartRef = React.useRef<Date|null>(null);
  // console.log("CalendarWeekDay", date.now.toISOString()); // Deactivated for performance testing

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
  const week = useCalendarContextStore((state) => state.week);
  /** @description Calculate all highlights once (instead of 7 times in each child) */
  const highlight = highlightColor(dateInWeek.now, colors, selected);
  
  const isCurrentWeek = dateInWeek.now >= week.startOfWeek && dateInWeek.now <= week.endOfWeek;
  
  let backgroundColor = "transparent";
  
  // Wenn dieser Tag in der aktuellen Woche liegt
  if (isCurrentWeek) {
    if (isSameDay(dateInWeek.now, week.startOfWeek) || isSameDay(dateInWeek.now, week.endOfWeek)) {
      // erster oder letzter Tag der Woche → kräftig
      backgroundColor =shadeColor("#303030", 0);
    } else {
      // Tag dazwischen → hellere Variante
      backgroundColor = shadeColor("#626D7B", 0.9);
    }
  } else {
    // Nicht aktuelle Woche → bisherige Logik
    /*backgroundColor =
      month === dateInWeek.now.getMonth()
        ? `${highlight}10`
        : `${highlight}05`;*/
  }

  
  return (
    <TouchableHaptic 
      onPress={onPress}
      hitSlop={10}
      style={[CalendarWeekDayStyle.touchable, { width: config.width - 1, 
      backgroundColor,
        height: 30, 
        justifyContent: "flex-start", 
        alignItems: "center",
        paddingTop: 4,
        gap: 4
        }]}>
          <TextBase 
            type="label" 
            text={dateInWeek.number.toString()}
            style={[GlobalTypographyStyle.headerSubtitle, { 
              color: isCurrentWeek && (isSameDay(dateInWeek.now, week.startOfWeek) || isSameDay(dateInWeek.now, week.endOfWeek))
              ? colors.focusedContentColor 
              : month === dateInWeek.now.getMonth() 
              ? colors.infoColor //`${highlight}` 
              : colors.prevNextMonthColor, 
            fontSize: 10,
          }]} />
          <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 1 }]}>
            {dateInWeek.number === 4 && <CalendarWeekDayCircle color={"#159F85"} />}
            {(dateInWeek.number === 5 || dateInWeek.number === 9) && <CalendarWeekDayCircle color={"#047dd4"} />}
            {(dateInWeek.number === 13 || dateInWeek.number === 9 || dateInWeek.number === 4) && <CalendarWeekDayCircle color={"#D15555"} />}
          </View>
    </TouchableHaptic>
  )
}

export default React.memo(CalendarMonthDay);