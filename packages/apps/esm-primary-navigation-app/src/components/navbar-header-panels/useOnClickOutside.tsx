import { RefObject, useEffect } from "react";

type AnyEvent = MouseEvent | TouchEvent;

function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: AnyEvent) => void,
  expanded: boolean
) {
  useEffect(() => {
    if (expanded) {
      const listener = (event: AnyEvent) => {
        const el = ref?.current;
        if (!el || el.contains(event.target as Node)) {
          return;
        }
        handler(event);
      };

      window.addEventListener(`click`, listener);
      return () => window.removeEventListener(`click`, listener);
    }
  }, [ref.current, handler, expanded]);
}
export default useOnClickOutside;
