/** @module @category UI */
import { useEffect, useState } from "react";

export type LayoutType = "tablet" | "phone" | "desktop";

function getLayout() {
  let layout: LayoutType = "tablet";

  document.body.classList.forEach((cls) => {
    switch (cls) {
      case "omrs-breakpoint-lt-tablet":
        layout = "phone";
        break;
      case "omrs-breakpoint-gt-tablet":
        layout = "desktop";
        break;
    }
  });

  return layout;
}

export function useLayoutType() {
  const [type, setType] = useState<LayoutType>(getLayout);

  useEffect(() => {
    const handler = () => {
      setType(getLayout());
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return type;
}
