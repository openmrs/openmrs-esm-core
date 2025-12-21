import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import AceEditor from 'react-ace';
import { Button } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { clearConfigErrors, temporaryConfigStore, useStore } from '@openmrs/esm-framework/src/internal';
import styles from './json-editor.scss';

import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-dracula';
import ace from 'ace-builds/src-noconflict/ace';

// Configure ace to bundle workers locally (webpack 5 asset modules)
// Using new URL() syntax instead of deprecated file-loader or CDN for offline compatibility
ace.config.setModuleUrl(
  'ace/mode/json_worker',
  new URL('ace-builds/src-noconflict/worker-json.js', import.meta.url).href,
);

export interface JsonEditorProps {
  /** A CSS value */
  height: string;
}

export default function JsonEditor({ height }: JsonEditorProps) {
  const { t } = useTranslation();
  const temporaryConfig = useStore(temporaryConfigStore);
  const [editorValue, setEditorValue] = useState('');
  const [error, setError] = useState('');
  const [key, setKey] = useState(`ace-editor`);

  const updateTemporaryConfig = useCallback(() => {
    let config;
    try {
      config = JSON.parse(editorValue);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
      return;
    }
    setError('');
    clearConfigErrors();
    temporaryConfigStore.setState({ config });
  }, [editorValue, temporaryConfig.config]);

  useEffect(() => {
    if (editorValue != JSON.stringify(temporaryConfig.config, null, 2)) {
      setKey((k) => `${k}+`); // just keep appending plus signs
    }
  }, [temporaryConfig.config]);

  return (
    <div>
      <AceEditor
        defaultValue={JSON.stringify(temporaryConfig.config, null, 2)}
        fontSize="1rem"
        height={`calc(${height} - 3rem)`}
        key={key}
        mode="json"
        onChange={(v) => setEditorValue(v)}
        setOptions={{
          useWorker: false,
        }}
        showGutter
        showPrintMargin={false}
        tabSize={2}
        theme="dracula"
        width="100vw"
      />
      <div className={styles.toolbar}>
        <Button size="md" type="submit" onClick={updateTemporaryConfig}>
          {t('updateConfig', 'Update config')}
        </Button>
        <div
          className={classNames(styles.alert, {
            [styles.errorBackground]: error,
          })}
        >
          {error}
        </div>
      </div>
    </div>
  );
}
