import React from 'react';
import { Button } from '@carbon/react';
import { Close } from '@carbon/react/icons';
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
          renderIcon={(props) => <Close size={16} {...props} />}
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
