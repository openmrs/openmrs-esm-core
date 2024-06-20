import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { addRoutesOverride, removeRoutesOverride } from '@openmrs/esm-framework/src/internal';
import { Button, Form, ModalHeader, ModalBody, ModalFooter, TextInput } from '@carbon/react';
import type { Module } from './types';
import styles from './import-map.scss';

type ImportMapModalProps = ({ module: Module; isNew: false } | { module: never; isNew: true }) & { close: () => void };

const isPortRegex = /^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/;

async function getUrlFromPort(moduleName: string, port: string) {
  const latestImportMap = await window.importMapOverrides.getNextPageMap();
  const moduleUrl = latestImportMap.imports[moduleName];

  if (!moduleUrl) {
    const fileName = moduleName.replace(/@/g, '').replace(/\//g, '-');
    return `${window.location.protocol}//localhost:${port}/${fileName}.js`;
  }

  if (moduleUrl.endsWith('/')) {
    return `${window.location.protocol}//localhost:${port}${moduleUrl}`;
  }

  return `${window.location.protocol}//localhost:${port}/${moduleUrl.substring(moduleUrl.lastIndexOf('/') + 1)}`;
}

const ImportMapModal: React.FC<ImportMapModalProps> = ({ module, isNew, close }) => {
  const { t } = useTranslation();
  const [moduleName, setModuleName] = useState<string | undefined>(module?.moduleName);
  const moduleNameRef = useRef<HTMLInputElement>();
  const inputRef = useRef<HTMLInputElement>();
  const handleSubmit = useCallback(
    async (evt: Event) => {
      evt.preventDefault();

      if (!moduleName) {
        return;
      }

      if (window.importMapOverrides.isDisabled(moduleName)) {
        window.importMapOverrides.enableOverride(moduleName);
      }

      if (isNew) {
        let newUrl = inputRef.current.value || null;
        if (newUrl) {
          if (isPortRegex.test(newUrl)) {
            newUrl = await getUrlFromPort(moduleName, newUrl);
          }

          window.importMapOverrides.addOverride(moduleName, newUrl);
          const baseUrl = newUrl.substring(0, newUrl.lastIndexOf('/'));
          addRoutesOverride(moduleName, new URL('routes.json', baseUrl));
        }
      } else {
        let newUrl = inputRef.current.value || null;
        if (newUrl === null) {
          window.importMapOverrides.removeOverride(moduleName);
          removeRoutesOverride(moduleName);
        } else {
          if (isPortRegex.test(newUrl)) {
            newUrl = await getUrlFromPort(moduleName, newUrl);
          }

          window.importMapOverrides.addOverride(moduleName, newUrl);
          const baseUrl = newUrl.substring(0, newUrl.lastIndexOf('/'));
          addRoutesOverride(moduleName, new URL('routes.json', baseUrl));
        }
      }

      close();
    },
    [moduleName, isNew, close],
  );

  useEffect(
    () => (isNew ? moduleNameRef.current?.focus() : inputRef.current?.focus()),
    // Only fired on initial mount
    [],
  );

  return (
    <>
      <ModalHeader
        closeModal={close}
        title={
          isNew
            ? t('addModule', 'Add Module')
            : t('editModule', 'Edit Module {{- moduleName}}', {
                moduleName: moduleName,
              })
        }
      />
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          {isNew && (
            <TextInput
              id="module-name"
              ref={moduleNameRef}
              onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                evt.preventDefault();
                setModuleName(evt.target.value);
              }}
              labelText={t('moduleName', 'Module Name')}
            />
          )}
          {!isNew && (
            <TextInput id="default-url" labelText={t('defaultUrl', 'Default URL')} value={module.defaultUrl} readOnly />
          )}
          <div className={styles.spacer} />
          <TextInput id="override-url" ref={inputRef} labelText={t('overrideUrl', 'Override URL')} />
        </ModalBody>
        <ModalFooter>
          <Button kind="secondary" onClick={close}>
            {t('cancel', 'Cancel')}
          </Button>
          <Button type="submit">{t('apply', 'Apply')}</Button>
        </ModalFooter>
      </Form>
    </>
  );
};

export default ImportMapModal;
