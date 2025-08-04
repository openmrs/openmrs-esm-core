import { Button } from '@carbon/react';
import {
  MotherIcon,
  PenIcon,
  closeWorkspaceGroup2,
  launchWorkspace2,
  launchWorkspaceGroup2,
} from '@openmrs/esm-framework';
import React from 'react';

const Root: React.FC = () => {
  return (
    <div>
      <h1>Workspace Test</h1>
      <div>
        <h3>Group Context A</h3>
        <div>
          <Button
            kind="ghost"
            onClick={() => {
              // In the happy path, calling `launchWorkspaceGroup2` launches the workspace group with the given props,
              // and its action menu appears (if at least one of its workspace windows is configured to have icon).
              // The group props (2nd param) is shared for all windows and their workspaces. Only one workspace group may be opened at
              // a time. If a workspace group is already opened, attempting to `launchWorkspaceGroup2` with a different group, or
              // same group but incompatible** group props, will result in prompting the user for unsaved changes. If the user confirms,
              // the currently opened group will be closed, along with its windows (and their workspaces),
              // and then the newly requested group with its group props will be opened.
              //
              // This (together with other changes) also replaces the current implementation's `<WorkspaceContainer>` component, which renders
              // the action menu.
              //
              // ** 2 sets of props are compatible if either one is nullish, or if they are shallow equal.
              launchWorkspaceGroup2('workspace-group-test', { groupContext: 'A' });
            }}
          >
            Open Workspace Group
          </Button>

          <Button
            kind="ghost"
            onClick={() => {
              closeWorkspaceGroup2();
            }}
          >
            Close Workspace Group
          </Button>
        </div>
        <h5> Open Workspace:</h5>
        <Button
          kind="ghost"
          renderIcon={(props) => <PenIcon {...props} />}
          onClick={() => {
            // In the happy path, `launchWorkspace2` launches the specified workspace. This also implicitly opens
            // the workspace window to which the workspace belongs (if it's not opened already),
            // and the workspace group to which the window belongs (if it's not opened already).
            //
            // When calling `launchWorkspace2`, we need to also pass in the workspace props. While not required,
            // we can also passed in the window props (shared by other workspaces in the window) and the group props
            // (shared by all windows and their workspaces). Omitting the windows props or the group props*** means the caller
            // explicitly does not care what the current window props and group props are, and that they may be set
            // by other actions (like calling `launchWorkspace2` on a different workspace with those props passed in)
            // at a later time.
            //
            // If there is already an opened workspace group, and it's not the group the workspace belongs to
            // or has incompatible** group props, then we prompt the user to close the group (and its windows and their workspaces).
            // On user confirm, the existing opened groups is closed and the new workspace, along with its window and its group,
            // is opened.
            //
            // If the window is already opened, but with incompatible window props, we prompt the user to close
            // the window (and all its opened workspaces), and reopen the window with (only) the newly requested workspace.
            //
            // If the workspace is already opened, but with incompatible workspace props, we also prompt the suer to close
            // the **window** (and all its opened workspaces), and reopen the window with (only) the newly requested workspace.
            // This is true regardless of whether the already opened workspace has any child workspaces.
            //
            // Note that calling this function *never* results in creating child workspace in the affected window.
            // To do so, we need to call `launchChildWorkspace` instead.
            //
            // ** 2 sets of props are compatible if either one is nullish, or if they are shallow equal.
            //
            // *** Omitting windows or group props is useful for workspaces that don't have ties to the window or group "context" (props).
            // For example, in the patient chart, the visit notes / clinical forms / order basket action menu button all share
            // a "group context" of the current visit. However, the "patient list" action menu button does not need to share that group
            // context, so opening that workspace should not need to cause other workspaces / windows / groups to potentially close.
            // The "patient search" workspace in the queues and ward apps is another example of such workspace.
            launchWorkspace2('workspace-test', {}, { windowContext: 'X', icon: 'pen' }, { groupContext: 'A' });
          }}
        >
          Context X
        </Button>
        <Button
          kind="ghost"
          renderIcon={(props) => <MotherIcon {...props} />}
          onClick={() => {
            launchWorkspace2('workspace-test-2', {}, { windowContext: 'X', icon: 'mother' }, { groupContext: 'A' });
          }}
        >
          Context X
        </Button>
        <br />
        <Button
          kind="ghost"
          renderIcon={(props) => <PenIcon {...props} />}
          onClick={() => {
            launchWorkspace2('workspace-test', {}, { windowContext: 'Y', icon: 'pen' }, { groupContext: 'A' });
          }}
        >
          Context Y
        </Button>
        <Button
          kind="ghost"
          renderIcon={(props) => <MotherIcon {...props} />}
          onClick={() => {
            launchWorkspace2('workspace-test-2', {}, { windowContext: 'Y', icon: 'mother' }, { groupContext: 'A' });
          }}
        >
          Context Y
        </Button>
      </div>
      <div>
        <h3>Group Context B</h3>
        <div>
          <Button
            kind="ghost"
            onClick={() => {
              launchWorkspaceGroup2('workspace-group-test', { groupContext: 'B' });
            }}
          >
            Open Workspace Group
          </Button>

          <Button
            kind="ghost"
            onClick={() => {
              closeWorkspaceGroup2();
            }}
          >
            Close Workspace Group
          </Button>
        </div>
        <h5> Open Workspace:</h5>
        <Button
          kind="ghost"
          renderIcon={(props) => <PenIcon {...props} />}
          onClick={() => {
            launchWorkspace2('workspace-test', {}, { windowContext: 'X', icon: 'pen' }, { groupContext: 'B' });
          }}
        >
          Context X
        </Button>
        <Button
          kind="ghost"
          renderIcon={(props) => <MotherIcon {...props} />}
          onClick={() => {
            launchWorkspace2('workspace-test-2', {}, { windowContext: 'X', icon: 'mother' }, { groupContext: 'B' });
          }}
        >
          Context X
        </Button>
        <br />
        <Button
          kind="ghost"
          renderIcon={(props) => <PenIcon {...props} />}
          onClick={() => {
            launchWorkspace2('workspace-test', {}, { windowContext: 'Y', icon: 'pen' }, { groupContext: 'B' });
          }}
        >
          Context Y
        </Button>
        <Button
          kind="ghost"
          renderIcon={(props) => <MotherIcon {...props} />}
          onClick={() => {
            launchWorkspace2('workspace-test-2', {}, { windowContext: 'Y', icon: 'mother' }, { groupContext: 'B' });
          }}
        >
          Context Y
        </Button>
      </div>
      <p>
        This is a wall of text so we can see the effects of the workspace in overlay vs non-overlay mode. This is a wall
        of text so we can see the effects of the workspace in overlay vs non-overlay mode. This is a wall of text so we
        can see the effects of the workspace in overlay vs non-overlay mode. This is a wall of text so we can see the
        effects of the workspace in overlay vs non-overlay mode. This is a wall of text so we can see the effects of the
        workspace in overlay vs non-overlay mode. This is a wall of text so we can see the effects of the workspace in
        overlay vs non-overlay mode. This is a wall of text so we can see the effects of the workspace in overlay vs
        non-overlay mode. This is a wall of text so we can see the effects of the workspace in overlay vs non-overlay
        mode. This is a wall of text so we can see the effects of the workspace in overlay vs non-overlay mode. This is
        a wall of text so we can see the effects of the workspace in overlay vs non-overlay mode. This is a wall of text
        so we can see the effects of the workspace in overlay vs non-overlay mode. This is a wall of text so we can see
        the effects of the workspace in overlay vs non-overlay mode. This is a wall of text so we can see the effects of
        the workspace in overlay vs non-overlay mode. This is a wall of text so we can see the effects of the workspace
        in overlay vs non-overlay mode. This is a wall of text so we can see the effects of the workspace in overlay vs
        non-overlay mode. This is a wall of text so we can see the effects of the workspace in overlay vs non-overlay
        mode. This is a wall of text so we can see the effects of the workspace in overlay vs non-overlay mode. This is
        a wall of text so we can see the effects of the workspace in overlay vs non-overlay mode.
      </p>
    </div>
  );
};

export default Root;
