import React, { useRef, useEffect } from 'react';
import ImportMapList from './import-map-list/list.component';
import styles from './import-map.styles.css';

type ImportMapProps = {
  toggleOverridden(overridden: boolean): void;
};

const IMPORT_MAP_CHANGE_EVENT = 'import-map-overrides:change';

export default function ImportMap({ toggleOverridden }: ImportMapProps) {
  const importMapListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleImportMapChange = () => {
      toggleOverridden(importMapOverridden());
    };

    window.addEventListener(IMPORT_MAP_CHANGE_EVENT, handleImportMapChange);
    return () => window.removeEventListener(IMPORT_MAP_CHANGE_EVENT, handleImportMapChange);
  }, [toggleOverridden]);

  return <div className={styles.importMap}>{<ImportMapList ref={importMapListRef} />}</div>;
}

export function importMapOverridden(): boolean {
  return Object.keys(window.importMapOverrides.getOverrideMap().imports).length > 0;
}

export function isOverriddenInImportMap(esmName: string): boolean {
  return window.importMapOverrides.getOverrideMap().imports.hasOwnProperty(esmName);
}
