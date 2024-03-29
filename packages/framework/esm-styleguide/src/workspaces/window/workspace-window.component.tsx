import React, { useMemo, useEffect } from 'react';
import classNames from 'classnames';
import {
  ExtensionSlot,
  navigate,
  useBodyScrollLock,
  useLayoutType,
  usePatient,
  isDesktop,
} from '@openmrs/esm-framework';
import {
  type OpenWorkspace,
  useWorkspaces,
  updateWorkspaceWindowState,
  closeAllWorkspaces,
  canCloseWorkspaceWithoutPrompting,
  getWorkspaceStore,
  resetWorkspaceStore,
} from '../workspaces';
import { Header, HeaderGlobalBar, HeaderName, HeaderMenuButton, HeaderGlobalAction, IconButton } from '@carbon/react';
import { ArrowLeft, ArrowRight, Close, DownToBottom, Maximize, Minimize } from '@carbon/react/icons';
import { useTranslation } from 'react-i18next';
import { WorkspaceRenderer } from './workspace-renderer.component';
import styles from './workspace-window.scss';

interface ContextWorkspaceParams {
  patientUuid?: string;
}

const WorkspaceWindow: React.FC<ContextWorkspaceParams> = () => {
  const { patientUuid } = usePatient();
  const { t } = useTranslation();
  const layout = useLayoutType();
  const { active, workspaces, workspaceWindowState } = useWorkspaces();
  const hidden = workspaceWindowState === 'hidden';
  const maximized = workspaceWindowState === 'maximized';

  const isWorkspaceWindowOpen = active && !hidden;

  useBodyScrollLock(active && !isDesktop(layout));

  const toggleWindowState = () => {
    maximized ? updateWorkspaceWindowState('normal') : updateWorkspaceWindowState('maximized');
  };

  const workspacesToRender = useMemo(() => {
    return workspaces.map((w, idx) => (
      <WorkspaceRenderer key={w.name} workspace={w} patientUuid={patientUuid} active={idx === 0} />
    ));
  }, [workspaces, patientUuid]);

  const workspaceTitle = workspaces[0]?.additionalProps?.['workspaceTitle'] ?? workspaces[0]?.title ?? '';
  const {
    canHide = false,
    canMaximize = false,
    width = 'narrow',
    closeWorkspace,
  } = useMemo(() => workspaces?.[0] ?? ({} as OpenWorkspace), [workspaces]);

  useEffect(() => {
    const handleRouting = (event) => {
      const {
        detail: { cancelNavigation, newUrl },
      } = event as { detail: { cancelNavigation: () => void; newUrl: string } };

      const regex = new RegExp(/\/patient\/([a-zA-Z0-9\-]+)\/?/);
      const isNewUrlPatientChartUrl = regex.test(newUrl);
      const canCloseAllWorkspaces = getWorkspaceStore()
        .getState()
        .openWorkspaces.every(({ name }) => {
          const canCloseWorkspace = canCloseWorkspaceWithoutPrompting(name);
          return canCloseWorkspace;
        });

      if (!isNewUrlPatientChartUrl) {
        if (!canCloseAllWorkspaces) {
          cancelNavigation();
          const navigateToNewUrl = () => {
            function getUrlWithoutPrefix(url: string) {
              return url.split(window['getOpenmrsSpaBase']())?.[1];
            }
            navigate({ to: `\${openmrsSpaBase}/${getUrlWithoutPrefix(newUrl)}` });
          };

          closeAllWorkspaces(navigateToNewUrl);
        } else {
          resetWorkspaceStore();
        }
      }
    };
    window.addEventListener('single-spa:before-routing-event', handleRouting);

    return () => {
      window.removeEventListener('single-spa:before-routing-event', handleRouting);
    };
  }, []);

  return (
    <aside
      className={classNames(
        styles.container,
        width === 'narrow' ? styles.narrowWorkspace : styles.widerWorkspace,
        { [styles.maximized]: maximized },
        isWorkspaceWindowOpen ? styles.show : styles.hide,
      )}
    >
      <Header
        aria-label="Workspace Title"
        className={classNames(styles.header, maximized ? styles.fullWidth : styles.dynamicWidth)}
      >
        {layout === 'tablet' && !canHide && (
          <HeaderMenuButton renderMenuIcon={<ArrowLeft />} onClick={closeWorkspace} />
        )}
        <HeaderName prefix="">{workspaceTitle}</HeaderName>
        <HeaderGlobalBar className={styles.headerGlobalBar}>
          <ExtensionSlot name={patientChartWorkspaceHeaderSlot} />
          {isDesktop(layout) && (
            <>
              {(canMaximize || maximized) && (
                <HeaderGlobalAction
                  align="bottom"
                  label={maximized ? t('minimize', 'Minimize') : t('maximize', 'Maximize')}
                  onClick={toggleWindowState}
                  size="lg"
                >
                  {maximized ? <Minimize /> : <Maximize />}
                </HeaderGlobalAction>
              )}
              {canHide ? (
                <HeaderGlobalAction
                  align="bottom-right"
                  label={t('hide', 'Hide')}
                  onClick={() => updateWorkspaceWindowState('hidden')}
                  size="lg"
                >
                  <ArrowRight />
                </HeaderGlobalAction>
              ) : (
                <HeaderGlobalAction
                  align="bottom-right"
                  label={t('close', 'Close')}
                  onClick={() => closeWorkspace?.()}
                  size="lg"
                >
                  <Close />
                </HeaderGlobalAction>
              )}
            </>
          )}
          {layout === 'tablet' && canHide && (
            <HeaderGlobalAction align="bottom-right" label={t('close', 'Close')} onClick={() => closeWorkspace?.()}>
              <DownToBottom />
            </HeaderGlobalAction>
          )}
        </HeaderGlobalBar>
      </Header>
      {workspacesToRender}
    </aside>
  );
};

export default WorkspaceWindow;
