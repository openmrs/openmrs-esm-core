import { MotherIcon, PenIcon, Workspace2, Workspace2Definition } from '@openmrs/esm-framework';
import React from 'react';

interface WorkspaceTestGroupProps {
  groupContext: string;
}

interface WorkspaceWindowProps {
  windowContext: string;
  icon: "pen" | "mother";
}

const WorkspaceTest : Workspace2Definition<WorkspaceTestGroupProps, WorkspaceWindowProps> = (props) => {
  console.log(">>>workspaceProps", props);
  const {closeWorkspace, groupProps, windowProps} = props;
  // props.promptBeforeClosing(() => true);
  const iconComponent = windowProps.icon == 'pen' ? <PenIcon /> : <MotherIcon />;
  return (
    <Workspace2 workspaceName={props.workspaceName} title={'hello'}>
      <div style={{backgroundColor: 'lightblue', padding: '20px'}}>
        <h1>Workspace Test Component</h1>
        <h2>Group Context: {groupProps.groupContext}</h2>
        <h2>Window Context: {iconComponent} {windowProps.windowContext}</h2>
        <button onClick={() => closeWorkspace()}>Close Workspace</button>
      </div>
    </Workspace2>
  );
}

export default WorkspaceTest;