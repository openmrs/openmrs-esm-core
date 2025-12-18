import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import Parcel from 'single-spa-react/parcel';
import { mountRootParcel, type ParcelConfig } from 'single-spa';
import { InlineLoading } from '@carbon/react';
import { type OpenedWindow, type OpenedWorkspace, workspace2Store } from '@openmrs/esm-extensions';
import { loadLifeCycles } from '@openmrs/esm-routes';
import { getCoreTranslation } from '@openmrs/esm-translations';
import { promptForClosingWorkspaces, useWorkspace2Store } from './workspace2';
import { type Workspace2DefinitionProps } from './workspace2.component';
import styles from './workspace2.module.scss';

interface WorkspaceWindowProps {
  openedWindow: OpenedWindow;
}
/**
 * Renders an opened workspace window.
 */
const ActiveWorkspaceWindow: React.FC<WorkspaceWindowProps> = ({ openedWindow }) => {
  const { openedWorkspaces } = openedWindow;
  const [lifeCycles, setLifeCycles] = useState<ParcelConfig[]>();
  const { registeredWorkspacesByName } = workspace2Store.getState();

  useEffect(() => {
    Promise.all(
      openedWorkspaces.map((openedWorkspace) => {
        const { moduleName, component } = registeredWorkspacesByName[openedWorkspace.workspaceName];
        return loadLifeCycles(moduleName, component);
      }),
    ).then(setLifeCycles);
  }, [openedWorkspaces]);

  return (
    <>
      {openedWorkspaces.map((openedWorkspace, i) => (
        <ActiveWorkspace
          key={openedWorkspace.uuid}
          openedWorkspace={openedWorkspace}
          openedWindow={openedWindow}
          lifeCycle={lifeCycles && lifeCycles[i] ? lifeCycles[i] : undefined}
          isRootWorkspace={i === 0}
          isLeafWorkspace={i === openedWorkspaces.length - 1}
        />
      ))}
    </>
  );
};

interface ActiveWorkspaceProps {
  lifeCycle: ParcelConfig | undefined;
  openedWorkspace: OpenedWorkspace;
  openedWindow: OpenedWindow;
  isRootWorkspace: boolean;
  isLeafWorkspace: boolean;
}

const ActiveWorkspace: React.FC<ActiveWorkspaceProps> = ({
  lifeCycle,
  openedWorkspace,
  openedWindow,
  isRootWorkspace,
  isLeafWorkspace,
}) => {
  const { openedGroup, closeWorkspace, openChildWorkspace } = useWorkspace2Store();

  const props: Workspace2DefinitionProps = useMemo(
    () =>
      openedWorkspace && {
        closeWorkspace: async (options = {}) => {
          const { closeWindow = false, discardUnsavedChanges = false } = options;
          if (closeWindow) {
            const okToCloseWorkspaces =
              discardUnsavedChanges ||
              (await promptForClosingWorkspaces({
                reason: 'CLOSE_WINDOW',
                explicit: true,
                windowName: openedWindow.windowName,
              }));
            if (okToCloseWorkspaces) {
              closeWorkspace(openedWindow.openedWorkspaces[0].workspaceName);
              return true;
            }
            return false;
          } else {
            const okToCloseWorkspaces =
              discardUnsavedChanges ||
              (await promptForClosingWorkspaces({
                reason: 'CLOSE_WORKSPACE',
                explicit: true,
                windowName: openedWindow.windowName,
                workspaceName: openedWorkspace.workspaceName,
              }));
            if (okToCloseWorkspaces) {
              closeWorkspace(openedWorkspace.workspaceName);
              return true;
            }
            return false;
          }
        },
        launchChildWorkspace: (childWorkspaceName, childWorkspaceProps) => {
          const parentWorkspaceName = openedWorkspace.workspaceName;
          openChildWorkspace(parentWorkspaceName, childWorkspaceName, childWorkspaceProps || {});
        },
        workspaceName: openedWorkspace.workspaceName,
        workspaceProps: openedWorkspace.props,
        windowProps: openedWindow.props,
        groupProps: openedGroup && openedGroup.props ? openedGroup.props : null,
        isRootWorkspace,
        isLeafWorkspace,
        windowName: openedWindow.windowName,
      },
    [openedWorkspace, closeWorkspace, openedGroup, openedWindow],
  );

  if (!lifeCycle) {
    const { registeredWorkspacesByName } = workspace2Store.getState();
    const workspaceDef = registeredWorkspacesByName[openedWorkspace.workspaceName];
    const windowName = workspaceDef && workspaceDef.window ? workspaceDef.window : undefined;
    const { registeredWindowsByName } = workspace2Store.getState();
    const windowDef = windowName ? registeredWindowsByName[windowName] : undefined;
    const width = windowDef && windowDef.width ? windowDef.width : 'narrow';

    return (
      <div
        className={classNames(styles.workspaceOuterContainer, {
          [styles.narrowWorkspace]: width === 'narrow',
          [styles.widerWorkspace]: width === 'wider',
          [styles.extraWideWorkspace]: width === 'extra-wide',
        })}
      >
        <div className={styles.workspaceSpacer} />
        <div
          className={classNames(styles.workspaceMiddleContainer, {
            [styles.isRootWorkspace]: isRootWorkspace,
          })}
        >
          <div
            className={classNames(styles.workspaceInnerContainer, {
              [styles.isRootWorkspace]: isRootWorkspace,
            })}
          >
            <InlineLoading className={styles.loader} description={`${getCoreTranslation('loading')} ...`} />
          </div>
        </div>
      </div>
    );
  }

  return <Parcel key={openedWorkspace.workspaceName} config={lifeCycle} mountParcel={mountRootParcel} {...props} />;
};

export default ActiveWorkspaceWindow;
