/** @module @category UI */
import { useEffect } from "react";

export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (active) {
      const original = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [active]);
}
