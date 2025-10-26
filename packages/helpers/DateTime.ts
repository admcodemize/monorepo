import { addDays, format, Locale, startOfWeek, endOfWeek, getDate, getMonth, eachDayOfInterval, getDay, getWeek, Month, LocaleWidth } from "date-fns";
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
export const MINUTES_IN_DAY_WITH_BORDER = (STYLES.calendarHourHeight * 24) + (STYLES.calendarHourBorderHeight * 24);
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