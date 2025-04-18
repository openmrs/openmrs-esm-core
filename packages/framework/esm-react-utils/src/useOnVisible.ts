/** @module @category UI */
import { useCallback, useRef } from 'react';

/**
 * Returns a ref that can be used on a HTML component to trigger
 * an action when the component is scrolled into visible view,
 * This is particularly useful for infinite scrolling UIs to load data on demand.
 *
 * @param callBack The callback to run when the component is scrolled into visible view.
 *   Care should be taken with this param. The callback should
 *   be cached across re-renders (via useCallback) and it should have
 *   logic to avoid doing work multiple times while scrolling.
 * @returns a ref that can be passed to an HTML Element
 */
export function useOnVisible(callBack: () => void) {
  const observer = useRef<IntersectionObserver | null>(null);
  const ref = useCallback(
    (node: Element | null) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              callBack();
              return;
            }
          }
        },
        {
          threshold: 1,
        },
      );
      if (node) observer.current.observe(node);
    },
    [callBack],
  );

  return ref;
}
