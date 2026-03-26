/** @module @category UI */
import { useEffect, useState } from 'react';

export type LayoutType = 'phone' | 'tablet' | 'small-desktop' | 'large-desktop';

function getLayout() {
  let layout: LayoutType = 'tablet';

  document.body.classList.forEach((cls) => {
    switch (cls) {
      case 'omrs-breakpoint-lt-tablet':
        layout = 'phone';
        break;
      case 'omrs-breakpoint-gt-small-desktop':
        layout = 'large-desktop';
        break;
      case 'omrs-breakpoint-gt-tablet':
        layout = 'small-desktop';
        break;
    }
  });

  return layout;
}

export function useLayoutType() {
  const [type, setType] = useState<LayoutType>(getLayout);

  useEffect(() => {
    let resizeTimeout: ReturnType<typeof setTimeout>;

    const handler = () => {
      clearTimeout(resizeTimeout);

      resizeTimeout = setTimeout(() => {
        const newLayout = getLayout();

        // Prevent unnecessary re-renders
        setType((prev) => (prev !== newLayout ? newLayout : prev));
      }, 100);
    };

    window.addEventListener('resize', handler);

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handler);
    };
  }, []);

  return type;
}

export const isDesktop = (layout: LayoutType) => layout === 'small-desktop' || layout === 'large-desktop';
