import React from "react";
import Popup from "./popup/popup.component";
import {
  showNotification,
  UserHasAccess,
  useStore,
} from "@openmrs/esm-framework";
import { UiEditor } from "./ui-editor/ui-editor";
import {
  implementerToolsStore,
  showModuleDiagnostics,
  togglePopup,
} from "./store";
import { useBackendDependencies } from "./backend-dependencies/useBackendDependencies";
import { NotificationActionButton } from "carbon-components-react";

function PopupHandler() {
  const [
    modulesWithMissingBackendModules,
    modulesWithWrongBackendModulesVersion,
  ] = useBackendDependencies();
  const [shouldShowNotification, setShouldShowNotification] =
    React.useState(false);

  React.useEffect(() => {
    // displaying toast if modules are missing
    setShouldShowNotification(
      (alreadyShowing) =>
        alreadyShowing ||
        modulesWithMissingBackendModules.length > 0 ||
        modulesWithWrongBackendModulesVersion.length > 0
    );
  }, [modulesWithMissingBackendModules, modulesWithWrongBackendModulesVersion]);

  React.useEffect(() => {
    // only show notification max. 1 time
    if (shouldShowNotification) {
      showNotification({
        type: "toast",
        description: "Found modules with unresolved backend dependencies.",
        action: (
          <NotificationActionButton onClick={showModuleDiagnostics}>
            View
          </NotificationActionButton>
        ),
        kind: "error",
      });
    }
  }, [shouldShowNotification]);

  const { isOpen, isUIEditorEnabled, openTabIndex } = useStore(
    implementerToolsStore
  );
  return (
    <>
      {isOpen ? (
        <Popup
          close={togglePopup}
          modulesWithMissingBackendModules={modulesWithMissingBackendModules}
          modulesWithWrongBackendModulesVersion={
            modulesWithWrongBackendModulesVersion
          }
          visibleTabIndex={openTabIndex}
        />
      ) : null}
      {isUIEditorEnabled ? <UiEditor /> : null}
    </>
  );
}

export default function ImplementerTools() {
  return (
    <UserHasAccess privilege="coreapps.systemAdministration">
      <PopupHandler />
    </UserHasAccess>
  );
}
