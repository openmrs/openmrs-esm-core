import React, { useRef, useEffect } from "react";
import styles from "./import-map.styles.css";

export default function ImportMap(props: ImportMapProps) {
  const importMapListRef = useRef<HTMLElement>(null);

  useEffect(() => {
    window.addEventListener(
      "import-map-overrides:change",
      handleImportMapChange
    );
    return () =>
      window.removeEventListener(
        "import-map-overrides:change",
        handleImportMapChange
      );

    function handleImportMapChange(evt) {
      props.toggleOverridden(importMapOverridden());
    }
  }, [props]);

  return (
    <div className={styles.importMap}>
      <import-map-overrides-list
        ref={importMapListRef}
      ></import-map-overrides-list>
    </div>
  );
}

export function importMapOverridden(): boolean {
  return (
    Object.keys(window.importMapOverrides.getOverrideMap().imports).length > 0
  );
}

export function isOverriddenInImportMap(esmName: string): boolean {
  return window.importMapOverrides
    .getOverrideMap()
    .imports.hasOwnProperty(esmName);
}

type ImportMapProps = {
  toggleOverridden(overridden: boolean): void;
};
