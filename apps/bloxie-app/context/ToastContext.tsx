import { createContext, PropsWithChildren, useContext, useState } from "react";
import { createStore, useStore, StoreApi } from "zustand";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.14
 * @version 0.0.1
 * @enum */
export type ToastType = "success" | "error" | "info" | "warning";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.14
 * @version 0.0.1
 * @type */
export type ToastContextProps = {
  isOpen: boolean;
  showTypeIcon?: boolean;
  data?: ToastContextDataProps|null;
  children?: React.ReactNode|React.ReactElement|null|(() => React.ReactNode|React.ReactElement);
  open: (props?: ToastContextOpenProps) => void;
  close: () => void;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.14
 * @version 0.0.1
 * @type */
export type ToastContextDataProps = {
  type?: ToastType;
  title: string;
  description?: string;
  icon: IconProp;
  closeAfter?: number;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.14
 * @version 0.0.1
 * @type */
export type ToastContextOpenProps = {
  showTypeIcon?: boolean;
  data?: ToastContextDataProps;
  children?: React.ReactNode|React.ReactElement|null|(() => React.ReactNode|React.ReactElement);
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.14
 * @version 0.0.1
 * @type */
export type ToastProviderProps = PropsWithChildren & {}

const ToastContext = createContext<StoreApi<ToastContextProps>|undefined>(undefined);

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description 
 * @since 0.0.14
 * @version 0.0.1 */
export default function ToastProvider({ 
  children 
}: ToastProviderProps) {
  const [store] = useState(() =>
    createStore<ToastContextProps>((set) => ({
      isOpen: false,
      data: null,
      children: null,
      showTypeIcon: true,
      open: (props) => set((state) => ({ ...state, data: props?.data, children: props?.children, isOpen: true, showTypeIcon: props?.showTypeIcon })),
      close: () => {
        /** @description State update for the toast component */
        set((state) => ({ ...state, isOpen: false }));
        setTimeout(() => {
          set((state) => ({ 
            ...state, 
            children: null, 
            data: null 
          }));
        }, 500);
      },
    }))
  );

  return (
    <ToastContext.Provider 
      value={store}>
        {children}
    </ToastContext.Provider>
  );
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description 
 * @since 0.0.14
 * @version 0.0.1
 * @param {function} selector */
export function useToastStore<T>(selector: (state: ToastContextProps) => T) {
  const context = useContext(ToastContext);
  if (!context) throw new Error("ToastContext.Provider is missing");
  return useStore(context, selector);
}
