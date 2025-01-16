import React, { useState } from 'react';
import classNames from 'classnames';
import { IconButton } from '@carbon/react';
import { type AppProps } from 'single-spa';
import { getCoreTranslation } from '@openmrs/esm-framework';
import { importMapOverridden } from './import-map.component';
import DevToolsPopup from './devtools-popup.component';
import styles from './devtools.styles.css';

const showDevTools = () => window.spaEnv === 'development' || Boolean(localStorage.getItem('openmrs:devtools'));

export default function Root(props: AppProps) {
  return showDevTools() ? <DevTools {...props} /> : null;
}

function DevTools(props: AppProps) {
  const [devToolsOpen, setDevToolsOpen] = useState(false);
  const [isOverridden, setIsOverridden] = useState(importMapOverridden);

  const toggleDevTools = () => setDevToolsOpen((devToolsOpen) => !devToolsOpen);
  const toggleOverridden = (overridden: boolean) => setIsOverridden(overridden);

  return (
    <>
      <IconButton
        className={classNames(styles.devtoolsTriggerButton, {
          [styles.overridden]: isOverridden,
        })}
        kind="ghost"
        label={getCoreTranslation('toggleDevTools')}
        onClick={toggleDevTools}
        size="md"
      >
        {'{\u00B7\u00B7\u00B7}'}
      </IconButton>
      {devToolsOpen && <DevToolsPopup close={toggleDevTools} toggleOverridden={toggleOverridden} />}
    </>
  );
}
