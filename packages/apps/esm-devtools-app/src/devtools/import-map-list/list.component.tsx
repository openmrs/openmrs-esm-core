import React, { useEffect, forwardRef, useReducer, type Dispatch, useState, useRef } from 'react';
import {
  Button,
  Search,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from '@carbon/react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import fuzzy from 'fuzzy';
import { useDebounce, type ImportMap, showModal, resetAllRoutesOverrides } from '@openmrs/esm-framework/src/internal';
import type { Module } from './types';
import styles from './list.scss';

interface ImportMapListState {
  notOverriddenMap: ImportMap;
  currentPageMap: ImportMap;
  nextPageMap: ImportMap;
  dialogModule: { module: Module; isNew: false } | { isNew: true } | null;
  dialogExternalMap: null;
}

type ImportMapDispatchAction =
  | SetDefaultMapAction
  | SetCurrentMapAction
  | SetNextDispatchAction
  | ShowNewModuleDialogAction
  | ShowEditModuleDialogAction
  | HideEditModuleDialogAction
  | ResetAllOverridesAction;

interface SetDefaultMapAction {
  type: 'set_default_map';
  notOverriddenMap: ImportMap;
}

interface SetCurrentMapAction {
  type: 'set_current_map';
  currentPageMap: ImportMap;
}

interface SetNextDispatchAction {
  type: 'set_next_map';
  nextPageMap: ImportMap;
}

interface ShowNewModuleDialogAction {
  type: 'show_new_module_dialog';
}

interface ShowEditModuleDialogAction {
  type: 'show_edit_module_dialog';
  module: Module;
}

interface HideEditModuleDialogAction {
  type: 'hide_edit_module_dialog';
}

interface ResetAllOverridesAction {
  type: 'reset_all_overrides';
}

const initialImportMapState: ImportMapListState = {
  notOverriddenMap: { imports: {} },
  currentPageMap: { imports: {} },
  nextPageMap: { imports: {} },
  dialogModule: null,
  dialogExternalMap: null,
};

function updateToNext(dispatch: Dispatch<ImportMapDispatchAction>) {
  return () =>
    window.importMapOverrides.getNextPageMap().then((nextPageMap) => dispatch({ type: 'set_next_map', nextPageMap }));
}

function reducer(state: ImportMapListState, action: ImportMapDispatchAction) {
  switch (action.type) {
    case 'set_default_map':
      return { ...state, notOverriddenMap: action.notOverriddenMap };
    case 'set_current_map':
      return { ...state, currentPageMap: action.currentPageMap };
    case 'set_next_map':
      return { ...state, nextPageMap: action.nextPageMap };
    case 'show_new_module_dialog':
      return {
        ...state,
        dialogModule: { isNew: true },
      };
    case 'show_edit_module_dialog':
      return {
        ...state,
        dialogModule: { module: action.module, isNew: false },
      };
    case 'hide_edit_module_dialog':
      return {
        ...state,
        dialogModule: null,
      };
    case 'reset_all_overrides':
      window.importMapOverrides.resetOverrides();
      resetAllRoutesOverrides();
      return state;
  }
}

const ImportMapList = forwardRef<HTMLDivElement>((props, ref) => {
  const { t } = useTranslation();
  const [state, dispatch] = useReducer(reducer, initialImportMapState);

  const inputRef = useRef<HTMLInputElement>();
  const [searchQuery, setSearchQuery] = useState('');
  const searchVal = useDebounce(searchQuery);

  useEffect(() => {
    // load initial values from importMapOverrides
    window.importMapOverrides
      .getDefaultMap()
      .then((notOverriddenMap) => dispatch({ type: 'set_default_map', notOverriddenMap }));
    window.importMapOverrides
      .getCurrentPageMap()
      .then((currentPageMap) => dispatch({ type: 'set_current_map', currentPageMap }));

    // focus on the search box
    inputRef.current?.focus();

    // add our event listener
    const dispatcher = updateToNext(dispatch);
    window.addEventListener('import-map-overrides:change', dispatcher);
    // clean-up event listener
    return () => window.removeEventListener('import-map-overrides:change', dispatcher);
  }, []);

  useEffect(() => {
    if (state.dialogModule) {
      showModal(
        'importmap-override-modal',
        {
          ...state.dialogModule,
        },
        () => {
          dispatch({ type: 'hide_edit_module_dialog' });
        },
      );
    }
  }, [state.dialogModule]);

  const overriddenModules: Array<Module> = [],
    nextOverriddenModules: Array<Module> = [],
    disabledOverrides: Array<Module> = [],
    defaultModules: Array<Module> = [],
    externalOverrideModules: Array<Module> = [],
    pendingRefreshDefaultModules: Array<Module> = [];

  const overrideMap = window.importMapOverrides.getOverrideMap(true).imports;
  const notOverriddenKeys = Object.keys(state.notOverriddenMap.imports);
  const disabledModules = window.importMapOverrides.getDisabledOverrides();

  const searchableKeys = [...new Set([...notOverriddenKeys, ...Object.keys(overrideMap)])];
  searchableKeys.sort();

  fuzzy.filter(searchVal, searchableKeys).map((searchResult) => {
    const moduleName = searchResult.original;
    const mod: Module = {
      moduleName,
      defaultUrl: state.notOverriddenMap.imports[moduleName],
      overrideUrl: overrideMap[moduleName],
      disabled: disabledModules.includes(moduleName),
      order: searchResult.score,
    };

    if (mod.disabled) {
      disabledOverrides.push(mod);
    } else if (mod.overrideUrl) {
      if (state.currentPageMap.imports[moduleName] === mod.overrideUrl) {
        overriddenModules.push(mod);
      } else {
        nextOverriddenModules.push(mod);
      }
    } else if (state.currentPageMap.imports[moduleName] === mod.defaultUrl) {
      defaultModules.push(mod);
    } else if (state.nextPageMap.imports[moduleName] === mod.defaultUrl) {
      pendingRefreshDefaultModules.push(mod);
    } else {
      externalOverrideModules.push({
        ...mod,
        overrideUrl: state.currentPageMap.imports[moduleName],
      });
    }
  });

  overriddenModules.sort(sorter);
  defaultModules.sort(sorter);
  nextOverriddenModules.sort(sorter);
  defaultModules.sort(sorter);
  disabledOverrides.sort(sorter);
  externalOverrideModules.sort(sorter);
  pendingRefreshDefaultModules.sort(sorter);

  return (
    <div ref={ref} className={styles.imoListContainer}>
      <div className={styles.imoTableHeaderActions}>
        <Search
          ref={inputRef}
          id="module-search"
          className={styles.imoSearchBox}
          aria-label={t('searchModules', 'Search modules')}
          placeholder={t('searchModules', 'Search modules')}
          onChange={(evt: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(evt.target.value)}
          labelText=""
          size="lg"
        />
        <div>
          <Button kind="primary" onClick={() => dispatch({ type: 'show_new_module_dialog' })}>
            {t('addNewModule', 'Add new module')}
          </Button>
        </div>
        <div>
          <Button kind="secondary" onClick={() => dispatch({ type: 'reset_all_overrides' })}>
            {t('resetOverrides', 'Reset all overrides')}
          </Button>
        </div>
      </div>
      <TableContainer title="">
        <Table size="lg" stickyHeader={true} className={styles.imoTable}>
          <TableHead>
            <TableRow>
              <TableHeader>{t('moduleStatus', 'Module Status')}</TableHeader>
              <TableHeader>{t('moduleName', 'Module Name')}</TableHeader>
              <TableHeader>{t('domain', 'Domain')}</TableHeader>
              <TableHeader>{t('filename', 'Filename')}</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody className={styles.imoTableBody}>
            {nextOverriddenModules.map((mod) => (
              <TableRow
                role="button"
                tabIndex={0}
                onClick={() => dispatch({ type: 'show_edit_module_dialog', module: mod })}
              >
                <TableCell>
                  <div
                    className={classNames(styles.imoStatus, styles.imoNextOverride)}
                    role="button"
                    tabIndex={0}
                    onClick={(evt) => {
                      evt.preventDefault();
                      window.location.reload();
                    }}
                  />
                  <div className={styles.imoNextOverrideText}>{t('inlineOverride', 'Inline Override')}</div>
                  <div />
                </TableCell>
                <TableCell>{mod.moduleName}</TableCell>
                <TableCell>{toDomain(mod)}</TableCell>
                <TableCell>{toFileName(mod)}</TableCell>
              </TableRow>
            ))}
            {pendingRefreshDefaultModules.map((mod) => (
              <TableRow
                role="button"
                tabIndex={0}
                onClick={() => dispatch({ type: 'show_edit_module_dialog', module: mod })}
              >
                <TableCell>
                  <div
                    className={classNames(styles.imoStatus, styles.imoNextDefault)}
                    role="button"
                    tabIndex={0}
                    onClick={(evt) => {
                      evt.preventDefault();
                      window.location.reload();
                    }}
                  />
                  <div className={styles.imoNextDefaultText}>{t('default', 'Default')}</div>
                  <div />
                </TableCell>
                <TableCell>{mod.moduleName}</TableCell>
                <TableCell>{toDomain(mod)}</TableCell>
                <TableCell>{toFileName(mod)}</TableCell>
              </TableRow>
            ))}
            {disabledOverrides.map((mod) => (
              <TableRow
                role="button"
                tabIndex={0}
                onClick={() => dispatch({ type: 'show_edit_module_dialog', module: mod })}
              >
                <TableCell>
                  <div className={classNames(styles.imoStatus, styles.imoDisabledOverride)} />
                  <div className={styles.imoDisabledOverrideText}>{t('overrideDisabled', 'Override Disabled')}</div>
                </TableCell>
                <TableCell>{mod.moduleName}</TableCell>
                <TableCell>{toDomain(mod)}</TableCell>
                <TableCell>{toFileName(mod)}</TableCell>
              </TableRow>
            ))}
            {overriddenModules.map((mod) => (
              <TableRow
                role="button"
                tabIndex={0}
                onClick={() => dispatch({ type: 'show_edit_module_dialog', module: mod })}
              >
                <TableCell>
                  <div className={classNames(styles.imoStatus, styles.imoCurrentOverride)} />
                  <div className={styles.imoCurrentOverrideText}>{t('inlineOverride', 'Inline Override')}</div>
                </TableCell>
                <TableCell>{mod.moduleName}</TableCell>
                <TableCell>{toDomain(mod)}</TableCell>
                <TableCell>{toFileName(mod)}</TableCell>
              </TableRow>
            ))}
            {externalOverrideModules.map((mod) => (
              <TableRow
                role="button"
                tabIndex={0}
                onClick={() => dispatch({ type: 'show_edit_module_dialog', module: mod })}
              >
                <TableCell>
                  <div className={classNames(styles.imoStatus, styles.imoExternalOverride)} />
                  <div className={styles.externalOverrideText}>{t('externalOverride', 'External Override')}</div>
                </TableCell>
                <TableCell>{mod.moduleName}</TableCell>
                <TableCell>{toDomain(mod)}</TableCell>
                <TableCell>{toFileName(mod)}</TableCell>
              </TableRow>
            ))}
            {defaultModules.map((mod) => (
              <TableRow
                role="button"
                tabIndex={0}
                onClick={() => dispatch({ type: 'show_edit_module_dialog', module: mod })}
              >
                <TableCell>
                  <div className={classNames(styles.imoStatus, styles.imoDefaultModule)} />
                  <div>{t('default', 'Default')}</div>
                </TableCell>
                <TableCell>{mod.moduleName}</TableCell>
                <TableCell>{toDomain(mod)}</TableCell>
                <TableCell>{toFileName(mod)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
});

function sorter(obj1: { order: number }, obj2: { order: number }) {
  return obj1.order - obj2.order;
}

const currentBase = (document.querySelector('base') && document.querySelector('base').href) || location.origin + '/';

function toDomain(mod: Module) {
  const urlStr = toUrlStr(mod);
  const url = toURL(urlStr);
  return url ? url.host : urlStr;
}

function toFileName(mod: Module) {
  const urlStr = toUrlStr(mod);
  const url = toURL(urlStr);
  return url ? url.pathname.slice(url.pathname.lastIndexOf('/') + 1) : urlStr;
}

function toUrlStr(mod: Module) {
  return mod.overrideUrl || mod.defaultUrl;
}

function toURL(urlStr: string) {
  try {
    return new URL(urlStr, currentBase);
  } catch {
    return null;
  }
}

export default ImportMapList;
