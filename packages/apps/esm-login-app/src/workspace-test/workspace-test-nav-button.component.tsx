import React, { type ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenuButton2, PenIcon, useWorkspace2Store } from '@openmrs/esm-framework';

const WorkspaceTestNavButton: React.FC = () => {
  const { t } = useTranslation();
  const {openedGroup} = useWorkspace2Store();

  // An action menu button corresponds to a window in the workspace group, with the correspondence 
  // defined in routes.json. When the workspace window is opened, the action menu button is highlighted.
  // 
  // When clicking on the action menu button, it either:
  // 1. restores the corresponding window, if it is opened (with at least 1 workspace), or
  // 2. launches a workspace defined with the `workspaceToLaunch` prop, passing it the appropriate
  //    workspace / window / group props. (Should we let it pass in group props?)
  // 
  // Not shown here, but we can optionally pass in a `onBeforeWorkspaceLaunch` callback to intercept
  // the launch workspace attempt. A useful scenario would be in the patient chart, when we click the
  // "Visit note" action menu button without a visit. The `onBeforeWorkspaceLaunch` callback can be used
  // to first launch the prompt for user to start a visit.
  return (
    <ActionMenuButton2
      icon={(props: ComponentProps<typeof PenIcon>) => <PenIcon {...props} />}
      label={t('workspaceTest', 'Workspace Test')} 
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
