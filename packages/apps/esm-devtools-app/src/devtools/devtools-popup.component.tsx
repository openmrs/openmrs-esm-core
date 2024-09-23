import React from 'react';
import { Button } from '@carbon/react';
import { CloseIcon } from '@openmrs/esm-framework';
import ImportMap from './import-map.component';
import styles from './devtools-popup.styles.scss';

export default function DevToolsPopup(props: DevToolsPopupProps) {
  return (
    <div className={styles.popup}>
      <ImportMap toggleOverridden={props.toggleOverridden} />
      <div className={styles.farRight}>
        <Button
          className={styles.closeButton}
          kind="secondary"
          renderIcon={() => <CloseIcon size={16} />}
          iconDescription="Close"
          onClick={props.close}
          hasIconOnly
          size="sm"
        />
      </div>
    </div>
  );
}

type DevToolsPopupProps = {
  close(): void;
  toggleOverridden(isOverridden: boolean): void;
};
