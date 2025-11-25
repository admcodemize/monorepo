import React, { createContext, PropsWithChildren, useContext } from "react";
import { createStore, StoreApi, useStore } from "zustand";

import { ConvexCalendarQueryAPIProps } from "../../../packages/backend/Types";

const IntegrationContext = createContext<StoreApi<IntegrationContextProps>|undefined>(undefined);

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.13
 * @version 0.0.1
 * @type */
export type IntegrationProviderProps = PropsWithChildren & {}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.13
 * @version 0.0.1
 * @type */
export type IntegrationContextProps = {
  integrations: ConvexCalendarQueryAPIProps[];
  setIntegrations: (integrations: ConvexCalendarQueryAPIProps[]) => void;
}

/**
 * @description Create the store and initialize the state
 * @returns {StoreApi<IntegrationContextProps>} - The store */
export const store = (
): StoreApi<IntegrationContextProps> => createStore<IntegrationContextProps>()((set, get) => ({
  integrations: [],
  setIntegrations: (integrations: ConvexCalendarQueryAPIProps[]) => set((state) => ({ ...state, integrations })),
}));

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description 
 * @since 0.0.13
 * @version 0.0.1 */
export default function IntegrationProvider({ 
  children, 
}: IntegrationProviderProps) {
  /** @description Create a new store instance for the calendar context */
  const [storeInstance] = React.useState(() => store());

  return (
    <IntegrationContext.Provider 
      value={storeInstance}>
        {children}
    </IntegrationContext.Provider>
  );
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description 
 * @since 0.0.13
 * @version 0.0.1
 * @param {function} selector */
export function useIntegrationContextStore<T>(selector: (state: IntegrationContextProps) => T) {
  const context = useContext(IntegrationContext);
  if (!context) throw new Error("IntegrationContext.Provider is missing");
  return useStore(context, selector);
}
