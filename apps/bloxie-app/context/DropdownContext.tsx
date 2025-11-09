import { createContext, PropsWithChildren, useContext, useState } from "react";
import { createStore, StoreApi, useStore } from "zustand";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type DropdownContextProps = {
  isOpen: boolean;
  children: React.ReactNode;
  position: DropdownContextPositionProps|null;
  open: (children: React.ReactNode, position: DropdownContextPositionProps|null) => void;
  close: () => void;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.2
 * @type */
export type DropdownContextPositionProps = {
  top: number; 
  left?: number;
  right?: number;
}

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
type DropdownProviderProps = PropsWithChildren & {}

const DropdownOverlayContext = createContext<StoreApi<DropdownContextProps>|undefined>(undefined);

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description 
 * @since 0.0.2
 * @version 0.0.1 */
export default function DropdownProvider({ 
  children 
}: DropdownProviderProps) {
  const [store] = useState(() =>
    createStore<DropdownContextProps>((set) => ({
      isOpen: false,
      children: null,
      position: null,
      initialDropdownItemIdx: null,
      open: (children, position) => set((state) => ({ ...state, children, position, isOpen: true })),
      close: () => set((state) => ({ ...state, isOpen: false, children: null, position: null, initialDropdownItemIdx: null })),
    }))
  );

  return (
    <DropdownOverlayContext.Provider 
      value={store}>
        {children}
    </DropdownOverlayContext.Provider>
  );
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description 
 * @since 0.0.2
 * @version 0.0.1
 * @param {function} selector */
export function useDropdownContextStore<T>(selector: (state: DropdownContextProps) => T) {
  const context = useContext(DropdownOverlayContext);
  if (!context) throw new Error("DropdownContextContext.Provider is missing");
  return useStore(context, selector);
}
