import { useEffect, useState } from 'react';

/** Returns `value` only after it has stopped changing for `delayMs` (e.g. the user stopped typing). */
export function useDebouncedValue(value, delayMs) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedValue(value), delayMs);
    // A new keystroke cancels the previous timer.
    return () => clearTimeout(timeoutId);
  }, [value, delayMs]);

  return debouncedValue;
}
