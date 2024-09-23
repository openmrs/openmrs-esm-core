import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-dracula';
import { clearConfigErrors, temporaryConfigStore, useStore } from '@openmrs/esm-framework/src/internal';
import styles from './json-editor.scss';

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
      setError(e.message);
      return;
    }
    setError('');
    clearConfigErrors();
    temporaryConfigStore.setState({ config });
  }, [editorValue, temporaryConfigStore]);

  useEffect(() => {
    if (editorValue != JSON.stringify(temporaryConfig.config, null, 2)) {
      setKey((k) => `${k}+`); // just keep appendingplus signs
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
