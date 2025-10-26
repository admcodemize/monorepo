import { createContext, PropsWithChildren, useContext, useState } from "react";
import { createStore, StoreApi, useStore } from "zustand";

import { ChartLineAreaDataProps } from "@/components/chart/ChartLineArea";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @enum */
export enum DashboardDropdownItemKeyDays {
  last30Days = "last30Days",
  last90Days = "last90Days",
  allTime = "allTime"
}

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type DashboardDropdownProps = {
  itemKeyTeam: string|number;
  itemKeyDays: DashboardDropdownItemKeyDays;
}

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type DashboardChartProps = {
  title: string;
  showCurrency: boolean;
  showReferenceLine1: boolean;
  lineAreaData: ChartLineAreaDataProps
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type DashboardContextProps = {
  chart: DashboardChartProps;
  dropdown: DashboardDropdownProps;
  setChartProperties: (title: string, showCurrency: boolean) => void;
  setDropdown: (property: string, value: string|number|DashboardDropdownItemKeyDays) => void;
};

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
type DashboardProviderProps = PropsWithChildren & {
  chart: DashboardChartProps;
  dropdown: DashboardDropdownProps;
}

const DashboardContext = createContext<StoreApi<DashboardContextProps>|undefined>(undefined);

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description 
 * @since 0.0.2
 * @version 0.0.1 */
export default function DashboardProvider({ 
  chart,
  dropdown,
  children 
}: DashboardProviderProps) {
  const [store] = useState(() =>
    createStore<DashboardContextProps>((set) => ({
      chart,
      setChartProperties: (title: string, showCurrency: boolean) => set((state) => ({ 
        ...state, 
        chart: { ...state.chart, title, showCurrency } 
      })),
      dropdown,
      setDropdown: (property: string, value: string|number|DashboardDropdownItemKeyDays) => set((state) => ({ 
        ...state,
        dropdown: { ...state.dropdown, [property]: value as string|number|DashboardDropdownItemKeyDays } 
      }))
    }))
  );

  return (
    <DashboardContext.Provider 
      value={store}>
        {children}
    </DashboardContext.Provider>
  );
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description 
 * @since 0.0.2
 * @version 0.0.1
 * @param {function} selector */
export function useDashboardContextStore<T>(selector: (state: DashboardContextProps) => T) {
  const context = useContext(DashboardContext);
  if (!context) throw new Error("DashboardContextContext.Provider is missing");
  return useStore(context, selector);
}
