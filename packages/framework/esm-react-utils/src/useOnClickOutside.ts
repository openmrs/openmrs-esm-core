/** @module @category UI */
import { useRef, useEffect } from 'react';

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  handler: (event: MouseEvent) => void,
  active = true,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (!active || !ref.current || ref.current.contains(event.target as Node)) {
        return;
      }

      handler(event);
    };

    window.addEventListener(`mousedown`, listener);
    window.addEventListener(`touchstart`, listener);
    return () => {
      window.removeEventListener(`mousedown`, listener);
      window.removeEventListener(`touchstart`, listener);
    };
  }, [handler, active]);

  return ref;
}
