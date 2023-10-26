/** @module @category UI */
import { useRef, useEffect } from "react";

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  handler: (event: Event) => void,
  active = true
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (active) {
      const listener = (event: Event) => {
        if (ref?.current?.contains(event.target as Node)) {
          return;
        }

        handler(event);
      };

      window.addEventListener(`click`, listener);
      return () => window.removeEventListener(`click`, listener);
    }
  }, [handler, active]);

  return ref;
}
