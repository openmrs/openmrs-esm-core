import React, { useState, useEffect } from "react";
import { UserHasAccess, showToast, useStore } from "@openmrs/esm-framework";
import Popup from "./popup/popup.component";
import styles from "./implementer-tools.styles.css";
import {
  checkModules,
  MissingBackendModules,
} from "./backend-dependencies/openmrs-backend-dependencies";
import { NotificationActionButton } from "carbon-components-react/es/components/Notification";
import { UiEditor } from "./ui-editor/ui-editor";
import { implementerToolsStore } from "./store";
import { HeaderGlobalAction } from "carbon-components-react/es/components/UIShell";
import Tools32 from "@carbon/icons-react/es/tools/32";

export default function ImplementerTools() {
  return (
    <UserHasAccess privilege="coreapps.systemAdministration">
      <PopupHandler />
    </UserHasAccess>
  );
}

function PopupHandler() {
  const [hasAlert, setHasAlert] = useState(false);
  const [visibleTabIndex, setVisibleTabIndex] = useState(0);
  const [
    modulesWithMissingBackendModules,
    setModulesWithMissingBackendModules,
  ] = useState<Array<MissingBackendModules>>([]);
  const [
    modulesWithWrongBackendModulesVersion,
    setModulesWithWrongBackendModulesVersion,
  ] = useState<Array<MissingBackendModules>>([]);
  const { isOpen, isUIEditorEnabled } = useStore(implementerToolsStore);
  const [shouldShowToast, setShouldShowToast] = useState(false);

  function togglePopup() {
    implementerToolsStore.setState({ isOpen: !isOpen });
  }

  useEffect(() => {
    // loading missing modules
    checkModules().then(
      ({
        modulesWithMissingBackendModules,
        modulesWithWrongBackendModulesVersion,
      }) => {
        setModulesWithMissingBackendModules(modulesWithMissingBackendModules);
        setModulesWithWrongBackendModulesVersion(
          modulesWithWrongBackendModulesVersion
        );
      }
    );
  }, []);

  useEffect(() => {
    // displaying toast if modules are missing
    setShouldShowToast(
      (alreadyShowing) =>
        alreadyShowing ||
        modulesWithMissingBackendModules.length > 0 ||
        modulesWithWrongBackendModulesVersion.length > 0
    );
  }, [modulesWithMissingBackendModules, modulesWithWrongBackendModulesVersion]);

  useEffect(() => {
    // only show toast max. 1 time
    if (shouldShowToast) {
      const showModuleDiagnostics = () => {
        setVisibleTabIndex(1);

        if (!isOpen) {
          togglePopup();
        }

        return false;
      };

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

  return (
    <>
      <HeaderGlobalAction
        aria-label="Implementer Tools"
        aria-labelledby="Implementer Tools"
        name="ImplementerToolsIcon"
        className={styles.toolStyles}
      >
        <Tools32
          onClick={togglePopup}
          className={`${styles.popupTriggerButton} ${
            hasAlert ? styles.triggerButtonAlert : ""
          }`}
        />
      </HeaderGlobalAction>
      {isOpen ? (
        <Popup
          close={togglePopup}
          setHasAlert={setHasAlert}
          modulesWithMissingBackendModules={modulesWithMissingBackendModules}
          modulesWithWrongBackendModulesVersion={
            modulesWithWrongBackendModulesVersion
          }
          visibleTabIndex={visibleTabIndex}
        />
      ) : null}
      {isUIEditorEnabled ? <UiEditor /> : null}
    </>
  );
}
