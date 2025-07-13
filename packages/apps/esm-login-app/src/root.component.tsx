import { Button } from '@carbon/react';
import { MotherIcon, PenIcon } from '@openmrs/esm-framework';
import { closeWorkspaceGroup2, launchWorkspace2, launchWorkspaceGroup2 } from '@openmrs/esm-framework';
import React from 'react';

const Root: React.FC = () => {

  return (
    <div>
      <h1>Workspace Test</h1>
      <p>
        This is a test app for testing the UI of the workspace system. Of note:
        <ul>
          <li>The workspace action menu is associated with a workspace group, and is only shown when a workspace group is opened.</li>
          <li></li>
        </ul>
      </p>
      <div>
        <h3>Group Context A</h3>
        <div>
        <Button kind="ghost" onClick={() => {
          launchWorkspaceGroup2('workspace-group-test', {groupContext: "A"});
        }}>
          Open Workspace Group
        </Button>
        
        <Button kind="ghost" onClick={() => {
          closeWorkspaceGroup2();
        }}>
          Close Workspace Group
        </Button>
      </div>
        <Button kind="ghost" renderIcon={props => <PenIcon {...props} />} onClick={() => {
          launchWorkspace2('workspace-test', {} ,{windowContext: "X", icon: "pen"}, {groupContext: "A"});
        }}>
          Context X
        </Button>
        <Button kind="ghost" renderIcon={props => <MotherIcon {...props} />} onClick={() => {
          launchWorkspace2('workspace-test-2', {}, {windowContext: "X", icon: "mother"}, {groupContext: "A"}, );
        }}>
          Context X
        </Button>
        <br/>
        <Button kind="ghost" renderIcon={props => <PenIcon {...props} />} onClick={() => {
          launchWorkspace2('workspace-test', {}, {windowContext: "Y", icon: "pen"}, {groupContext: "A"});
        }}>
          Context Y
        </Button>
        <Button kind="ghost" renderIcon={props => <MotherIcon {...props} />} onClick={() => {
          launchWorkspace2('workspace-test-2', {}, {windowContext: "Y", icon: "mother"}, {groupContext: "A"});
        }}>
          Context Y
        </Button>
      </div>
      <div>
        <h3>Group Context B</h3>
        <div>
        <Button kind="ghost" onClick={() => {
          launchWorkspaceGroup2('workspace-group-test', {groupContext: "B"});
        }}>
          Open Workspace Group
        </Button>
        
        <Button kind="ghost" onClick={() => {
          closeWorkspaceGroup2();
        }}>
          Close Workspace Group
        </Button>
      </div>
        <Button kind="ghost" renderIcon={props => <PenIcon {...props} />} onClick={() => {
          launchWorkspace2('workspace-test', {}, {windowContext: "X", icon: "pen"}, {groupContext: "B"});
        }}>
          Context X
        </Button>
        <Button kind="ghost" renderIcon={props => <MotherIcon {...props} />} onClick={() => {
          launchWorkspace2('workspace-test-2', {}, {windowContext: "X",  icon: "mother"}, {groupContext: "B"});
        }}>
          Context X
        </Button>
        <br/>
        <Button kind="ghost" renderIcon={props => <PenIcon {...props} />} onClick={() => {
          launchWorkspace2('workspace-test', {}, {windowContext: "Y", icon: "pen"}, {groupContext: "B"});
        }}>
          Context Y
        </Button>
        <Button kind="ghost" renderIcon={props => <MotherIcon {...props} />} onClick={() => {
          launchWorkspace2('workspace-test-2', {}, {windowContext: "Y", icon: "mother"}, {groupContext: "B"});
        }}>
          Context Y
        </Button>
      </div>
      {/* <WorkspaceContainer showSiderailAndBottomNav={true} contextKey={'login'} /> */}
    </div>
  )
};

export default Root;
