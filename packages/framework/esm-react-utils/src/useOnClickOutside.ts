/** @module @category UI */
import { useRef, useEffect } from 'react';

/**
 * A React hook that detects clicks outside of a referenced element. Useful for
 * implementing dropdown menus, modals, or any component that should close when
 * clicking outside of it.
 *
 * @typeParam T The type of HTML element the ref will be attached to.
 * @param handler A callback function invoked when a click occurs outside the
 *   referenced element.
 * @param active Whether the outside click detection is active. Defaults to `true`.
 *   Set to `false` to temporarily disable the detection.
 * @returns A React ref object to attach to the element you want to detect
 *   outside clicks for.
 *
 * @example
 * ```tsx
 * import { useOnClickOutside } from '@openmrs/esm-framework';
 * function Dropdown() {
 *   const [isOpen, setIsOpen] = useState(false);
 *   const ref = useOnClickOutside<HTMLDivElement>(() => setIsOpen(false), isOpen);
 *   return (
 *     <div ref={ref}>
 *       {isOpen && <ul>...</ul>}
 *     </div>
 *   );
 * }
 * ```
 */
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
