/** @module @category UI */
import { useEffect, useState } from 'react';

export type LayoutType = 'phone' | 'tablet' | 'small-desktop' | 'large-desktop';

const DEBOUNCE_DELAY = 100;

function getLayout(): LayoutType {
  const classList = document.body.classList;

  if (classList.contains('omrs-breakpoint-lt-tablet')) return 'phone';
  if (classList.contains('omrs-breakpoint-gt-small-desktop')) return 'large-desktop';
  if (classList.contains('omrs-breakpoint-gt-tablet')) return 'small-desktop';

  return 'tablet';
}

export function useLayoutType() {
  const [type, setType] = useState<LayoutType>(getLayout);

  useEffect(() => {
    let debounceTimer: ReturnType<typeof setTimeout>;

    const handler = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const newLayout = getLayout();
        setType((prev) => (prev !== newLayout ? newLayout : prev));
      }, DEBOUNCE_DELAY);
    };

    window.addEventListener('resize', handler);
    return () => {
      clearTimeout(debounceTimer);
      window.removeEventListener('resize', handler);
    };
  }, []);

  return type;
}

export const isDesktop = (layout: LayoutType) => layout === 'small-desktop' || layout === 'large-desktop';
