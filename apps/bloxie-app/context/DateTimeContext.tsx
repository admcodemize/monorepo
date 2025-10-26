import { createContext, PropsWithChildren, useContext, useState } from "react";
import { createStore, StoreApi, useStore } from "zustand";

const DateTimeContext = createContext<StoreApi<DateTimeContextProps>|undefined>(undefined);

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type DateTimeContextProps = {
  timeZone: string;
  setTimeZone: (timeZone: string) => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type DateTimeProviderProps = PropsWithChildren & {
  timeZone: string;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description 
 * @since 0.0.2
 * @version 0.0.1 */
export default function DateTimeProvider({ 
  timeZone,
  children
}: DateTimeProviderProps) {
  const [store] = useState(() =>
    createStore<DateTimeContextProps>((set) => ({
      timeZone,
      setTimeZone: (timeZone: string) => set((state) => ({ ...state, timeZone })),
    }))
  );

  return (
    <DateTimeContext.Provider 
      value={store}>
        {children}
    </DateTimeContext.Provider>
  );
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description 
 * @since 0.0.2
 * @version 0.0.1
 * @param {function} selector */
export function useDateTimeContextStore<T>(selector: (state: DateTimeContextProps) => T) {
  const context = useContext(DateTimeContext);
  if (!context) throw new Error("DateTimeContext.Provider is missing");
  return useStore(context, selector);
}
