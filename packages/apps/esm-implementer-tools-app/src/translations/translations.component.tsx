import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Column,
  Dropdown,
  FlexGrid,
  InlineNotification,
  Pagination,
  Row,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TextInput,
  Toggle,
} from '@carbon/react';
import { Copy, Download } from '@carbon/react/icons';
import { EditIcon, getCoreTranslation, ResetIcon } from '@openmrs/esm-framework';
import { temporaryConfigStore, useStore, useStoreWithActions } from '@openmrs/esm-framework/src/internal';
import { implementerToolsStore, type ImplementerToolsStore } from '../store';
import {
  getMissingNamespaces,
  loadTranslationLanguage,
  loadTranslationNamespace,
  temporaryConfigSource,
  type TranslationEntry,
  translationOverridesKey,
  useTranslationEntries,
  useTranslationLanguages,
  useTranslationNamespaces,
} from './translation-catalog';
import { asError } from './i18next-loads';
import {
  downloadJson,
  getLocalEdits,
  toFileSafeName,
  toOverrideFile,
  toTransifexLocale,
  transifexSourceLanguage,
} from './translation-exports';
import { reloadTranslations, resetTranslationOverride, setTranslationOverride } from './translation-overrides';
import styles from './translations.styles.scss';

/** The sentinel used by the namespace filter to mean "every namespace i18next has loaded". */
const allNamespaces = '*';

const pageSizes = [25, 50, 100];

const actions = {
  toggleIsTranslationInspectorEnabled({ isTranslationInspectorEnabled }: ImplementerToolsStore) {
    return { isTranslationInspectorEnabled: !isTranslationInspectorEnabled };
  },
};

export function Translations() {
  const { t } = useTranslation();
  const { isTranslationInspectorEnabled, selectedTranslation, toggleIsTranslationInspectorEnabled } =
    useStoreWithActions(implementerToolsStore, actions);

  const [language, setLanguage] = useState(() => window.i18next?.language ?? 'en');
  const [selectedNamespace, setSelectedNamespace] = useState(allNamespaces);
  const [filterText, setFilterText] = useState('');
  // The exact key the inspector handed over, shown alone until the search text is edited.
  const [focusedKey, setFocusedKey] = useState<string | null>(null);
  const [onlyOverridden, setOnlyOverridden] = useState(false);
  const [requestedPage, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizes[0]);
  const [loadFailure, setLoadFailure] = useState<string | null>(null);
  // Dismissing the notification hides it without forgetting the failure, which the empty state still
  // needs so as not to claim the module has no translations.
  const [isLoadFailureDismissed, setIsLoadFailureDismissed] = useState(false);
  const [actionFailure, setActionFailure] = useState<string | null>(null);
  // Counted rather than a flag: a language change can start a language load and a namespace load,
  // and the first to finish must not declare the table empty while the other is still fetching.
  const [loadCount, setLoadCount] = useState(0);
  const namespaceRequest = useRef(0);
  const languageRequest = useRef(0);

  const languages = useTranslationLanguages(language);
  const namespaces = useTranslationNamespaces(language);
  const browsedNamespaces = useMemo(
    () =>
      selectedNamespace === allNamespaces
        ? namespaces.filter((namespace) => namespace.isLoaded).map((namespace) => namespace.name)
        : [selectedNamespace],
    [namespaces, selectedNamespace],
  );

  const entries = useTranslationEntries(browsedNamespaces, language);

  const filteredEntries = useMemo(() => {
    const needle = filterText.trim().toLowerCase();

    return entries.filter((entry) => {
      if (onlyOverridden && !entry.overrideSource) {
        return false;
      }

      if (focusedKey) {
        return entry.key === focusedKey;
      }

      return !needle || entry.key.toLowerCase().includes(needle) || entry.value.toLowerCase().includes(needle);
    });
  }, [entries, filterText, focusedKey, onlyOverridden]);

  useEffect(() => {
    setPage(1);
  }, [filterText, onlyOverridden, selectedNamespace, language]);

  // The list also shrinks for reasons that don't reset the page, and Carbon's Pagination doesn't
  // pull the page back into range, leaving a blank table with no empty state.
  const page = Math.min(requestedPage, Math.max(1, Math.ceil(filteredEntries.length / pageSize)));

  // Keep the stored page in step with the clamp, so Carbon and this component never disagree about
  // which page is showing.
  useEffect(() => {
    if (requestedPage !== page) {
      setPage(page);
    }
  }, [page, requestedPage]);

  const pagedEntries = useMemo(
    () => filteredEntries.slice((page - 1) * pageSize, page * pageSize),
    [filteredEntries, page, pageSize],
  );

  // Logging outside the staleness check keeps a superseded failure traceable even when it is not
  // worth putting in front of the user.
  const reportLoadFailure = useCallback((message: string, error: unknown, isCurrent: boolean) => {
    console.error(message, error);

    if (isCurrent) {
      setLoadFailure(`${message} ${asError(error).message}`);
      setIsLoadFailureDismissed(false);
    }
  }, []);

  const reportActionFailure = useCallback((message: string, error: unknown) => {
    console.error(message, error);
    setActionFailure(`${message} ${asError(error).message}`);
  }, []);

  const clearActionFailure = useCallback(() => setActionFailure(null), []);

  const loadNamespace = useCallback(
    (namespace: string, forLanguage: string) => {
      // A slower earlier load must not report against, or clear the indicator of, the selection that
      // replaced it.
      const request = ++namespaceRequest.current;

      setLoadCount((count) => count + 1);
      loadTranslationNamespace(namespace, forLanguage)
        .catch((error) =>
          reportLoadFailure(
            t('couldNotLoadNamespace', 'Could not load this module’s translations.'),
            error,
            namespaceRequest.current === request,
          ),
        )
        .finally(() => setLoadCount((count) => count - 1));
    },
    [reportLoadFailure, t],
  );

  useEffect(() => {
    if (selectedTranslation) {
      // Like any other change of namespace, this supersedes a load still running for the previous one.
      namespaceRequest.current += 1;
      setLoadFailure(null);
      setSelectedNamespace(selectedTranslation.namespace);
      setFilterText(selectedTranslation.key);
      setFocusedKey(selectedTranslation.key);
      setOnlyOverridden(false);
      implementerToolsStore.setState({ selectedTranslation: null });

      if (!window.i18next.hasResourceBundle(language, selectedTranslation.namespace)) {
        loadNamespace(selectedTranslation.namespace, language);
      }
    }
  }, [language, loadNamespace, selectedTranslation]);

  // A selection that repeats the current one must not clear an error or start a fetch.
  const handleNamespaceChange = useCallback(
    ({ selectedItem }: { selectedItem: string | null }) => {
      if (!selectedItem || selectedItem === selectedNamespace) {
        return;
      }

      setSelectedNamespace(selectedItem);
      setLoadFailure(null);

      // Superseding any load already running, including when the new selection needs none: its
      // failure would otherwise be reported against whatever is on screen by the time it lands.
      namespaceRequest.current += 1;

      const isLoaded = namespaces.find((namespace) => namespace.name === selectedItem)?.isLoaded;

      if (selectedItem !== allNamespaces && !isLoaded) {
        loadNamespace(selectedItem, language);
      }
    },
    [language, loadNamespace, namespaces, selectedNamespace],
  );

  const handleLanguageChange = useCallback(
    ({ selectedItem }: { selectedItem: string | null }) => {
      if (!selectedItem || selectedItem === language) {
        return;
      }

      setLanguage(selectedItem);
      setLoadFailure(null);

      // Supersedes any load still running for the previous language, whose failure would otherwise
      // be reported against this one.
      namespaceRequest.current += 1;
      const request = ++languageRequest.current;

      if (getMissingNamespaces(selectedItem).length > 0) {
        setLoadCount((count) => count + 1);
        loadTranslationLanguage(selectedItem)
          .catch((error) =>
            reportLoadFailure(
              t('couldNotLoadLanguage', 'Could not load translations for this language.'),
              error,
              languageRequest.current === request,
            ),
          )
          .finally(() => setLoadCount((count) => count - 1));
      }

      // A namespace loaded on demand was fetched for the language it was picked under, and
      // `reloadResources` does not register it for later language loads, so it has to be asked for
      // again rather than reported as having no translations.
      if (selectedNamespace !== allNamespaces && !window.i18next.hasResourceBundle(selectedItem, selectedNamespace)) {
        loadNamespace(selectedNamespace, selectedItem);
      }
    },
    [language, loadNamespace, reportLoadFailure, selectedNamespace, t],
  );

  const headers = useMemo(
    () => [
      { key: 'namespace', header: t('translationNamespace', 'Namespace') },
      { key: 'key', header: t('translationKey', 'Key') },
      { key: 'value', header: t('translationValue', 'Value') },
      { key: 'source', header: t('translationSource', 'Source') },
      { key: 'actions', header: '' },
    ],
    [t],
  );

  return (
    <div className={styles.translations}>
      <div className={styles.tools}>
        <FlexGrid className={styles.toolbar}>
          <Row className={styles.row}>
            <Column>
              <TextInput
                autoComplete="off"
                id="translationSearch"
                labelText={t('searchTranslations', 'Search translations by key or text')}
                onChange={(event) => {
                  setFilterText(event.target.value);
                  setFocusedKey(null);
                }}
                value={filterText}
              />
            </Column>
            <Column>
              <Dropdown
                id="translationNamespaceFilter"
                items={[allNamespaces, ...namespaces.map((namespace) => namespace.name)]}
                itemToString={(name: string) =>
                  name === allNamespaces
                    ? t('allLoadedNamespaces', 'All loaded namespaces')
                    : namespaces.find((namespace) => namespace.name === name)?.isLoaded
                      ? name
                      : `${name} ${t('notLoadedSuffix', '(not loaded)')}`
                }
                label={t('allLoadedNamespaces', 'All loaded namespaces')}
                onChange={handleNamespaceChange}
                selectedItem={selectedNamespace}
                titleText={t('translationNamespace', 'Namespace')}
              />
            </Column>
            <Column>
              <Dropdown
                id="translationLanguageFilter"
                items={languages}
                itemToString={(item: string) => item}
                label={language}
                onChange={handleLanguageChange}
                selectedItem={language}
                titleText={t('translationLanguage', 'Language')}
              />
            </Column>
            <Column className={styles.toggleButtons}>
              <Toggle
                className={styles.toggle}
                id="onlyOverriddenSwitch"
                labelText={t('onlyOverridden', 'Only overridden')}
                onToggle={() => setOnlyOverridden((current) => !current)}
                toggled={onlyOverridden}
              />
              <Toggle
                className={styles.toggle}
                id="translationInspectorSwitch"
                labelText={t('translationInspector', 'Translation inspector')}
                onToggle={toggleIsTranslationInspectorEnabled}
                toggled={isTranslationInspectorEnabled}
              />
            </Column>
          </Row>
          <TranslationExports language={language} namespace={selectedNamespace} />
        </FlexGrid>
        {[isLoadFailureDismissed ? null : loadFailure, actionFailure].filter(Boolean).map((message) => (
          <InlineNotification
            className={styles.failure}
            key={message}
            kind="error"
            lowContrast
            onCloseButtonClick={() =>
              message === loadFailure ? setIsLoadFailureDismissed(true) : setActionFailure(null)
            }
            subtitle={message ?? undefined}
            title={t('translationsProblem', 'Something went wrong')}
          />
        ))}
      </div>
      <div className={styles.mainContent}>
        <TableContainer title="">
          <Table size="sm" useZebraStyles>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableHeader key={header.key}>{header.header}</TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {pagedEntries.map((entry) => (
                // Keyed by language as well, so that an edit in progress is discarded rather than
                // saved under whichever language is selected next.
                <TranslationRow
                  entry={entry}
                  key={`${language}|${entry.namespace}|${entry.key}`}
                  language={language}
                  onFailure={reportActionFailure}
                  onSuccess={clearActionFailure}
                />
              ))}
            </TableBody>
          </Table>
          {filteredEntries.length === 0 ? (
            <p className={styles.emptyState}>
              {loadCount > 0
                ? t('loadingTranslations', 'Loading translations…')
                : // An empty table after a failed load says nothing about whether the module has
                  // translations.
                  loadFailure
                  ? t('translationsCouldNotBeLoaded', 'These translations could not be loaded.')
                  : browsedNamespaces.length === 0
                    ? t(
                        'noNamespacesLoaded',
                        'No translations have been loaded yet. Pick a namespace above to load one.',
                      )
                    : entries.length === 0
                      ? t('namespaceHasNoTranslations', 'This module has no translations for this language.')
                      : t('noMatchingTranslations', 'No translations match your search.')}
            </p>
          ) : null}
        </TableContainer>
      </div>
      <Pagination
        className={styles.pagination}
        // Carbon has been observed reporting the current page back outside a click, so a change that
        // isn't one is dropped rather than turned into a pointless render.
        onChange={({ page: nextPage, pageSize: nextPageSize }: { page: number; pageSize: number }) => {
          setPage((current) => (current === nextPage ? current : nextPage));
          setPageSize((current) => (current === nextPageSize ? current : nextPageSize));
        }}
        page={page}
        pageSize={pageSize}
        pageSizes={pageSizes}
        size="sm"
        totalItems={filteredEntries.length}
      />
    </div>
  );
}

interface TranslationRowProps {
  entry: TranslationEntry;
  language: string;
  onFailure(message: string, error: unknown): void;
  onSuccess(): void;
}

function TranslationRow({ entry, language, onFailure, onSuccess }: TranslationRowProps) {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(entry.value);
  const [copied, setCopied] = useState(false);

  const save = useCallback(async () => {
    setTranslationOverride(entry.namespace, language, entry.key, draft);

    try {
      await reloadTranslations(entry.namespace, language);
      setEditing(false);
      onSuccess();
    } catch (error) {
      // The override did reach the temporary config, so the editor stays open holding the value
      // that was written; closing it would leave that value visible nowhere.
      onFailure(
        t('overrideSavedNotApplied', 'The override was saved but could not be applied. Reload the page to see it.'),
        error,
      );
    }
  }, [draft, entry.key, entry.namespace, language, onFailure, onSuccess, t]);

  const reset = useCallback(async () => {
    resetTranslationOverride(entry.namespace, language, entry.key);

    try {
      await reloadTranslations(entry.namespace, language, entry.key);
      setEditing(false);
      onSuccess();
    } catch (error) {
      onFailure(
        t('overrideResetNotApplied', 'The override was removed but could not be applied. Reload the page to see it.'),
        error,
      );
    }
  }, [entry.key, entry.namespace, language, onFailure, onSuccess, t]);

  return (
    <TableRow>
      <TableCell className={styles.namespaceCell}>{entry.namespace}</TableCell>
      <TableCell>
        <span className={styles.key}>{entry.key}</span>
        {entry.pluralForms.length > 0 ? (
          <p className={styles.hint}>
            {t('alsoOverridePluralForms', 'Plural forms to override too: {{forms}}', {
              forms: entry.pluralForms.join(', '),
              interpolation: { escapeValue: false },
            })}
          </p>
        ) : null}
      </TableCell>
      <TableCell>
        {editing ? (
          <div className={styles.editor}>
            <TextInput
              hideLabel
              id={`translationValue-${entry.namespace}-${entry.key}`}
              labelText={t('translationValue', 'Value')}
              onChange={(event) => setDraft(event.target.value)}
              size="sm"
              value={draft}
            />
            <Button kind="ghost" onClick={save} size="sm">
              {getCoreTranslation('save')}
            </Button>
            <Button
              kind="ghost"
              onClick={() => {
                setDraft(entry.value);
                setEditing(false);
              }}
              size="sm"
            >
              {getCoreTranslation('cancel')}
            </Button>
          </div>
        ) : (
          <span className={styles.value}>{entry.value}</span>
        )}
      </TableCell>
      <TableCell className={styles.sourceCell}>
        {entry.overrideSource ?? t('translationFile', 'Translation file')}
        {entry.sourceLanguage === language ? null : (
          <p className={styles.hint}>
            {t('valueFromFallbackLanguage', 'Value shown is {{language}}’s', {
              language: entry.sourceLanguage,
              interpolation: { escapeValue: false },
            })}
          </p>
        )}
      </TableCell>
      <TableCell>
        {/* The actions sit against the table's right edge, where a centred tooltip is cut off. */}
        <div className={styles.rowActions}>
          {editing ? null : (
            <Button
              hasIconOnly
              iconDescription={t('editValueButtonText', 'Edit')}
              kind="ghost"
              onClick={() => {
                setDraft(entry.value);
                setCopied(false);
                setEditing(true);
              }}
              renderIcon={(props) => <EditIcon size={16} {...props} />}
              size="sm"
              tooltipPosition="left"
            />
          )}
          {entry.overrideSource === temporaryConfigSource && entry.sourceLanguage === language ? (
            <Button
              hasIconOnly
              iconDescription={t('resetToDefaultValueButtonText', 'Reset to default')}
              kind="ghost"
              onClick={reset}
              renderIcon={(props) => <ResetIcon size={16} {...props} />}
              size="sm"
              tooltipPosition="left"
            />
          ) : null}
          {/* Not Carbon's CopyButton: it animates "Copied" from the click alone, even on a rejected write. */}
          {editing ? null : (
            <Button
              disabled={!navigator.clipboard}
              hasIconOnly
              iconDescription={
                navigator.clipboard
                  ? copied
                    ? t('copied', 'Copied')
                    : t('copyOverrideJson', 'Copy override JSON')
                  : t('copyNeedsHttps', 'Copying needs the page to be served over HTTPS')
              }
              kind="ghost"
              onClick={() =>
                copyOverrideJson(entry, language).then(
                  () => setCopied(true),
                  (error) =>
                    onFailure(t('couldNotCopyOverride', 'Could not copy the override to the clipboard.'), error),
                )
              }
              renderIcon={(props) => <Copy size={16} {...props} />}
              size="sm"
              tooltipPosition="left"
            />
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

/**
 * Downloads the local edits (the temporary config's overrides) for one namespace and language, either
 * as a config file for a distribution or as a translation file to upload to Transifex.
 */
function TranslationExports({ language, namespace }: { language: string; namespace: string }) {
  const { t } = useTranslation();
  const { config } = useStore(temporaryConfigStore);
  const edits = namespace === allNamespaces ? {} : getLocalEdits(config, namespace, language);
  const hasEdits = Object.keys(edits).length > 0;
  const isSourceLanguage = language === transifexSourceLanguage;

  const hint =
    namespace === allNamespaces
      ? t('pickNamespaceToExport', 'Pick a namespace to export the changes made to it.')
      : !hasEdits
        ? t('noChangesToExport', 'No changes have been made to this namespace in this language.')
        : isSourceLanguage
          ? t(
              'sourceLanguageNotExportable',
              'English is the source language in Transifex; change it in the app’s en.json instead.',
            )
          : null;

  return (
    <div className={styles.exports}>
      <Button
        disabled={!hasEdits}
        kind="tertiary"
        onClick={() =>
          downloadJson(
            `${toFileSafeName(namespace)}.${language}.overrides.json`,
            toOverrideFile(namespace, language, edits),
          )
        }
        renderIcon={(props) => <Download size={16} {...props} />}
        size="sm"
      >
        {t('downloadOverrides', 'Download overrides')}
      </Button>
      <Button
        disabled={!hasEdits || isSourceLanguage}
        kind="tertiary"
        onClick={() => downloadJson(`${toTransifexLocale(language)}.json`, edits)}
        renderIcon={(props) => <Download size={16} {...props} />}
        size="sm"
      >
        {t('downloadForTransifex', 'Download for Transifex')}
      </Button>
      {hint ? <p className={styles.exportHint}>{hint}</p> : null}
    </div>
  );
}

/**
 * Puts the config an implementer would paste into their own configuration on the clipboard, so that
 * a value tried out here can be made permanent.
 */
function copyOverrideJson(entry: TranslationEntry, language: string): Promise<void> {
  const snippet = {
    [entry.namespace]: {
      [translationOverridesKey]: {
        [language]: { [entry.key]: entry.value },
      },
    },
  };

  return navigator.clipboard.writeText(JSON.stringify(snippet, undefined, 2));
}
