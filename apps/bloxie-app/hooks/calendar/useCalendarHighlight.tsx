import { isToday, isWeekend } from "date-fns";

import { useThemeColors } from "../theme/useThemeColor";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description - Returns the highlighting of a calendar event (Monthly/Weekly)
 * @since 0.0.1
 * @version 0.0.1 */
export const useCalendarHighlight = (
  now: Date,
  isSelected: boolean = false,
) => {
  const { weekendBgColor, todayBgColor, warning, info } = useThemeColors();

  /** @description Handles the highlighting of a calendar event */
  if (isToday(now)) return todayBgColor;
  if (isSelected) return warning;
  if (isWeekend(now)) return weekendBgColor;
  return info; 
}