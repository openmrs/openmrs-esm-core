import React, { useState } from 'react';
import classNames from 'classnames';
import { Button } from '@carbon/react';
import { type AppProps } from 'single-spa';
import { importMapOverridden } from './import-map.component';
import DevToolsPopup from './devtools-popup.component';
import styles from './devtools.styles.scss';

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
      <Button
        className={classNames(styles.devtoolsTriggerButton, {
          [styles.overridden]: isOverridden,
        })}
        kind="ghost"
        onClick={toggleDevTools}
        size="md"
      >
        {'{\u00B7\u00B7\u00B7}'}
      </Button>
      {devToolsOpen && <DevToolsPopup close={toggleDevTools} toggleOverridden={toggleOverridden} />}
    </>
  );
}
