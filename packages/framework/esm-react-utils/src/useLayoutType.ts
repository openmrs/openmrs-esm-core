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
    const handleLayoutChange = () => {
      setType(getLayout());
    };

    // normal resize
    window.addEventListener('resize', handleLayoutChange);

    // tab moved to new window / focus change
    window.addEventListener('focus', handleLayoutChange);

    // visibility change (browser context switch)
    document.addEventListener('visibilitychange', handleLayoutChange);

    return () => {
      window.removeEventListener('resize', handleLayoutChange);
      window.removeEventListener('focus', handleLayoutChange);
      document.removeEventListener('visibilitychange', handleLayoutChange);
    };
  }, []);

  return type;
}

export const isDesktop = (layout: LayoutType) => layout === 'small-desktop' || layout === 'large-desktop';
