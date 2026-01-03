import React, { createContext, PropsWithChildren, useContext } from "react";
import { createStore, StoreApi, useStore } from "zustand";

import { ConvexTemplateAPIProps, ConvexWorkflowQueryAPIProps } from "@codemize/backend/Types";

const ConfigurationContext = createContext<StoreApi<ConfigurationContextProps>|undefined>(undefined);

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.37
 * @version 0.0.1
 * @type */
export type ConfigurationProviderProps = PropsWithChildren & {}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.37
 * @version 0.0.2
 * @type */
export type ConfigurationContextProps = {
  templates: ConvexTemplateAPIProps[];
  setTemplates: (templates: ConvexTemplateAPIProps[]) => void;
  workflows: ConvexWorkflowQueryAPIProps[];
  setWorkflows: (workflows: ConvexWorkflowQueryAPIProps[]) => void;
}

/**
 * @description Create the store and initialize the state
 * @returns {StoreApi<ConfigurationContextProps>} - The store */
export const store = (
): StoreApi<ConfigurationContextProps> => createStore<ConfigurationContextProps>()((set, get) => ({
  templates: [],
  setTemplates: (templates: ConvexTemplateAPIProps[]) => set((state) => ({ ...state, templates })),
  workflows: [],
  setWorkflows: (workflows: ConvexWorkflowQueryAPIProps[]) => set((state) => ({ ...state, workflows })),
}));

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description 
 * @since 0.0.37
 * @version 0.0.1 */
export default function ConfigurationProvider({ 
  children, 
}: ConfigurationProviderProps) {
  /** @description Create a new store instance for the workflow context */
  const [storeInstance] = React.useState(() => store());

  return (
    <ConfigurationContext.Provider 
      value={storeInstance}>
        {children}
    </ConfigurationContext.Provider>
  );
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description 
 * @since 0.0.37
 * @version 0.0.1
 * @param {function} selector */
export function useConfigurationContextStore<T>(selector: (state: ConfigurationContextProps) => T) {
  const context = useContext(ConfigurationContext);
  if (!context) throw new Error("ConfigurationContext.Provider is missing");
  return useStore(context, selector);
}
