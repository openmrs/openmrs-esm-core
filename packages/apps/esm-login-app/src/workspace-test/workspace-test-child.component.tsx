import { MotherIcon, PenIcon, Workspace2, Workspace2Definition } from '@openmrs/esm-framework';
import React from 'react';
import { WorkspaceTestGroupProps, WorkspaceWindowProps } from './workspace-test.component';


const WorkspaceTestChild : Workspace2Definition<{asdf: string}, WorkspaceWindowProps, WorkspaceTestGroupProps> = (props) => {
  const {closeWorkspace, groupProps, windowProps, workspaceProps} = props;
  const iconComponent = windowProps.icon == 'pen' ? <PenIcon size={32} /> : <MotherIcon size={32} />;
  return (
    <Workspace2 title={'hello'}>
      <div style={{padding: '20px', backgroundColor: "lightblue"}}>
        Child Workspace {iconComponent}
        <h2>Group prop: {groupProps.groupContext}</h2>
        <h2>Window prop: {windowProps.windowContext}</h2>
        <h2>Child prop: {workspaceProps.asdf}</h2>
        <div><button onClick={() => closeWorkspace()}>Close Child Workspace</button></div>
        <div><button onClick={() => closeWorkspace(true)}>Close All Workspaces in Window</button></div>
      </div>
    </Workspace2>
  );
}

export default WorkspaceTestChild;
