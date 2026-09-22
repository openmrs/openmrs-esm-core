import React, { type ReactNode, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import Parcel from 'single-spa-react/parcel';
import { type ParcelConfig } from 'single-spa';
import { Header, HeaderGlobalAction, HeaderGlobalBar, HeaderName, InlineLoading } from '@carbon/react';
import { DownToBottom, Maximize, Minimize } from '@carbon/react/icons';
import {
  type OpenedWindow,
  type OpenedWorkspace,
  createParcelMounter,
  workspace2Store,
  type WorkspaceStoreState2,
} from '@openmrs/esm-extensions';
import { isDesktop, useLayoutType, useStore } from '@openmrs/esm-react-utils';
import { loadLifeCycles } from '@openmrs/esm-routes';
import { getCoreTranslation } from '@openmrs/esm-translations';
import { ArrowRightIcon, CloseIcon } from '../icons';
import { closeWorkspaceGroup2, useWorkspace2Store } from './workspace2';
import { type Workspace2DefinitionProps } from './workspace2.component';
import { type WorkspaceWindowActions } from './workspace-window-actions';
import styles from './workspace2.module.scss';

interface WorkspaceWindowProps {
  openedWindow: OpenedWindow;
  groupProps: Record<string, any> | null;
  actions: WorkspaceWindowActions;
  /**
   * Whether to render the workspace window "chrome" (containers, title bar, maximize / hide / close).
   * Only the global workspace window system renders it; an `<ExportedWorkspace>` renders the bare
   * workspace content.
   */
  renderChrome: boolean;
  showActionMenu: boolean;
}

// module-level so the store subscription's snapshot getter stays stable across renders
const selectRegisteredWorkspacesByName = (state: WorkspaceStoreState2) => state.registeredWorkspacesByName;

/**
 * Renders an opened workspace window. `actions` determines which store the window's workspaces
 * navigate within: the global workspace window system, or an `<ExportedWorkspace>`'s local store.
 */
const ActiveWorkspaceWindow: React.FC<WorkspaceWindowProps> = ({
  openedWindow,
  groupProps,
  actions,
  renderChrome,
  showActionMenu,
}) => {
  const { openedWorkspaces } = openedWindow;
  // Keyed by opened workspace uuid rather than stack index. The lifecycles load
  // asynchronously, so when the stack changes (a workspace at some position is
  // replaced by another, for example closing a child workspace and immediately
  // opening a different one), an index-based lookup can hand the new workspace
  // the previous workspace's component until the reload resolves. The parcel
  // mounts whatever config it first receives, so the wrong component would then
  // render with the new workspace's props.
  const [lifeCyclesByUuid, setLifeCyclesByUuid] = useState<Record<string, ParcelConfig>>({});
  // Reactive so the effect retries when a workspace registers after mount.
  const registeredWorkspacesByName = useStore(workspace2Store, selectRegisteredWorkspacesByName);

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      openedWorkspaces.map(async (openedWorkspace): Promise<[string, ParcelConfig] | null> => {
        const workspaceDef = registeredWorkspacesByName[openedWorkspace.workspaceName];
        if (!workspaceDef) {
          return null;
        }
        const { moduleName, component } = workspaceDef;
        return [openedWorkspace.uuid, await loadLifeCycles(moduleName, component)];
      }),
    ).then((entries) => {
      if (!cancelled) {
        setLifeCyclesByUuid(
          Object.fromEntries(entries.filter((entry): entry is [string, ParcelConfig] => entry != null)),
        );
      }
    });
    return () => {
      cancelled = true;
    };
  }, [openedWorkspaces, registeredWorkspacesByName]);

  return (
    <>
      {openedWorkspaces.map((openedWorkspace, i) => (
        <ActiveWorkspace
          key={openedWorkspace.uuid}
          openedWorkspace={openedWorkspace}
          openedWindow={openedWindow}
          groupProps={groupProps}
          actions={actions}
          renderChrome={renderChrome}
          lifeCycle={lifeCyclesByUuid[openedWorkspace.uuid]}
          isRootWorkspace={i === 0}
          isLeafWorkspace={i === openedWorkspaces.length - 1}
          showActionMenu={showActionMenu}
        />
      ))}
    </>
  );
};

interface ActiveWorkspaceProps {
  lifeCycle: ParcelConfig | undefined;
  openedWorkspace: OpenedWorkspace;
  openedWindow: OpenedWindow;
  groupProps: Record<string, any> | null;
  actions: WorkspaceWindowActions;
  renderChrome: boolean;
  isRootWorkspace: boolean;
  isLeafWorkspace: boolean;
  showActionMenu: boolean;
}

const mountParcel = createParcelMounter();

const ActiveWorkspace: React.FC<ActiveWorkspaceProps> = ({
  lifeCycle,
  openedWorkspace,
  openedWindow,
  groupProps,
  actions,
  renderChrome,
  isRootWorkspace,
  isLeafWorkspace,
  showActionMenu,
}) => {
  const props: Workspace2DefinitionProps = useMemo(
    () =>
      openedWorkspace && {
        closeWorkspace: async (options = {}) => {
          const { closeWindow = false, discardUnsavedChanges = false } = options;
          if (closeWindow) {
            const okToCloseWorkspaces = discardUnsavedChanges || (await actions.promptForClosingWorkspaces());
            if (okToCloseWorkspaces) {
              actions.closeWorkspace(openedWindow.openedWorkspaces[0].workspaceName);
              return true;
            }
            return false;
          } else {
            const okToCloseWorkspaces =
              discardUnsavedChanges || (await actions.promptForClosingWorkspaces(openedWorkspace.workspaceName));
            if (okToCloseWorkspaces) {
              actions.closeWorkspace(openedWorkspace.workspaceName);
              return true;
            }
            return false;
          }
        },
        launchChildWorkspace: async (childWorkspaceName, childWorkspaceProps) => {
          const parentWorkspaceName = openedWorkspace.workspaceName;
          const { openedWorkspaces } = openedWindow;
          const parentIndex = openedWorkspaces.findIndex((w) => w.workspaceName === parentWorkspaceName);
          if (parentIndex === -1) {
            return;
          }
          const isLeaf = parentIndex === openedWorkspaces.length - 1;

          if (!isLeaf) {
            // There are workspaces above the parent that will be closed.
            // Prompt if any of them have unsaved changes.
            const workspacesAboveParent = openedWorkspaces.slice(parentIndex + 1);
            if (workspacesAboveParent.some((w) => w.hasUnsavedChanges)) {
              const okToClose = await actions.promptForClosingWorkspaces(
                openedWorkspaces[parentIndex + 1].workspaceName,
              );
              if (!okToClose) {
                return;
              }
            }
          }

          actions.openChildWorkspace(parentWorkspaceName, childWorkspaceName, childWorkspaceProps || {});
        },
        setWorkspaceTitle: (title) => actions.setWorkspaceTitle(openedWorkspace.uuid, title),
        setHasUnsavedChanges: (hasUnsavedChanges) =>
          actions.setHasUnsavedChanges(openedWorkspace.uuid, hasUnsavedChanges),
        workspaceName: openedWorkspace.workspaceName,
        workspaceProps: openedWorkspace.props,
        windowProps: openedWindow.props,
        groupProps,
        workspaceMeta: workspace2Store.getState().registeredWorkspacesByName[openedWorkspace.workspaceName]?.meta ?? {},
        isRootWorkspace,
        isLeafWorkspace,
        windowName: openedWindow.windowName,
        showActionMenu,
      },
    [openedWorkspace, openedWindow, groupProps, actions, isRootWorkspace, isLeafWorkspace, showActionMenu],
  );

  const content = lifeCycle ? (
    <Parcel
      key={openedWorkspace.workspaceName}
      config={lifeCycle}
      mountParcel={mountParcel}
      wrapWith="div"
      wrapClassName={styles.workspaceContent}
      {...props}
    />
  ) : null;

  if (!renderChrome) {
    return content ?? <InlineLoading className={styles.loader} description={`${getCoreTranslation('loading')}`} />;
  }

  return (
    <WorkspaceChrome
      openedWorkspace={openedWorkspace}
      openedWindow={openedWindow}
      isRootWorkspace={isRootWorkspace}
      showActionMenu={showActionMenu}
      closeWindow={() => props.closeWorkspace({ closeWindow: true })}
    >
      {content}
    </WorkspaceChrome>
  );
};

interface WorkspaceChromeProps {
  openedWorkspace: OpenedWorkspace;
  openedWindow: OpenedWindow;
  isRootWorkspace: boolean;
  showActionMenu: boolean;
  closeWindow(): void;
  /** The workspace content, or `null` while it loads. */
  children: ReactNode;
}

/**
 * Renders the containers, title bar and window buttons around a workspace in the global workspace
 * window system.
 */
const WorkspaceChrome: React.FC<WorkspaceChromeProps> = ({
  openedWorkspace,
  openedWindow,
  isRootWorkspace,
  showActionMenu,
  closeWindow,
  children,
}) => {
  const layout = useLayoutType();
  const {
    openedGroup,
    openedWindows,
    registeredWindowsByName,
    registeredGroupsByName,
    isMostRecentlyOpenedWindowHidden,
    setWindowMaximized,
    hideWindow,
  } = useWorkspace2Store();

  const windowName = openedWindow.windowName;
  const { maximized } = openedWindow;
  const title = openedWorkspace.title ?? '';

  const windowDef = registeredWindowsByName[windowName];
  const width = windowDef?.width ?? 'narrow';
  const icon = windowDef?.icon;
  const canMaximize = windowDef?.canMaximize;
  const canCloseGroup = openedGroup ? registeredGroupsByName[openedGroup.groupName]?.persistence === 'closable' : false;
  const canHide = !!icon && !canCloseGroup;

  const openedWindowIndex = openedWindows.findIndex((w) => w.windowName === windowName);
  const isWindowHidden = openedWindowIndex < openedWindows.length - 1 || isMostRecentlyOpenedWindowHidden;

  const isActionMenuOpened = Object.values(registeredWindowsByName).some(
    (window) => window.group === openedGroup?.groupName && window.icon !== undefined,
  );

  return (
    <div
      className={classNames(styles.workspaceOuterContainer, {
        [styles.narrowWorkspace]: width === 'narrow',
        [styles.widerWorkspace]: width === 'wider',
        [styles.extraWideWorkspace]: width === 'extra-wide',
        [styles.isActionMenuOpened]: isActionMenuOpened,
      })}
    >
      <div
        className={classNames(styles.workspaceSpacer, {
          [styles.hidden]: isWindowHidden,
        })}
      />
      <div
        className={classNames(styles.workspaceMiddleContainer, {
          [styles.maximized]: maximized,
          [styles.hidden]: isWindowHidden,
          [styles.isRootWorkspace]: isRootWorkspace,
          [styles.showActionMenu]: showActionMenu,
        })}
      >
        <div
          className={classNames(styles.workspaceInnerContainer, {
            [styles.maximized]: maximized,
            [styles.hidden]: isWindowHidden,
            [styles.isRootWorkspace]: isRootWorkspace,
          })}
        >
          {children ? (
            <>
              <Header aria-label={getCoreTranslation('workspaceHeader')} className={styles.header}>
                <HeaderName prefix="">{title}</HeaderName>
                <div className={styles.overlayHeaderSpacer} />
                <HeaderGlobalBar className={styles.headerButtons}>
                  {isDesktop(layout) ? (
                    <>
                      {(canMaximize || maximized) && (
                        <HeaderGlobalAction
                          aria-label={maximized ? getCoreTranslation('minimize') : getCoreTranslation('maximize')}
                          onClick={() => setWindowMaximized(windowName, !maximized)}
                        >
                          {maximized ? <Minimize /> : <Maximize />}
                        </HeaderGlobalAction>
                      )}
                      {canHide && (
                        <HeaderGlobalAction aria-label={getCoreTranslation('hide')} onClick={() => hideWindow()}>
                          <ArrowRightIcon />
                        </HeaderGlobalAction>
                      )}
                      {!canCloseGroup && (
                        <HeaderGlobalAction aria-label={getCoreTranslation('close')} onClick={closeWindow}>
                          <CloseIcon />
                        </HeaderGlobalAction>
                      )}
                    </>
                  ) : (
                    <>
                      {canHide && (
                        <HeaderGlobalAction aria-label={getCoreTranslation('hide')} onClick={() => hideWindow()}>
                          <DownToBottom />
                        </HeaderGlobalAction>
                      )}
                      <HeaderGlobalAction
                        aria-label={getCoreTranslation('close')}
                        onClick={() => {
                          if (canCloseGroup) {
                            closeWorkspaceGroup2();
                          } else {
                            closeWindow();
                          }
                        }}
                      >
                        <CloseIcon />
                      </HeaderGlobalAction>
                    </>
                  )}
                </HeaderGlobalBar>
              </Header>
              {children}
            </>
          ) : (
            <InlineLoading className={styles.loader} description={`${getCoreTranslation('loading')} ...`} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveWorkspaceWindow;
