import React, { type ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenuButton2, PenIcon, useWorkspace2Store } from '@openmrs/esm-framework';

const WorkspaceTestNavButton: React.FC = () => {
  const { t } = useTranslation();
  const {openedGroup} = useWorkspace2Store();

  return (
    <ActionMenuButton2
      icon={(props: ComponentProps<typeof PenIcon>) => <PenIcon {...props} />}
      label={t('workspaceTest', 'Workspace Test')} 
      windowName={'window1'} 
      workspaceToLaunch={{
        workspaceName: 'workspace-test',
        workspaceProps: {},
        windowProps: {windowContext: "X", icon: "pen"},
        groupProps: openedGroup?.props ?? {groupContext: "groupA"},
      }}
    />
  );
};

export default WorkspaceTestNavButton;
