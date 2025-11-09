import { addDays, format, Locale, startOfWeek, endOfWeek, getDate, getMonth, eachDayOfInterval, getDay, getWeek, Month, LocaleWidth, subMonths, addMonths, startOfMonth, endOfMonth, eachWeekOfInterval, getYear } from "date-fns";
import { STYLES } from "@codemize/constants/Styles";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type
 * @global */
export type LocaleTimeProps = {
  now?: Date;
  locale: Locale;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type
 * @global */
export type WeekNumberProps = {
  now?: Date;
  locale: Locale;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type
 * @global */
export type MonthInfoProps = {
  number: Month;
  width?: LocaleWidth;
  locale: Locale;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.1
 * @type
 * @global */
export type MonthInfoObjProps = {
  number: Month;
  shortText: string;
  longText: string;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type
 * @global */
export type DatesInWeekProps = {
  number: number;
  now: Date;
  locale: Locale;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.1
 * @type */
export type DatesInMonthProps = {
  now?: Date;
  monthsInPast?: number;
  monthsInFuture?: number;
  locale: Locale;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type
 * @global */
export type DatesInWeekInfoProps = {
  number: number;
  now: Date;
  day: number;
  shortText: string;
  longText: string;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.5
 * @type */
export type DatesInMonthInfoProps = {
  year: number;
  month: number;
  weeks: WeeksInMonthProps[];
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type
 * @global */
export type WeeksProps = {
  now?: Date;
  weeksInPast?: number;
  weeksInFuture?: number;
  locale: Locale;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.1
 * @type
 * @global */
export type YearsProps = {
  now?: Date;
  yearsInPast?: number;
  yearsInFuture?: number;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type
 * @global */
export type WeeksObjProps = {
  now?: Date;
  days?: number;
  locale: Locale;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type
 * @global */
export type WeeksObjInfoProps = {
  datesInWeek: DatesInWeekInfoProps[];
  startOfWeek: Date;
  endOfWeek: Date;
  week: number;
  month: number;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.1
 * @type */
export type WeeksInMonthProps = {
  number: number;
  dates: DatesInWeekInfoProps[];
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type
 * @global */
export type HoursProps = {
  idx: number;
  now: Date;
  hour: string;
}

export const MINUTES_IN_DAY = (STYLES.calendarHourHeight * 24);
export const MINUTES_IN_DAY_WITH_BORDER = (STYLES.calendarHourHeight * 24) //+ (STYLES.calendarHourBorderHeight * 24);
export const PIXELS_PER_MINUTE = STYLES.calendarHourHeight / 60;
export const PIXELS_PER_MINUTE_WITH_BORDER = (STYLES.calendarHourHeight + STYLES.calendarHourBorderHeight) / 60;
export const BORDER_HEIGHT = STYLES.calendarHourBorderHeight;

export const TOTAL_MINUTES = 1440;
export const BORDERS_PER_DAY = 23;
export const GRID_MINUTES = 15;
export const TOTAL_BORDER_HEIGHT = BORDER_HEIGHT * BORDERS_PER_DAY;
export const MAX_TOP = TOTAL_MINUTES * PIXELS_PER_MINUTE + TOTAL_BORDER_HEIGHT;

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns the current/previous and future weeks based on a day counter
 * @since 0.0.7
 * @version 0.0.1
 * @param {WeeksProps} param0 - Handles the prepartion of the week properties included current/previous and future week(s)
 * @param {Date} param0.now - Initial/Start date
 * @param {number} param0.weeksInPast - Weeks in the past (Determine previous week(s) datess)
 * @param {number} param0.weeksInFuture - Weeks in the future (Determine next week(s) dates) 
 * @param {Locale} param0.locale - Locale to use for the weeks
 * @function
 * @global */
export const getWeeks = ({
  now = new Date(),
  weeksInPast = 2,
  weeksInFuture = 2,
  locale
}: WeeksProps): WeeksObjInfoProps[] => {
  const weeks: WeeksObjInfoProps[] = [];

  for (let idx = weeksInPast; idx > 0; idx--) weeks.push(getWeeksObj({ now, days: -((idx) * 7), locale }));
  weeks.push(getWeeksObj({ now, locale }));
  for (let idx = 1; idx <= weeksInFuture; idx++) weeks.push(getWeeksObj({ now, days: +((idx) * 7), locale }));

  return weeks;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns the week number
 * @since 0.0.2
 * @version 0.0.1 
 * @param {Object} param0 - Handles the prepartion of the weeks dates
 * @param {Date} param0.now - Initial/Start date
 * @param {Locale} param0.locale - Locale to use for the week number
 * @function
 * @global */
export const getWeekNumber = ({ 
  now = new Date(),
  locale
}: WeekNumberProps): number => getWeek(now, {
  locale,
  weekStartsOn: locale.options?.weekStartsOn || 0
});

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns the description of the month
 * @since 0.0.2
 * @version 0.0.1
 * @param {Object} param0
 * @param {Month} param0.number - Internal number of the month
 * @param {LocaleWidth} param0.width - Localized description width 
 * @param {Locale} param0.locale - Locale to use for the month description
 * @function
 * @global */
export const getMonthWide = ({
  number,
  width = "wide",
  locale
}: MonthInfoProps) => locale.localize.month(number, { 
  width // 0 => January / 1 => February / etc..
});

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns the months
 * @since 0.0.5
 * @version 0.0.1
 * @param {Locale} locale - Locale to use for the months
 * @function
 * @global */
export const getMonths = (
  locale: Locale
): MonthInfoObjProps[] => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(month => ({
  number: month as Month,
  shortText: getMonthWide({ number: month as Month, locale }),
  longText: getMonthWide({ number: month as Month, locale, width: "wide" })
}));

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns the years
 * @since 0.0.5
 * @version 0.0.1
 * @param {YearsProps} param0 - Handles the prepartion of the years
 * @param {Date} param0.now - Initial/Start date
 * @param {number} param0.yearsInPast - Years in the past (Determine previous year(s))
 * @param {number} param0.yearsInFuture - Years in the future (Determine next year(s))
 * @function
 * @global */
export const getYears = ({
  now = new Date(),
  yearsInPast = 5,
  yearsInFuture = 5
}: YearsProps) => {
  const currentYear = getYear(now);
  const yearsList: number[] = [];
  for (let i = currentYear - yearsInPast; i <= currentYear + yearsInFuture; i++) yearsList.push(i);
  return yearsList;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns the locale formatted time
 * @since 0.0.2
 * @version 0.0.1
 * @param {LocaleTimeProps} param0 - Handles the prepartion of the locale formatted time
 * @param {Date} param0.now - Initial/Start date
 * @param {Locale} param0.locale - Locale to use for the locale formatted time
 * @function
 * @global */
 export const getLocaleTime = ({
  now = new Date(),
  locale
}: LocaleTimeProps) => format(now, "pp", { locale });

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns the absolute position for the timeline indicator
 * @since 0.0.12
 * @version 0.0.18
 * @param {Date} now - Initial start/end date */
 export const getTimePosition = (
  now: Date = new Date(),
): number => {
  const minutes = getMinutesSinceMidnight(now);
  return minutes * PIXELS_PER_MINUTE + Math.floor(minutes / 60) * BORDER_HEIGHT;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns an object with dates and more in defined weeks
 * @since 0.0.2
 * @version 0.0.1
 * @param {WeeksObjProps} param0 - Handles the prepartion of the weeks dates
 * @param {Date} param0.now - Initial/Start date
 * @param {number} param0.days - Days added to the imported date parameter "now"
 * @param {Locale} param0.locale - Locale to use for the weeks
 * @function
 * @global */
export const getWeeksObj = ({
  now = new Date(),
  days = 0,
  locale
}: WeeksObjProps): WeeksObjInfoProps => ({
  datesInWeek: getDatesInWeek({ now: addDays(now, days), number: 0, locale }),
  startOfWeek: startOfWeek(addDays(now, days), { locale }),
  endOfWeek: endOfWeek(addDays(now, days), { locale }),
  week: getWeekNumber({ now: addDays(now, days), locale }),
  month: getMonth(addDays(now, days))
});

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns the dates in a week based on a date
 * @since 0.0.7
 * @version 0.0.1
 * @param {DatesInWeekProps} param0 - Handles the prepartion of the weeks dates
 * @param {Date} param0.now - Initial/Start date
 * @param {number} param0.number - Number of the week
 * @param {Locale} param0.locale - Locale to use for the dates in week
 * @function
 * @global */
 export const getDatesInWeek = ({
  now = new Date(),
  number = getDate(now),
  locale
}: DatesInWeekProps): DatesInWeekInfoProps[] => {
  const datesInWeek: DatesInWeekInfoProps[] = [];

  eachDayOfInterval({ 
    start: startOfWeek(now, { locale }), 
    end: endOfWeek(now, { locale })
  }).forEach(date => datesInWeek.push({ 
    number: getDate(date),
    now: date,
    day: getDay(date),
    shortText: format(date, "EEE", { locale }),
    longText: format(date, "EEEE", { locale })
   }));

   return datesInWeek;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns all the dates in a month based on submitted date
 * @since 0.0.5
 * @version 0.0.5
 * @param {Object} param0
 * @param {Date} param0.now - Initial/Start date
 * @param {number} param0.monthsInPast - Months in the past (Determine previous month(s) dates)
 * @param {number} param0.monthsInFuture - Months in the future (Determine next month(s) dates)
 * @param {Locale} param0.locale - Locale to use for the dates */
export const getDatesInMonth = ({
  now = new Date(),
  monthsInPast = 60,
  monthsInFuture = 60,
  locale
}: DatesInMonthProps): DatesInMonthInfoProps[] => {
  const datesInMonth: DatesInMonthInfoProps[] = [];

  for (let idx = monthsInPast; idx > 0; idx--) {
    const _now = subMonths(now, idx);
    const weeksInMonth: WeeksInMonthProps[] = _getDatesInMonth(_now, locale);
    datesInMonth.push({
      year: _now.getFullYear(),
      month: getMonth(_now),
      weeks: weeksInMonth
    });
  }

  const weeksInMonth: WeeksInMonthProps[] = _getDatesInMonth(now, locale);
  datesInMonth.push({
    year: now.getFullYear(),
    month: getMonth(now),
    weeks: weeksInMonth
  });

  for (let idx = 1; idx <= monthsInFuture; idx++) {
    const _now = addMonths(now, idx);
    const weeksInMonth: WeeksInMonthProps[] = _getDatesInMonth(_now, locale);
    datesInMonth.push({
      year: _now.getFullYear(),
      month: getMonth(_now),
      weeks: weeksInMonth
    });
  }
  return datesInMonth;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns an array of object for each hour of a day
 * @since 0.0.2
 * @version 0.0.1
 * @param {number} interval - Interval of hours
 * @param {Locale} locale - Locale to use for the hours
 * @function
 * @global */
export const getHours = (
  interval: number = 24,
  locale: Locale
): HoursProps[] => {
  const hours: HoursProps[] = [];
  const now: Date = new Date();

  Array.from({ length: interval }).forEach((_, idx) => {
    hours.push({
      idx,
      now,
      hour: format(new Date(now.getFullYear(), now.getMonth(), now.getDate(), idx, 0, 0), "p", { locale }),
    });
  });

  return hours;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns the count of minutes since midnight
 * @since 0.0.2
 * @version 0.0.1
 * @param {Date} now - Initial start/end date */
 export const getMinutesSinceMidnight = (
  now: Date = new Date()
): number => (now.getHours() * 60) + now.getMinutes();

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns the total number of minutes between two dates.
 * @since 0.0.2
 * @version 0.0.1
 * @param {Date} start - Start date
 * @param {Date} end - End date 
 * @function*/
export const getMinutesBetweenDates = (
  start: Date,
  end: Date
): number => {
  const differenceInMinutes = end.getTime() - start.getTime();
  return Math.round(differenceInMinutes / 60000);
};

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns all weeks in a month with their dates
 * @since 0.0.5
 * @version 0.0.1
 * @param {Date} now - The date to get the month from
 * @param {Locale} locale - The locale to use for formatting
 * @returns {WeeksInMonthProps[]} Array of weeks with their dates
 * @function */
const _getDatesInMonth = (
  now: Date,
  locale: Locale
): WeeksInMonthProps[] => {
  const weeksInMonth: WeeksInMonthProps[] = [];
  
  // Get first and last day of the month
  const firstDayOfMonth = startOfMonth(now);
  const lastDayOfMonth = endOfMonth(now);
  
  // Get all weeks that touch this month (including partial weeks)
  const weeks = eachWeekOfInterval(
    { start: firstDayOfMonth, end: lastDayOfMonth },
    { weekStartsOn: locale.options?.weekStartsOn || 0 }
  );
  
  // For each week, get all dates and create WeeksInMonthProps object
  weeks.forEach((weekStart) => {
    const weekNumber = getWeek(weekStart, { weekStartsOn: locale.options?.weekStartsOn || 0 });
    const datesInWeek = getDatesInWeek({ 
      now: weekStart, 
      number: 0, 
      locale
    });
    
    weeksInMonth.push({
      number: weekNumber,
      dates: datesInWeek
    });
  });
  
  return weeksInMonth;
};