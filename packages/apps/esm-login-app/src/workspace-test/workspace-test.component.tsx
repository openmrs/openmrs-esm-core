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
        <div><button onClick={() => launchChildWorkspace(childWorkspacename, {asdf: "asdf"})}>Launch Child Workspace</button></div>
        <div><button onClick={() => closeWorkspace()}>Close Workspace</button></div>
      </div>
    </Workspace2>
  );
}

export default WorkspaceTest;
