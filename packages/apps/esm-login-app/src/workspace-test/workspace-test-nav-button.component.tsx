import React, { type ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenuButton2, PenIcon } from '@openmrs/esm-framework';

const WorkspaceTestNavButton: React.FC = () => {
  const { t } = useTranslation();

  return (
    <ActionMenuButton2
      icon={(props: ComponentProps<typeof PenIcon>) => <PenIcon {...props} />}
      label={t('workspaceTest', 'Workspace Test')} 
      windowName={'window1'} 
      workspaceToLaunch={{
        workspaceName: 'workspace-test',
        groupProps: {groupContext: "groupA"},
        windowProps: {windowContext: "context1", icon: "pen"},
      }}
    />
  );
};

export default WorkspaceTestNavButton;
