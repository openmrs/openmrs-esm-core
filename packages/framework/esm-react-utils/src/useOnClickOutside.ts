/** @module @category UI */
import { useRef, useEffect } from 'react';

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  handler: (event: MouseEvent) => void,
  active = true,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!active || !ref.current || !event.target || !(event.target instanceof Node)) {
        return;
      }

      if (ref.current.contains(event.target)) {
        return;
      }

      handler(event as MouseEvent);
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
