import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Header, InlineLoading, ComposedModal, ModalBody, ModalFooter, ModalHeader } from '@carbon/react';
import { ArrowLeft, Close } from '@carbon/react/icons';
import { useLayoutType, isDesktop } from '@openmrs/esm-framework';
import { mountRootParcel, type ParcelConfig } from 'single-spa';
import Parcel from 'single-spa-react/parcel';
import { type WorkspaceInstance, useWorkspaceStore, cancelPrompt } from './workspaces.resource';

import classNames from 'classnames';

const WorkspaceContainer: React.FC = () => {
  const { openWorkspaces } = useWorkspaceStore();
  if (!openWorkspaces.length) {
    return null;
  }
  return (
    <>
      {openWorkspaces.map((instance, index) => (
        <Workspace workspaceInstance={instance} visible={index === 0} key={instance.name} />
      ))}
      <WorkspaceNotification />
    </>
  );
};

interface WorkspaceProps {
  workspaceInstance: WorkspaceInstance;
  visible: boolean;
}

const Workspace: React.FC<WorkspaceProps> = ({ workspaceInstance, visible }) => {
  const { t } = useTranslation();
  const layout = useLayoutType();
  const ref = useRef<HTMLDivElement>(null);
  const [lifecycle, setLifecycle] = useState<ParcelConfig | undefined>();

  useEffect(() => {
    let active = true;
    workspaceInstance.load().then(({ default: result, ...lifecycle }) => {
      if (active) {
        setLifecycle(result ?? lifecycle);
      }
    });
    return () => {
      active = false;
    };
  }, [workspaceInstance.load]);

  if (!workspaceInstance || !visible) {
    return null;
  }

  const props = {
    ...workspaceInstance.additionalProps,
    closeWorkspace: workspaceInstance.closeWorkspace,
    closeWorkspaceWithSavedChanges: workspaceInstance.closeWorkspaceWithSavedChanges,
    promptBeforeClosing: workspaceInstance.promptBeforeClosing,
  };

  return (
    <div
      className={classNames({
        'omrs--workspace--desktop--workspace': isDesktop(layout),
        'omrs--workspace--tablet--workspace': !isDesktop(layout),
        'omrs--workspace--hidden': !visible,
      })}
    >
      {isDesktop(layout) ? (
        <div className="omrs--workspace--desktop--header">
          <div className="omrs--workspace--header--content">{workspaceInstance?.workspaceTitle}</div>
          <Button
            className="omrs--workspace--close--btn"
            iconDescription={t('closeWorkspace', 'Close workspace')}
            onClick={workspaceInstance?.closeWorkspace}
            kind="ghost"
            hasIconOnly
            renderIcon={(props) => <Close size={16} {...props} />}
          />
        </div>
      ) : (
        <Header className="omrs--workspace--tablet--header" aria-label="Workspace header">
          <Button
            kind="ghost"
            onClick={workspaceInstance?.closeWorkspace}
            hasIconOnly
            iconDescription={t('closeWorkspace', 'Close workspace')}
            renderIcon={(props) => <ArrowLeft size={16} onClick={close} {...props} />}
          />
          <div className="omrs--workspace--header--content">{workspaceInstance?.workspaceTitle}</div>
        </Header>
      )}
      <div className="omrs--workspace--content" ref={ref}>
        {lifecycle ? (
          <Parcel key={workspaceInstance.name} config={lifecycle} mountParcel={mountRootParcel} {...props} />
        ) : (
          <InlineLoading className="omrs--workspace--loading--content" description={`${t('loading', 'Loading...')}`} />
        )}
      </div>
    </div>
  );
};

export default WorkspaceContainer;

const WorkspaceNotification: React.FC = () => {
  const { t } = useTranslation();
  const { prompt } = useWorkspaceStore();

  if (!prompt) {
    return null;
  }

  return (
    <ComposedModal open={true} onClose={cancelPrompt}>
      <ModalHeader title={prompt.title}></ModalHeader>
      <ModalBody>{prompt.body}</ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={cancelPrompt}>
          {prompt.cancelText ?? t('cancel', 'Cancel')}
        </Button>
        <Button kind="danger" onClick={prompt.onConfirm}>
          {prompt.confirmText ?? t('confirm', 'Confirm')}
        </Button>
      </ModalFooter>
    </ComposedModal>
  );
};
