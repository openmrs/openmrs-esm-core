import { DefaultWorkspaceProps, Workspace2 } from '@openmrs/esm-framework';
import React from 'react';

interface WorkspaceTestProps extends DefaultWorkspaceProps{
  context: string;
  workspaceGroupContext: string;
  workspaceName: string;
}

const WorkspaceTest : React.FC<WorkspaceTestProps> = (props) => {
  console.log(">>>workspaceProps", props);
  // props.promptBeforeClosing(() => true);
  return (
    <Workspace2 workspaceName={props.workspaceName} title={'hello'}>
      <div style={{backgroundColor: 'lightblue', padding: '20px'}}>
        <h1>Workspace Test Component</h1>
        <h2>Group Context: {props.workspaceGroupContext}</h2>
        <p>Workspace Context: {props.context}</p>
      </div>
    </Workspace2>
  );
}

export default WorkspaceTest;