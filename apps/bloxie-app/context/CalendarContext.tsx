import React, { createContext, PropsWithChildren, useContext, useState } from "react";
import { Dimensions } from "react-native";
import { createStore, StoreApi, useStore } from "zustand";
import { endOfWeek, getMonth, getYear, Month, startOfWeek } from "date-fns";

import { DatesInMonthInfoProps, getDatesInMonth, getWeekNumber, getWeeks, WeeksObjInfoProps } from "@codemize/helpers/DateTime";
import { STYLES } from "@codemize/constants/Styles";

import { getLocalization } from "@/helpers/System";
import { ConvexEventsAPIProps } from "../../../packages/backend/Types";

export const WEEKS_IN_PAST = 104;
export const WEEKS_IN_FUTURE = 156;
export const TOTAL_WEEKS = WEEKS_IN_PAST + WEEKS_IN_FUTURE;

const DIM = Dimensions.get("window");

const CalendarContext = createContext<StoreApi<CalendarContextProps>|undefined>(undefined);

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @enum */
export enum CalendarDropdownItemKeyView {
  day = "day",
  week = "week",
  agenda = "agenda",
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type CalendarDropdownProps = {
  itemKeyView: CalendarDropdownItemKeyView;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type CalendarProviderProps = PropsWithChildren & {
  now?: Date;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type CalendarViewWeekProps = {
  number: number;
  month: Month;
  year: number;
  startOfWeek: Date;
  endOfWeek: Date;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.1
 * @type */
export type CalendarViewConfigProps = {
  numberOfDays: number;
  width: number;
  totalWidth: number;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.1
 * @type */
export type CalendarCachedProps = {
  weeks: Map<number, WeeksObjInfoProps>;
  weeksHorizontal: CalendarCachedWeeksHorizontalProps[];
  months: Map<number, DatesInMonthInfoProps>;
  monthsHorizontal: CalendarCachedMonthsHorizontalProps[];
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.1
 * @type */
export type CalendarCachedWeeksHorizontalProps = {
  index: number;
  week: WeeksObjInfoProps;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.1
 * @type */
export type CalendarCachedMonthsHorizontalProps = {
  index: number;
  month: DatesInMonthInfoProps;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.2
 * @type */
export type CalendarContextProps = {
  now: Date;
  setNow: (now: Date) => void;
  week: CalendarViewWeekProps;
  setWeek: (week: CalendarViewWeekProps) => void;
  view: CalendarDropdownItemKeyView;
  setView: (view: CalendarDropdownItemKeyView) => void;
  config: CalendarViewConfigProps;
  setConfig: (numberOfDays: number) => void;
  cached: CalendarCachedProps;
  dropdown: CalendarDropdownProps;
  setDropdown: (property: string, value: string|number) => void;
  isTodayPressed: boolean;
  setIsTodayPressed: (isTodayPressed: boolean) => void;
  selected: Date;
  setSelected: (selected: Date) => void;
  events: ConvexEventsAPIProps[];
  setEvents: (events: ConvexEventsAPIProps[]) => void;
}

const CACHED_MONTHS = new Map<number, DatesInMonthInfoProps>();
const CACHED_WEEKS = new Map<number, WeeksObjInfoProps>();

/**
 * @description Preload the weeks and cache them for maximum performance during scrolling
 * @param {Date} now - The current date
 * @returns {Map<number, WeeksObjInfoProps>} - The cached weeks */
const getCachedWeeks = (
  now: Date
):  Map<number, WeeksObjInfoProps> => {
  if (CACHED_WEEKS.size > 0) return CACHED_WEEKS;
  getWeeks({ now, weeksInPast: WEEKS_IN_PAST, weeksInFuture: WEEKS_IN_FUTURE, locale: getLocalization() })
  .forEach((week, index) => CACHED_WEEKS.set(index, week)); 
  return CACHED_WEEKS;
}

/**
 * @description Preload the weeks and cache them for loading the horizontal scroll view
 * @param {Date} now - The current date
 * @returns {CalendarCachedHorizontalProps} - The cached horizontal weeks for the horizontal scroll view */
const getCachedWeeksHorizontal = (
  now: Date
): CalendarCachedWeeksHorizontalProps[] => {
  const cachedWeeks: Map<number, WeeksObjInfoProps> = getCachedWeeks(now);
  return Array.from(cachedWeeks.values()).map((week, index) => ({
    index: index - WEEKS_IN_PAST,
    week
  }));
}

/**
 * @description Preload the months and cache them for loading the month list
 * @param {Date} now - The current date
 * @returns {Map<number, DatesInMonthInfoProps[]>} - The cached months for the month list */
const getCachedMonths = (
  now: Date
): Map<number, DatesInMonthInfoProps> => {
  if (CACHED_MONTHS.size > 0) return CACHED_MONTHS;
  getDatesInMonth({ now, monthsInPast: (WEEKS_IN_PAST / 52) * 12, monthsInFuture: (WEEKS_IN_FUTURE / 52) * 12, locale: getLocalization() })
  .forEach((month, index) => CACHED_MONTHS.set(index, month));
  return CACHED_MONTHS;
}

/**
 * @description Preload the weeks and cache them for loading the horizontal scroll view
 * @param {Date} now - The current date
 * @returns {CalendarCachedHorizontalProps} - The cached horizontal weeks for the horizontal scroll view */
const getCachedMonthsHorizontal = (
  now: Date
): CalendarCachedMonthsHorizontalProps[] => {
  const cachedMonths: Map<number, DatesInMonthInfoProps> = getCachedMonths(now);
  return Array.from(cachedMonths.values()).map((month, index) => ({
    index: index,
    month
  }));
}

/**
 * @description Create the store and initialize the state
 * @param {Date} now - The current date
 * @returns {StoreApi<CalendarContextProps>} - The store */
export const store = (
  now: Date
): StoreApi<CalendarContextProps> => createStore<CalendarContextProps>()((set, get) => ({
  now,
  setNow: (now) => set((state) => ({ ...state, now })),
  week: { 
    number: getWeekNumber({ now: now, locale: getLocalization() }), 
    month: getMonth(now) as Month, 
    year: getYear(now), 
    startOfWeek: startOfWeek(now, { locale: getLocalization() }), 
    endOfWeek: endOfWeek(now, { locale: getLocalization() }),
  },
  setWeek: (week) => set((state) => ({ ...state, week: { ...state.week, ...week } })),
  config: { numberOfDays: 7, width: (DIM.width - STYLES.calendarHourWidth) / 7, totalWidth: (DIM.width - STYLES.calendarHourWidth) },
  setConfig: (numberOfDays: number) => set((state) => ({ 
    ...state, config: { 
      ...state.config, 
      numberOfDays, 
      width: (DIM.width - STYLES.calendarHourWidth) / numberOfDays, 
      totalWidth: (DIM.width - STYLES.calendarHourWidth) * numberOfDays
    } 
  })),
  view: CalendarDropdownItemKeyView.week,
  setView: (view: CalendarDropdownItemKeyView) => set((state) => ({ ...state, view })),
  cached: { weeks: getCachedWeeks(now), weeksHorizontal: getCachedWeeksHorizontal(now), months: getCachedMonths(now), monthsHorizontal: getCachedMonthsHorizontal(now) },
  dropdown: { itemKeyView: CalendarDropdownItemKeyView.week },
  setDropdown: (property: string, value: string|number) => set((state) => ({ 
    ...state,
    dropdown: { ...state.dropdown, [property]: value as string|number } })),
  isTodayPressed: false,
  setIsTodayPressed: (isTodayPressed: boolean) => set((state) => ({ ...state, isTodayPressed })),
  selected: now,
  setSelected: (selected: Date) => set((state) => ({ ...state, selected })),
  events: [],
  setEvents: (events: ConvexEventsAPIProps[]) => set((state) => ({ ...state, events })),
}));

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description 
 * @since 0.0.2
 * @version 0.0.2
 * @param {Object} param0
 * @param {Date} param0.now - Selected date during user interaction */
export default function CalendarProvider({ 
  now,
  children, 
}: CalendarProviderProps) {
  /** @description Create a new store instance for the calendar context */
  const [storeInstance] = React.useState(() => store(now || new Date()));

  return (
    <CalendarContext.Provider 
      value={storeInstance}>
        {children}
    </CalendarContext.Provider>
  );
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description 
 * @since 0.0.2
 * @version 0.0.1
 * @param {function} selector */
export function useCalendarContextStore<T>(selector: (state: CalendarContextProps) => T) {
  const context = useContext(CalendarContext);
  if (!context) throw new Error("CalendarContext.Provider is missing");
  return useStore(context, selector);
}
