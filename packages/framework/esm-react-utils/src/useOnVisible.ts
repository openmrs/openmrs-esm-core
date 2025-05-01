/** @module @category UI */
import { type MutableRefObject, useEffect, useRef } from 'react';

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
  // casting from type MutableRefObject<HTMLElement | undefined>,
  // which is not accepted as a ref to HTMLElement.
  const ref = useRef<HTMLElement>() as MutableRefObject<HTMLElement>;
  useEffect(() => {
    const observer = new IntersectionObserver(
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

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref.current, callBack]);

  return ref;
}
