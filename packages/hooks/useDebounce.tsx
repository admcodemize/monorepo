import React from "react";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @param {any}value - The value to debounce
 * @param {number} delay - The delay in milliseconds
 * @function */
export const useDebounce = (
  value: any,
  delay: number
) => {
  const [debouncedValue, setDebouncedValue] = React.useState<any>(value);
  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};