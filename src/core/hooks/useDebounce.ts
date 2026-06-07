/** Generic debounce hook for search inputs. */
import { useState, useEffect } from "react";

/** Debounce a value by delay ms. @param value The value to debounce. @param delay Delay in ms. @returns Debounced value. */
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
