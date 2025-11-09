import { useCalendarContextStore } from "@/context/CalendarContext";
import { getMonth, isEqual, isToday, isWeekend, isWithinInterval, max, min } from "date-fns";
import { useThemeColors } from "../theme/useThemeColor";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.4
 * @version 0.0.2
 * @description Pure function version of useCalendarHighlight
 * Can be called multiple times without hook overhead
 * @param {Date} now - The date to calculate highlight for
 * @param {Record<string, string>} colors - Theme colors object
 * @param {Date | null} selected - Currently selected date
 * @returns Highlight color for the date */
export const highlightColor = (
  now: Date,
  colors: Record<string, string>,
  selected: Date | null,
): string => {
  if (isToday(now)) return colors.todayBgColor;
  if (selected && isEqual(selected, now)) return colors.warningColor;
  if (isWeekend(now)) return colors.weekendBgColor;
  return colors.infoColor;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.4
 * @version 0.0.2
 * @description Hook version - delegates to pure function
 * Use this for backward compatibility
 * @param {Date} now - The date to calculate highlight for */
export const useCalendarHighlight = (
  now: Date
): string => {
  const colors = useThemeColors();
  const { selected } = useCalendarContextStore(
    (state) => ({
      selected: state.selected
    })
  );
  return highlightColor(now, colors, selected);
};