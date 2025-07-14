import { MotherIcon, PenIcon, Workspace2, Workspace2Definition } from '@openmrs/esm-framework';
import React, { useState } from 'react';

export interface WorkspaceTestGroupProps {
  groupContext: string;
}

export interface WorkspaceWindowProps {
  windowContext: string;
  icon: "pen" | "mother";
}

const WorkspaceTest : Workspace2Definition<{}, WorkspaceWindowProps, WorkspaceTestGroupProps> = (props) => {
  console.log(">>>workspaceProps", props);
  const {closeWorkspace, groupProps, windowProps, launchChildWorkspace, workspaceName} = props;
  const [textboxValue, setTextboxValue] = useState<string>();

  const childWorkspacename = workspaceName == 'workspace-test' ? "workspace-test-child" : "workspace-test-child-2";
  // props.promptBeforeClosing(() => true);
  const iconComponent = windowProps.icon == 'pen' ? <PenIcon size={32} /> : <MotherIcon size={32} />;
  return (
    <Workspace2 title={'hello'}>
      <div style={{padding: '20px'}}>
        Test Workspace {iconComponent}
        <h2>Group Context: {groupProps.groupContext}</h2>
        <h2>Window Context: {windowProps.windowContext}</h2>
        <div>
          Dummy Textbox<br />
          Value is preserved when opening / closing child workspace, or when hidden <br />
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
          launchChildWorkspace(childWorkspacename, {asdf: "asdf"})
        }}>Launch Child Workspace</button></div>
        <div><button onClick={() => {
          // Closes the current workspace. If it contains child workspaces, those will be closed as well.
          // Not shown here, but `closeWorkspace(true)` allows you to close *all* workspace within the window.
          closeWorkspace()
        }}>Close Workspace</button></div>
      </div>
    </Workspace2>
  );
}

export default WorkspaceTest;
