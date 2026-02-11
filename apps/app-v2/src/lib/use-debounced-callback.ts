import { useCallback, useRef } from 'react';

/**
 * Returns a debounced version of the callback that delays invoking until after
 * the specified delay has elapsed since the last time the debounced function was invoked.
 *
 * @param callback - The function to debounce
 * @param delay - The number of milliseconds to delay (default: 300ms)
 * @returns A debounced version of the callback
 *
 * @example
 * const debouncedSearch = useDebouncedCallback((value: string) => {
 *   onSearchChange(value);
 * }, 300);
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay = 300,
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  );
}
