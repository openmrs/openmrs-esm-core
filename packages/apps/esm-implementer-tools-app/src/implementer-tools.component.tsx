import React, { useState, useEffect } from "react";
import {
  showActionableNotification,
  UserHasAccess,
  useStore,
} from "@openmrs/esm-framework";
import {
  implementerToolsStore,
  showModuleDiagnostics,
  togglePopup,
} from "./store";

import { useBackendDependencies } from "./backend-dependencies/useBackendDependencies";
import { hasInvalidDependencies } from "./backend-dependencies/openmrs-backend-dependencies";
import { useTranslation } from "react-i18next";
import { useFrontendModules } from "./hooks";

const Popup = React.lazy(() => import("./popup/popup.component"));
const UiEditor = React.lazy(() => import("./ui-editor/ui-editor"));

function PopupHandler() {
  const frontendModules = useFrontendModules();
  const backendDependencies = useBackendDependencies();
  const [shouldShowNotification, setShouldShowNotification] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // displaying actionable notification if backend modules have missing dependencies
    setShouldShowNotification(
      (alreadyShowing) =>
        alreadyShowing || hasInvalidDependencies(backendDependencies)
    );
  }, [backendDependencies]);

  useEffect(() => {
    // only show notification max. 1 time
    if (shouldShowNotification) {
      showActionableNotification({
        critical: false,
        kind: "error",
        subtitle: t(
          "checkImplementerToolsMessage",
          "Check the Backend Modules tab in the Implementer Tools for more details"
        ),
        title: t(
          "modulesWithMissingDependenciesWarning",
          "Some modules have unresolved backend dependencies"
        ),
        actionButtonLabel: t("viewModules", "View modules"),
        onActionButtonClick: showModuleDiagnostics,
      });
    }
  }, [t, shouldShowNotification]);

  const { isOpen, isUIEditorEnabled, openTabIndex } = useStore(
    implementerToolsStore
  );

  return (
    <>
      {isOpen ? (
        <Popup
          close={togglePopup}
          frontendModules={frontendModules}
          backendDependencies={backendDependencies}
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
