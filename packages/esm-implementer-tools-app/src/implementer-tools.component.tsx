import React, { useState, useEffect } from "react";
import { Provider } from "unistore/react";
import { UserHasAccess } from "@openmrs/esm-react-utils";
import Popup from "./popup/popup.component";
import styles from "./implementer-tools.styles.css";
import { showToast } from "@openmrs/esm-styleguide";
import {
  checkModules,
  MissingBackendModules,
} from "./backend-dependencies/openmrs-backend-dependencies";
import { NotificationActionButton } from "carbon-components-react/lib/components/Notification";
import { getStore, useStore } from "./store";
import { UiEditor } from "./ui-editor/ui-editor";

export default function ImplementerTools() {
  const store = getStore();

  return (
    <UserHasAccess privilege="coreapps.systemAdministration">
      <Provider store={store}>
        <PopupHandler />
      </Provider>
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
  const { isOpen, isUIEditorEnabled } = useStore();

  function togglePopup() {
    getStore().setState({ isOpen: !isOpen });
  }

  // loading missing modules
  useEffect(() => {
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

  // displaying toast if modules are missing
  useEffect(() => {
    if (
      !(
        modulesWithMissingBackendModules.length ||
        modulesWithWrongBackendModulesVersion.length
      )
    )
      return;

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
  }, [modulesWithMissingBackendModules, modulesWithWrongBackendModulesVersion]);

  return (
    <>
      <button
        onClick={togglePopup}
        className={`${styles.popupTriggerButton} ${
          hasAlert ? styles.triggerButtonAlert : ""
        }`}
      />
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
