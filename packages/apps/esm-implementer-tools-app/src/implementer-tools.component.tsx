import React from "react";
import Popup from "./popup/popup.component";
import { showToast, UserHasAccess, useStore } from "@openmrs/esm-framework";
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
  const [shouldShowToast, setShouldShowToast] = React.useState(false);

  React.useEffect(() => {
    // displaying toast if modules are missing
    setShouldShowToast(
      (alreadyShowing) =>
        alreadyShowing ||
        modulesWithMissingBackendModules.length > 0 ||
        modulesWithWrongBackendModulesVersion.length > 0
    );
  }, [modulesWithMissingBackendModules, modulesWithWrongBackendModulesVersion]);

  React.useEffect(() => {
    // only show toast max. 1 time
    if (shouldShowToast) {
      showToast({
        description: "Found modules with unresolved backend dependencies.",
        action: (
          <NotificationActionButton onClick={showModuleDiagnostics}>
            View
          </NotificationActionButton>
        ),
        kind: "error",
      });
    }
  }, [shouldShowToast]);

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
