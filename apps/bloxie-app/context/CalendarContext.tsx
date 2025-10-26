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
 * @version 0.0.1
 * @param {Object} param0
 * @param {Date} param0.now - Selected date during user interaction */
export default function CalendarProvider({ 
  now = new Date(),
  children, 
}: CalendarProviderProps) {
  const [store] = useState(() => 
    createStore<CalendarContextProps>()((set, get) => ({
      now,
      setNow: (now) => set((state) => ({ ...state, now })),
      week: { number: getWeekNumber({ now, locale: getLocalization() }), month: getMonth(now) as Month, year: getYear(now), startOfWeek: startOfWeek(now) },
      setWeek: (week) => set((state) => ({ ...state, week: { ...state.week, ...week } })),
      isTodayPressed: false,
      setIsTodayPressed: (isTodayPressed) => set((state) => ({ ...state, isTodayPressed })),
      selected: now,
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
export function useCalendarStore<T>(selector: (state: CalendarContextProps) => T) {
  const context = useContext(CalendarContext);
  if (!context) throw new Error("CalendarContext.Provider is missing");
  return useStore(context, selector);
}