import React, { useRef, useEffect } from 'react';
import ImportMapList from './import-map-list/list.component';
import styles from './import-map.styles.css';

export default function ImportMap(props: ImportMapProps) {
  const importMapListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.addEventListener('import-map-overrides:change', handleImportMapChange);
    return () => window.removeEventListener('import-map-overrides:change', handleImportMapChange);

    function handleImportMapChange() {
      props.toggleOverridden(importMapOverridden());
    }
  }, [props]);

  return (
    <div className={styles.importMap}>
      <ImportMapList ref={importMapListRef} />
    </div>
  );
}

export function importMapOverridden(): boolean {
  return Object.keys(window.importMapOverrides.getOverrideMap().imports).length > 0;
}

export function isOverriddenInImportMap(esmName: string): boolean {
  return window.importMapOverrides.getOverrideMap().imports.hasOwnProperty(esmName);
}

type ImportMapProps = {
  toggleOverridden(overridden: boolean): void;
};
