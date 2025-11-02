import { PropsWithChildren } from "react";
import { createContext, useContext, useState } from "react";
import { createStore, useStore, StoreApi } from "zustand";

import { ConvexSettingsAPIProps, ConvexTimesAPIProps } from "@codemize/backend/Types";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type UserContextProps = {
  settings: ConvexSettingsAPIProps;
  times: ConvexTimesAPIProps[];
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
 * @description 
 * @since 0.0.2
 * @version 0.0.1 */
export default function UserProvider({ 
  settings,
  times,
  children 
}: UserProviderProps) {
  const [store] = useState(() =>
    createStore<UserContextProps>((set) => ({
      settings,
      times
    }))
  );

  return (
    <UserContext.Provider 
      value={store}>
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
