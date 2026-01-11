import * as React from "react";
import { createContext, useContext } from "react";
import { createStore, useStore, StoreApi } from "zustand";

import { ConvexLinkedAPIProps, ConvexRuntimeAPIProps, ConvexSettingsAPIProps, ConvexTimesAPIProps } from "@codemize/backend/Types";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.4
 * @type */
export type UserContextProps = {
  runtime: ConvexRuntimeAPIProps;
  settings: ConvexSettingsAPIProps;
  linkedMailAccounts: ConvexLinkedAPIProps[];
  times: ConvexTimesAPIProps[];
  setSettings: (settings: ConvexSettingsAPIProps) => void;
  setSettingsProperty: (property: string, value: boolean|string) => void;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.2
 * @type */
export type UserProviderProps = React.PropsWithChildren & {
  runtime: ConvexRuntimeAPIProps;
  settings: ConvexSettingsAPIProps;
  linkedMailAccounts: ConvexLinkedAPIProps[];
  times: ConvexTimesAPIProps[];
}

const UserContext = createContext<StoreApi<UserContextProps>|undefined>(undefined);

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.16
 * @version 0.0.3
 * @description Create the store and initialize the state
 * @param {ConvexSettingsAPIProps} settings - The settings of the currently signed in user.
 * @param {ConvexTimesAPIProps[]} times - The times of the currently signed in user.
 * @returns {StoreApi<UserContextProps>} - The store */
export const store = (
  runtime: ConvexRuntimeAPIProps,
  settings: ConvexSettingsAPIProps,
  linkedMailAccounts: ConvexLinkedAPIProps[],
  times: ConvexTimesAPIProps[]
): StoreApi<UserContextProps> => createStore<UserContextProps>()((set, get) => ({
  runtime,
  settings,
  linkedMailAccounts,
  times,
  setSettings: (settings: ConvexSettingsAPIProps) => set((state) => ({ ...state, settings })),
  setSettingsProperty: (property: string, value: boolean|string) => set((state) => ({ 
    ...state, 
    settings: { 
      ...state.settings, 
      [property]: value 
    } 
  })),
}));

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description 
 * @since 0.0.2
 * @version 0.0.4 */
export default function UserProvider({ 
  runtime,
  settings,
  linkedMailAccounts,
  times,
  children 
}: UserProviderProps) {
  const [storeInstance] = React.useState(() => store(runtime, settings, linkedMailAccounts, times));
  return (
    <UserContext.Provider 
      value={storeInstance}>
        {children}
    </UserContext.Provider>
  );
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description 
 * @since 0.0.2
 * @version 0.0.1
 * @param {function} selector */
export function useUserContextStore<T>(selector: (state: UserContextProps) => T) {
  const context = useContext(UserContext);
  if (!context) throw new Error("UserContext.Provider is missing");
  return useStore(context, selector);
}
