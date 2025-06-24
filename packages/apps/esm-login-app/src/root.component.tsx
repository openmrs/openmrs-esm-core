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
        <Button kind="ghost" renderIcon={props => <PenIcon {...props} />} onClick={() => {
          launchWorkspaceGroup2('workspace-group-test');
        }}>
          Open Workspace Group
        </Button>
        
        <Button kind="ghost" renderIcon={props => <PenIcon {...props} />} onClick={() => {
          closeWorkspaceGroup2();
        }}>
          Close Workspace Group
        </Button>
      </div>
      <div>
        <h3>Group Context A</h3>
        <Button kind="ghost" renderIcon={props => <PenIcon {...props} />} onClick={() => {
          launchWorkspace2('workspace-test', {context: "context1", workspaceGroupContext: "groupA" });
        }}>
          context1
        </Button>
        <Button kind="ghost" renderIcon={props => <MotherIcon {...props} />} onClick={() => {
          launchWorkspace2('workspace-test-2', {context: "context1", workspaceGroupContext: "groupA" });
        }}>
          context1
        </Button>
        <br/>
        <Button kind="ghost" renderIcon={props => <PenIcon {...props} />} onClick={() => {
          launchWorkspace2('workspace-test', {context: "context2", workspaceGroupContext: "groupA" });
        }}>
          context2
        </Button>
        <Button kind="ghost" renderIcon={props => <MotherIcon {...props} />} onClick={() => {
          launchWorkspace2('workspace-test-2', {context: "context2", workspaceGroupContext: "groupA" });
        }}>
          context2
        </Button>
      </div>
      <div>
        <h3>Group Context B</h3>
        <Button kind="ghost" renderIcon={props => <PenIcon {...props} />} onClick={() => {
          launchWorkspace2('workspace-test', {context: "context1", workspaceGroupContext: "groupB" });
        }}>
          context1
        </Button>
        <Button kind="ghost" renderIcon={props => <MotherIcon {...props} />} onClick={() => {
          launchWorkspace2('workspace-test-2', {context: "context1", workspaceGroupContext: "groupB" });
        }}>
          context1
        </Button>
        <br/>
        <Button kind="ghost" renderIcon={props => <PenIcon {...props} />} onClick={() => {
          launchWorkspace2('workspace-test', {context: "context2", workspaceGroupContext: "groupB" });
        }}>
          context2
        </Button>
        <Button kind="ghost" renderIcon={props => <MotherIcon {...props} />} onClick={() => {
          launchWorkspace2('workspace-test-2', {context: "context2", workspaceGroupContext: "groupB" });
        }}>
          context2
        </Button>
      </div>
      {/* <WorkspaceContainer showSiderailAndBottomNav={true} contextKey={'login'} /> */}
    </div>
  )
};

export default Root;
