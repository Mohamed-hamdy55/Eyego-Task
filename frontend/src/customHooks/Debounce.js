import { useState, useEffect } from "react";

/**
 * Debounce Hook: delays the update of the value until a specified time has passed
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay time in milliseconds (default: 300ms)
 * @returns {any} The debounced value
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
