import { useEffect, useState, useRef } from 'react';

export type LayoutType = 'phone' | 'tablet' | 'small-desktop' | 'large-desktop';

function getLayout(): LayoutType {
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
  const resizeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const updateLayout = () => {
      const newLayout = getLayout();

      setType((prev) => {
        if (prev === newLayout) {
          return prev;
        }
        return newLayout;
      });
    };

    const handler = () => {
      if (resizeTimeout.current !== null) {
        clearTimeout(resizeTimeout.current);
      }

      resizeTimeout.current = setTimeout(updateLayout, 100);
    };

    window.addEventListener('resize', handler);

    return () => {
      if (resizeTimeout.current !== null) {
        clearTimeout(resizeTimeout.current);
      }
      window.removeEventListener('resize', handler);
    };
  }, []);

  return type;
}

export const isDesktop = (layout: LayoutType) =>
  layout === 'small-desktop' || layout === 'large-desktop';
