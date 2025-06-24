import React, { type ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenuButton, launchWorkspace, PenIcon } from '@openmrs/esm-framework';

const WorkspaceTestNavButton: React.FC = () => {
  const { t } = useTranslation();

  return (
    <ActionMenuButton
      getIcon={(props: ComponentProps<typeof PenIcon>) => <PenIcon {...props} />}
      label={t('workspaceTest', 'Workspace Test')}
      iconDescription={t('workspaceTest', 'Workspace Test')}
      handler={() => launchWorkspace('workspace-test')}
      type={'workspace-test'}
    />
  );
};

export default WorkspaceTestNavButton;
