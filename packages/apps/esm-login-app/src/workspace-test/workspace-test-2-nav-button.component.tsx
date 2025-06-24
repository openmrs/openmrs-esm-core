import React, { type ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenuButton, launchWorkspace, MotherIcon } from '@openmrs/esm-framework';

const WorkspaceTestNavButton: React.FC = () => {
  const { t } = useTranslation();

  return (
    <ActionMenuButton
      getIcon={(props: ComponentProps<typeof MotherIcon>) => <MotherIcon {...props} />}
      label={t('workspaceTest2', 'Workspace Test 2')}
      iconDescription={t('workspaceTest2', 'Workspace Test 2')}
      handler={() => launchWorkspace('workspace-test-2')}
      type={'workspace-test-2'}
    />
  );
};

export default WorkspaceTestNavButton;
