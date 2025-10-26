import { useDropdownContextStore } from "@/context/DropdownContext";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.1 */
export const useDropdown = () => {
  /**
   * @description Handles the visibility of the global dropdown component
   * @see {@link context/DropdownContext} */
   return useDropdownContextStore((state) => state);
}