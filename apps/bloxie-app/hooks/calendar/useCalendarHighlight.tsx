import { useCalendarContextStore } from "@/context/CalendarContext";
import { isEqual, isToday, isWeekend, isWithinInterval, max, min } from "date-fns";
import { useThemeColors } from "../theme/useThemeColor";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.4
 * @version 0.0.1
 * @description Pure function version of useCalendarHighlight
 * Can be called multiple times without hook overhead
 * @param {Date} now - The date to calculate highlight for
 * @param {Record<string, string>} colors - Theme colors object
 * @param {Date | null} selected - Currently selected date
 * @param {Date | null} rangeStart - Range selection start date
 * @param {Date | null} rangeEnd - Range selection end date
 * @returns Highlight color for the date */
export const highlightColor = (
  now: Date,
  colors: Record<string, string>,
  selected: Date | null,
  rangeStart: Date | null,
  rangeEnd: Date | null
): string => {
  if (isToday(now)) return colors.todayBgColor;

  /** @description Check if selected (and not in range mode) */
  const isSelectedDay = selected && isEqual(selected, now) && !rangeStart;
  if (isSelectedDay) return colors.warningColor;

  /** @description Check if in range */
  let isInRange = false;
  if (rangeStart && rangeEnd && !isEqual(rangeStart, rangeEnd)) {
    const normalizedStart = min([rangeStart, rangeEnd]);
    const normalizedEnd = max([rangeStart, rangeEnd]);

    if (isWithinInterval(now, { start: normalizedStart, end: normalizedEnd })) {
      const isStartOrEnd = isEqual(now, normalizedStart) || isEqual(now, normalizedEnd);
      if (isStartOrEnd) isInRange = true;
      else {
        const isEndWeekend = isWeekend(normalizedEnd);
        isInRange = isEndWeekend || !isWeekend(now);
      }
    }
  }

  if (isInRange) return colors.warningColor;
  if (isWeekend(now)) return colors.weekendBgColor;
  return colors.infoColor;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.4
 * @version 0.0.1
 * @description Hook version - delegates to pure function
 * Use this for backward compatibility
 * @param {Date} now - The date to calculate highlight for */
export const useCalendarHighlight = (
  now: Date
): string => {
  const colors = useThemeColors();
  const { selected, rangeStart, rangeEnd } = useCalendarContextStore(
    (state) => ({
      selected: state.selected,
      rangeStart: state.rangeStart,
      rangeEnd: state.rangeEnd
    })
  );
  return highlightColor(now, colors, selected, rangeStart, rangeEnd);
};