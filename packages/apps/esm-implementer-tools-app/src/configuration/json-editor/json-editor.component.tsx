import React, { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { isEqual, isPlainObject } from 'lodash-es';
import { basicSetup } from 'codemirror';
import { indentWithTab } from '@codemirror/commands';
import { json, jsonParseLinter } from '@codemirror/lang-json';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { linter, lintGutter } from '@codemirror/lint';
import { EditorState, Prec } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { tags } from '@lezer/highlight';
import { Button } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { clearConfigErrors, temporaryConfigStore, useStore } from '@openmrs/esm-framework/src/internal';
import styles from './json-editor.scss';

export interface JsonEditorProps {
  /** A CSS value */
  height: string;
}

/** Follows the surrounding Carbon theme through its CSS custom properties. */
const carbonTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: 'var(--cds-background)',
      color: 'var(--cds-text-primary)',
      fontSize: '1rem',
    },
    // Carbon's monospace stack, from @carbon/type.
    '.cm-scroller': {
      fontFamily: "'IBM Plex Mono', 'Menlo', 'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', Courier, monospace",
    },
    '.cm-content': { caretColor: 'var(--cds-text-primary)' },
    '.cm-cursor, .cm-dropCursor': { borderLeftColor: 'var(--cds-text-primary)' },
    '.cm-gutters': {
      backgroundColor: 'var(--cds-layer-01)',
      color: 'var(--cds-text-secondary)',
      borderRight: '1px solid var(--cds-border-subtle-01)',
    },
    '.cm-activeLine': { backgroundColor: 'var(--cds-layer-hover-01)' },
    '.cm-activeLineGutter': { backgroundColor: 'var(--cds-layer-hover-01)' },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection': {
      backgroundColor: 'var(--cds-highlight)',
    },
    '.cm-tooltip': {
      backgroundColor: 'var(--cds-layer-02)',
      color: 'var(--cds-text-primary)',
      border: '1px solid var(--cds-border-subtle-01)',
    },
  },
  { dark: true },
);

const jsonHighlighting = HighlightStyle.define([
  { tag: tags.propertyName, class: styles.property },
  { tag: tags.string, class: styles.string },
  { tag: [tags.number, tags.bool, tags.null], class: styles.literal },
  { tag: [tags.brace, tags.squareBracket, tags.separator, tags.punctuation], class: styles.punctuation },
]);

function stringifyConfig(config: unknown) {
  return JSON.stringify(config, null, 2);
}

/** Whether the editor's text already says the same thing as `config`, ignoring formatting. */
function representsConfig(text: string, config: unknown) {
  try {
    return isEqual(JSON.parse(text), config);
  } catch {
    return false;
  }
}

export default function JsonEditor({ height }: JsonEditorProps) {
  const { t } = useTranslation();
  const temporaryConfig = useStore(temporaryConfigStore);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  /** The text of the config the editor last loaded or submitted; any other text is unsubmitted edits. */
  const savedTextRef = useRef('');
  const [error, setError] = useState('');
  const [isChangedElsewhere, setIsChangedElsewhere] = useState(false);

  const updateTemporaryConfig = useCallback(() => {
    const text = viewRef.current?.state.doc.toString() ?? '';
    let config;
    try {
      config = JSON.parse(text);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
      return;
    }
    if (!isPlainObject(config)) {
      setError(t('configMustBeObject', 'The configuration must be a JSON object.'));
      return;
    }
    setError('');
    clearConfigErrors();
    temporaryConfigStore.setState({ config });
  }, [t]);

  const loadConfig = useCallback((view: EditorView, config: unknown) => {
    const text = stringifyConfig(config);
    view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: text } });
    savedTextRef.current = text;
    setError('');
    setIsChangedElsewhere(false);
  }, []);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    savedTextRef.current = stringifyConfig(temporaryConfigStore.getState().config);
    const view = new EditorView({
      parent: containerRef.current,
      state: EditorState.create({
        doc: savedTextRef.current,
        extensions: [
          basicSetup,
          keymap.of([indentWithTab]),
          // Outranks the default keymap, which binds Mod-Enter to inserting a blank line.
          Prec.highest(
            keymap.of([
              {
                key: 'Mod-Enter',
                run: () => {
                  updateTemporaryConfig();
                  return true;
                },
              },
            ]),
          ),
          json(),
          linter(jsonParseLinter()),
          lintGutter(),
          syntaxHighlighting(jsonHighlighting),
          carbonTheme,
          EditorState.tabSize.of(2),
          EditorView.contentAttributes.of({ 'aria-label': t('jsonConfigEditor', 'JSON configuration editor') }),
        ],
      }),
    });
    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // The editor owns its document after creation; later config changes are applied by the effect below.
  }, []);

  // Shows config changes made elsewhere, unless that would throw away unsubmitted edits, in which
  // case the user is offered the choice instead.
  useEffect(() => {
    const view = viewRef.current;
    if (!view) {
      return;
    }

    const text = view.state.doc.toString();
    if (representsConfig(text, temporaryConfig.config)) {
      savedTextRef.current = text;
      setIsChangedElsewhere(false);
    } else if (text === savedTextRef.current) {
      loadConfig(view, temporaryConfig.config);
    } else {
      setIsChangedElsewhere(true);
    }
  }, [temporaryConfig.config, loadConfig]);

  return (
    <div>
      <div className={styles.editor} ref={containerRef} style={{ height: `calc(${height} - 3rem)` }} />
      <div className={styles.toolbar}>
        <Button size="md" type="submit" onClick={updateTemporaryConfig}>
          {t('updateConfig', 'Update config')}
        </Button>
        {error || !isChangedElsewhere ? (
          <div
            className={classNames(styles.alert, {
              [styles.errorBackground]: error,
            })}
          >
            {error}
          </div>
        ) : null}
        {isChangedElsewhere ? (
          <div className={classNames(styles.alert, styles.warningBackground)}>
            {t('configChangedElsewhere', 'The configuration was changed elsewhere.')}
            <Button
              kind="ghost"
              size="md"
              onClick={() => viewRef.current && loadConfig(viewRef.current, temporaryConfigStore.getState().config)}
            >
              {t('discardEditsAndReload', 'Discard my edits and reload')}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
