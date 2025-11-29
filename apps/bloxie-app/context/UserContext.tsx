import React, { PropsWithChildren } from "react";
import { createContext, useContext, useState } from "react";
import { createStore, useStore, StoreApi } from "zustand";

import { ConvexSettingsAPIProps, ConvexTimesAPIProps } from "@codemize/backend/Types";
import { ProviderIntegrationEnum } from "@/constants/Provider";
import { Id } from "../../../packages/backend/convex/_generated/dataModel";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.2
 * @type */
export type UserContextProps = {
  settings: ConvexSettingsAPIProps;
  times: ConvexTimesAPIProps[];
  setSettings: (settings: ConvexSettingsAPIProps) => void;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type UserProviderProps = PropsWithChildren & {
  settings: ConvexSettingsAPIProps;
  times: ConvexTimesAPIProps[];
}

const UserContext = createContext<StoreApi<UserContextProps>|undefined>(undefined);

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.16
 * @version 0.0.1
 * @description Create the store and initialize the state
 * @param {ConvexSettingsAPIProps} settings - The settings of the currently signed in user.
 * @param {ConvexTimesAPIProps[]} times - The times of the currently signed in user.
 * @returns {StoreApi<UserContextProps>} - The store */
export const store = (
  settings: ConvexSettingsAPIProps,
  times: ConvexTimesAPIProps[]
): StoreApi<UserContextProps> => createStore<UserContextProps>()((set, get) => ({
  settings,
  times,
  setSettings: (settings: ConvexSettingsAPIProps) => set((state) => ({ ...state, settings })),
}));

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description 
 * @since 0.0.2
 * @version 0.0.3 */
export default function UserProvider({ 
  settings,
  times,
  children 
}: UserProviderProps) {
  const [storeInstance] = React.useState(() => store(settings, times));
  
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
