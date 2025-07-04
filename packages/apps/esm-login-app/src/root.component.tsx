import { Button } from '@carbon/react';
import { MotherIcon, PenIcon } from '@openmrs/esm-framework';
import { closeWorkspaceGroup2, launchWorkspace2, launchWorkspaceGroup2 } from '@openmrs/esm-framework';
import React from 'react';

const Root: React.FC = () => {
  // return (
  //   <BrowserRouter basename={window.getOpenmrsSpaBase()}>
  //     <Routes>
  //       <Route path="login" element={<Login />} />
  //       <Route path="login/confirm" element={<Login />} />
  //       <Route path="login/location" element={<LocationPickerView />} />
  //       <Route path="logout" element={<RedirectLogout />} />
  //       <Route path="change-password" element={<ChangePassword />} />
  //     </Routes>
  //   </BrowserRouter>
  // );
  // const blah = useWorkspaces();

  // useEffect(() => {
  //   console.log(">>>>", blah);
  // }, [blah]);

  return (
    <div>
      <h1>Workspace Test</h1>
      <div>
        <h3>Group A</h3>
        <div>
        <Button kind="ghost" onClick={() => {
          launchWorkspaceGroup2('workspace-group-test', {groupContext: "groupA"});
        }}>
          Open Workspace Group A
        </Button>
        
        <Button kind="ghost" onClick={() => {
          closeWorkspaceGroup2();
        }}>
          Close Workspace Group
        </Button>
      </div>
        <Button kind="ghost" renderIcon={props => <PenIcon {...props} />} onClick={() => {
          launchWorkspace2('workspace-test', {groupContext: "groupA"}, {windowContext: "context1", icon: "pen"});
        }}>
          context1
        </Button>
        <Button kind="ghost" renderIcon={props => <MotherIcon {...props} />} onClick={() => {
          launchWorkspace2('workspace-test-2', {groupContext: "groupA"}, {windowContext: "context1", icon: "mother"});
        }}>
          context1
        </Button>
        <br/>
        <Button kind="ghost" renderIcon={props => <PenIcon {...props} />} onClick={() => {
          launchWorkspace2('workspace-test', {groupContext: "groupA"}, {windowContext: "context2", icon: "pen"});
        }}>
          context2
        </Button>
        <Button kind="ghost" renderIcon={props => <MotherIcon {...props} />} onClick={() => {
          launchWorkspace2('workspace-test-2', {groupContext: "groupA"}, {windowContext: "context2", icon: "mother"});
        }}>
          context2
        </Button>
      </div>
      <div>
        <h3>Group B</h3>
        <div>
        <Button kind="ghost" onClick={() => {
          launchWorkspaceGroup2('workspace-group-test', {groupContext: "groupB"});
        }}>
          Open Workspace Group B
        </Button>
        
        <Button kind="ghost" onClick={() => {
          closeWorkspaceGroup2();
        }}>
          Close Workspace Group
        </Button>
      </div>
        <Button kind="ghost" renderIcon={props => <PenIcon {...props} />} onClick={() => {
          launchWorkspace2('workspace-test', {groupContext: "groupB"}, {windowContext: "context1", icon: "pen"});
        }}>
          context1
        </Button>
        <Button kind="ghost" renderIcon={props => <MotherIcon {...props} />} onClick={() => {
          launchWorkspace2('workspace-test-2', {groupContext: "groupB"}, {windowContext: "context1",  icon: "mother"});
        }}>
          context1
        </Button>
        <br/>
        <Button kind="ghost" renderIcon={props => <PenIcon {...props} />} onClick={() => {
          launchWorkspace2('workspace-test', {groupContext: "groupB"}, {windowContext: "context2", icon: "pen"});
        }}>
          context2
        </Button>
        <Button kind="ghost" renderIcon={props => <MotherIcon {...props} />} onClick={() => {
          launchWorkspace2('workspace-test-2', {groupContext: "groupB"}, {windowContext: "context2", icon: "mother"});
        }}>
          context2
        </Button>
      </div>
      {/* <WorkspaceContainer showSiderailAndBottomNav={true} contextKey={'login'} /> */}
    </div>
  )
};

export default Root;
