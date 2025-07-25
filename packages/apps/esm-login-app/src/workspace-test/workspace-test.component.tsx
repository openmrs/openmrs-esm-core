import { MotherIcon, PenIcon, Workspace2, Workspace2Definition } from '@openmrs/esm-framework';
import React, { useState } from 'react';

export interface WorkspaceTestGroupProps {
  groupContext: string;
}

export interface WorkspaceWindowProps {
  windowContext: string;
  icon: "pen" | "mother";
}

const WorkspaceTest : Workspace2Definition<object, WorkspaceWindowProps, WorkspaceTestGroupProps> = (props) => {
  console.log(">>>workspaceProps", props);
  const {closeWorkspace, groupProps, windowProps, launchChildWorkspace, workspaceName} = props;
  const [textboxValue, setTextboxValue] = useState<string>('');

  const childWorkspaceName = workspaceName == 'workspace-test' ? "workspace-test-child" : "workspace-test-child-2";
  const iconComponent = windowProps.icon == 'pen' ? <PenIcon size={32} /> : <MotherIcon size={32} />;

  return (
    <Workspace2 title={windowProps.icon + ' workspace'} hasUnsavedChanges={!!textboxValue}>
      <div style={{padding: '20px'}}>
        Test Workspace {iconComponent}
        <h2>Group Context: {groupProps.groupContext}</h2>
        <h2>Window Context: {windowProps.windowContext}</h2>
        <div>
          <p>Dummy Textbox</p>
          <p>Value is preserved when opening / closing child workspace, or when hidden and restored.</p>
          <p>Value is *NOT* preserved when reopening the workspace with different props</p>
          <p>This test workspaces prompts for unsaved changed on close when textbox is not blank</p>
          <br />
          <input type="text" value={textboxValue} onChange={e => setTextboxValue(e.target.value)} />
        </div>
        <br />
        <div><button onClick={() => {
          // Unlike `launchWorkspace2`, this function launches a child workspace (from within the parent workspace).
          // The parent workspace must not have an existing child workspace.
          // Note that this function only takes in workspace props from the child workspace, and 
          // does not take in window props and group props. No unsaved changes prompt can
          // result from calling this function. 
          launchChildWorkspace(childWorkspaceName, {asdf: "asdf"})
        }}>Launch Child Workspace</button></div>
        <div><button onClick={() => {
          // Closes the current workspace. If it contains child workspaces, those will be closed as well.
          // Not shown here, but `closeWorkspace({closeWindow: true})` allows you to close *all* workspace within the window.
          closeWorkspace()
        }}>Close Workspace</button></div>
      </div>
    </Workspace2>
  );
}

export default WorkspaceTest;
