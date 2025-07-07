import React, { type ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenuButton2, MotherIcon, useWorkspace2Store } from '@openmrs/esm-framework';

const WorkspaceTestNavButton: React.FC = () => {
  const { t } = useTranslation();
  const {openedGroup} = useWorkspace2Store();
  
  return (
    <ActionMenuButton2
      icon={(props: ComponentProps<typeof MotherIcon>) => <MotherIcon {...props} />}
      label={t('workspaceTest2', 'Workspace Test 2')} 
      windowName={'window2'} 
      workspaceToLaunch={{
        workspaceName: 'workspace-test-2',
        groupProps: openedGroup?.props ?? {groupContext: "groupA"},
        windowProps: {windowContext: "context1", icon: "mother"},
      }}
    />
  );
};

export default WorkspaceTestNavButton;
