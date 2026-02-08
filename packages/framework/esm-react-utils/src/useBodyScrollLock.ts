/** @module @category UI */
import { useEffect } from 'react';

/**
 * A React hook that prevents scrolling on the document body when active.
 * Useful for modals, overlays, or any full-screen UI that should prevent
 * background scrolling. The original overflow style is restored when the
 * hook becomes inactive or the component unmounts.
 *
 * @param active Whether to lock the body scroll. When `true`, sets
 *   `document.body.style.overflow` to 'hidden'.
 *
 * @example
 * ```tsx
 * import { useBodyScrollLock } from '@openmrs/esm-framework';
 * function Modal({ isOpen }) {
 *   useBodyScrollLock(isOpen);
 *   return isOpen ? <div className="modal">...</div> : null;
 * }
 * ```
 */
export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (active) {
      const original = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [active]);
}
