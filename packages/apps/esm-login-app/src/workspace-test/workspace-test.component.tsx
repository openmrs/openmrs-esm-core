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
  const iconComponent = windowProps.icon == 'pen' ? <PenIcon size={32} /> : <MotherIcon size={32} />;
  return (
    <Workspace2 workspaceName={props.workspaceName} title={'hello'}>
      <div style={{padding: '20px'}}>
        {iconComponent}
        <h2>Group Context: {groupProps.groupContext}</h2>
        <h2>Window Context: {windowProps.windowContext}</h2>
        <button onClick={() => closeWorkspace()}>Close Workspace</button>
      </div>
    </Workspace2>
  );
}

export default WorkspaceTest;
