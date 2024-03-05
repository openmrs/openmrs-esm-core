import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Header, InlineLoading } from '@carbon/react';
import { ArrowLeft, Close } from '@carbon/react/icons';
import { useLayoutType, isDesktop } from '@openmrs/esm-framework';
import { mountRootParcel, type ParcelConfig } from 'single-spa';
import Parcel from 'single-spa-react/parcel';
import { type WorkspaceInstance, useWorkspaceStore } from './workspaces.resource';
import classNames from 'classnames';

const WorkspaceContainer: React.FC = () => {
  const { workspaceStack } = useWorkspaceStore();
  if (!workspaceStack.length) {
    return null;
  }
  return (
    <>
      {workspaceStack.map((instance, index) => (
        <Workspace workspaceInstance={instance} visible={index === 0} key={instance.name} />
      ))}
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

  if (!workspaceInstance) {
    return null;
  }

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
            onClick={workspaceInstance?.props?.closeWorkspace}
            kind="ghost"
            hasIconOnly
            renderIcon={(props) => <Close size={16} {...props} />}
          />
        </div>
      ) : (
        <Header className="omrs--workspace--tablet--header" aria-label="Workspace header">
          <Button
            kind="ghost"
            onClick={workspaceInstance?.props?.closeWorkspace}
            hasIconOnly
            iconDescription={t('closeWorkspace', 'Close workspace')}
            renderIcon={(props) => <ArrowLeft size={16} onClick={close} {...props} />}
          />
          <div className="omrs--workspace--header--content">{workspaceInstance?.workspaceTitle}</div>
        </Header>
      )}
      <div className="omrs--workspace--content" ref={ref}>
        {lifecycle ? (
          <Parcel
            key={workspaceInstance.name}
            config={lifecycle}
            mountParcel={mountRootParcel}
            {...workspaceInstance.props}
          />
        ) : (
          <InlineLoading className="omrs--workspace--loading--content" description={`${t('loading', 'Loading...')}`} />
        )}
      </div>
    </div>
  );
};

export default WorkspaceContainer;
