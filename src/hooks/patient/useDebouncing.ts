import { useState, useEffect } from "react";

/**
 * Custom hook to debounce (delay) a value.
 * @param value The value to be debounced (e.g., a search term).
 * @param delay The delay time in milliseconds (e.g., 500).
 * @returns The debounced value.
 */
export function useDebounce<T>(value: T, delay: number): T {
  // 1. State to store the debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 2. Creates a timer that will execute after the 'delay'
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 3. Cleans up the timer if 'value' or 'delay' changes.
    //    This is crucial: if the user keeps typing, the previous
    //    timer is canceled and a new one is created.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Solo se re-ejecuta si el valor o el delay cambian

  // 4. Returns the last stable value
  return debouncedValue;
}
