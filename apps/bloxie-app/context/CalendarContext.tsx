import { getMonth, getYear, Month, startOfWeek } from "date-fns";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { createStore, StoreApi, useStore } from "zustand";
import { getWeekNumber } from "@codemize/helpers/DateTime";

import { getLocalization } from "@/helpers/System";

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
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type CalendarContextProps = {
  now: Date;
  setNow: (now: Date) => void;
  week: CalendarViewWeekProps;
  setWeek: (week: CalendarViewWeekProps) => void;
  view: CalendarDropdownItemKeyView;
  setView: (view: CalendarDropdownItemKeyView) => void;
  dropdown: CalendarDropdownProps;
  setDropdown: (property: string, value: string|number) => void;
  isTodayPressed: boolean;
  setIsTodayPressed: (isTodayPressed: boolean) => void;
  selected: Date;
  setSelected: (selected: Date) => void;
  rangeStart: Date|null;
  rangeEnd: Date|null;
  setRangeStart: (date: Date | null) => void;
  setRangeEnd: (date: Date) => void;
}

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
  const _now = now || new Date();
  const [store] = useState(() => 
    createStore<CalendarContextProps>()((set, get) => ({
      now: _now,
      setNow: (now) => set((state) => ({ ...state, now })),
      week: { number: getWeekNumber({ now: _now, locale: getLocalization() }), month: getMonth(_now) as Month, year: getYear(_now), startOfWeek: startOfWeek(_now, { locale: getLocalization() }) },
      setWeek: (week) => set((state) => ({ ...state, week: { ...state.week, ...week } })),
      view: CalendarDropdownItemKeyView.week,
      setView: (view: CalendarDropdownItemKeyView) => set((state) => ({ ...state, view })),
      dropdown: { itemKeyView: CalendarDropdownItemKeyView.week },
      setDropdown: (property: string, value: string|number) => set((state) => ({ 
        ...state,
        dropdown: { ...state.dropdown, [property]: value as string|number } })),
      isTodayPressed: false,
      setIsTodayPressed: (isTodayPressed: boolean) => set((state) => ({ ...state, isTodayPressed })),
      selected: _now,
      setSelected: (selected: Date) => set((state) => ({ ...state, selected })),
      rangeStart: null,
      rangeEnd: null,
      setRangeStart: (date: Date | null) => set((state) => ({ ...state, rangeStart: date, rangeEnd: null })),
      setRangeEnd: (date: Date) => set((state) => ({ ...state, rangeEnd: date, selected: date }))
    }))
  );

  return (
    <CalendarContext.Provider 
      value={store}>
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