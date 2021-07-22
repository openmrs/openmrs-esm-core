import React, { useState, useEffect } from "react";
import Popup from "./popup/popup.component";
import { NotificationActionButton } from "carbon-components-react/es/components/Notification";
import {
  showNotification,
  UserHasAccess,
  useStore,
} from "@openmrs/esm-framework";
import {
  implementerToolsStore,
  showModuleDiagnostics,
  togglePopup,
} from "./store";
import { UiEditor } from "./ui-editor/ui-editor";
import { useBackendDependencies } from "./backend-dependencies/useBackendDependencies";
import { hasInvalidDependencies } from "./backend-dependencies/openmrs-backend-dependencies";

function PopupHandler() {
  const frontendModules = useBackendDependencies();
  const [shouldShowNotification, setShouldShowNotification] = useState(false);

  useEffect(() => {
    // displaying toast if modules are missing
    setShouldShowNotification(
      (alreadyShowing) =>
        alreadyShowing || hasInvalidDependencies(frontendModules)
    );
  }, [frontendModules]);

  useEffect(() => {
    // only show notification max. 1 time
    if (shouldShowNotification) {
      showNotification({
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
          frontendModules={frontendModules}
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
