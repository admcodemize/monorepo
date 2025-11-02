import { isEqual, isToday, isWeekend, isWithinInterval, max, min } from "date-fns";
import { useShallow } from "zustand/react/shallow";

import { useThemeColors } from "../theme/useThemeColor";
import { useCalendarContextStore } from "@/context/CalendarContext";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description - Returns the highlighting of a calendar event (Monthly/Weekly)
 * @since 0.0.1
 * @version 0.0.2 */
export const useCalendarHighlight = (
  now: Date
) => {
  const colors = useThemeColors();

  /**
   * @description Optimized store selector with shallow comparison
   * Only re-renders when this specific day's state actually changes
   * This dramatically reduces re-renders during scrolling from ~50 to ~2-3 per action */
  const { isSelected } = useCalendarContextStore(
    useShallow((state) => {
      const { selected, rangeStart, rangeEnd } = state;

      const isSelectedDay = isEqual(selected, now) && !rangeStart;
      //const isRangeStartDay = rangeStart ? isEqual(rangeStart, now) : false;
      //const isRangeEndDay = rangeEnd ? isEqual(rangeEnd, now) : false;

      let isInRangeDay = false;
      if (rangeStart && rangeEnd && !isEqual(rangeStart, rangeEnd)) {
        const normalizedStart = min([rangeStart, rangeEnd]);
        const normalizedEnd = max([rangeStart, rangeEnd]);

        if (isWithinInterval(now, { start: normalizedStart, end: normalizedEnd })) {
          const isStartOrEnd = isEqual(now, normalizedStart) || isEqual(now, normalizedEnd);
          if (isStartOrEnd) {
            isInRangeDay = true;
          } else {
            const isEndWeekend = isWeekend(normalizedEnd);
            isInRangeDay = isEndWeekend || !isWeekend(now);
          }
        }
      } return { isSelected: isSelectedDay };
    })
  );

  /** @description Handles the highlighting of a calendar event */
  if (isToday(now)) return colors.todayBgColor;
  if (isSelected) return colors.warningColor;
  if (isWeekend(now)) return colors.weekendBgColor;
  return colors.infoColor; 
}