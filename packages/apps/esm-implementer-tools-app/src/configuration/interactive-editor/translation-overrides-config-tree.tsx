import React, { useEffect, useMemo, useRef } from 'react';
import EditableValue from './editable-value.component';
import isEqual from 'lodash-es/isEqual';
import { Subtree } from './layout/subtree.component';
import { implementerToolsStore } from '../../store';
import { useStore } from 'zustand';
import { useSession } from '@openmrs/esm-framework';

interface TranslationOverridesLanguageConfig {
  [key: string]: string | undefined;
  _source?: string;
}

interface TranslationOverridesConfig {
  [language: string]: TranslationOverridesLanguageConfig;
}

interface TranslationOverridesConfigTreeProps {
  translationOverridesConfig: TranslationOverridesConfig;
  moduleName: string;
}

export function TranslationOverridesConfigTree({
  translationOverridesConfig,
  moduleName,
}: TranslationOverridesConfigTreeProps) {
  const session = useSession();
  const allowedLocales = session?.allowedLocales ?? [];

  const languageNames = useMemo(
    () =>
      Object.fromEntries(
        allowedLocales.map((locale) => [
          locale,
          new Intl.DisplayNames([locale], { type: 'language' }).of(locale) || locale,
        ]),
      ),
    [allowedLocales],
  );

  return (
    <Subtree label="Translation overrides" leaf={false}>
      {allowedLocales.map((locale) => (
        <TranslationOverridesLanguageTree
          key={locale}
          language={languageNames[locale]}
          config={translationOverridesConfig?.[locale] || {}}
          path={[moduleName, 'Translation overrides', locale]}
        />
      ))}
    </Subtree>
  );
}

interface TranslationOverridesLanguageTreeProps {
  language: string;
  config: TranslationOverridesLanguageConfig;
  path: string[];
}

function TranslationOverridesLanguageTree({ language, config, path }: TranslationOverridesLanguageTreeProps) {
  const { uiSelectedPath } = useStore(implementerToolsStore);
  const itemRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const shouldFocus = isEqual(uiSelectedPath, path);
    if (shouldFocus) {
      itemRef.current?.scrollIntoView();
    }
  }, [uiSelectedPath, path]);

  function setActiveLanguageOnMouseEnter(moduleName, language) {
    if (!implementerToolsStore.getState().configPathBeingEdited) {
      implementerToolsStore.setState({
        activeItemDescription: {
          path: [moduleName, 'Translation overrides', language],
          value: language,
          description: `Translation overrides for ${language}`,
        },
      });
    }
  }

  function removeActiveItemDescriptionOnMouseLeave(thisPath) {
    const state = implementerToolsStore.getState();
    if (isEqual(state.activeItemDescription?.path, thisPath) && !isEqual(state.configPathBeingEdited, thisPath)) {
      implementerToolsStore.setState({ activeItemDescription: undefined });
    }
  }

  return (
    <Subtree
      label={language}
      ref={itemRef}
      leaf={true}
      onMouseEnter={() => setActiveLanguageOnMouseEnter(path[0], language)}
      onMouseLeave={() => removeActiveItemDescriptionOnMouseLeave([path[0], 'Translation overrides', language])}
    >
      <EditableValue
        path={path}
        element={{
          _value: config || {},
          _source: config?._source ?? 'default',
          _default: {},
          _description: 'Add, edit, or remove translation strings.',
        }}
        customType="translation-overrides"
      />
    </Subtree>
  );
}
