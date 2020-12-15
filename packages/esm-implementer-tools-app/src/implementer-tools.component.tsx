import React, { useState, useEffect } from "react";
import { UserHasAccess } from "@openmrs/esm-react-utils";
import { connect, Provider } from "unistore/react";
import Popup from "./popup/popup.component";
import styles from "./implementer-tools.styles.css";
import { getStore } from "./store";
import { showToast } from "@openmrs/esm-styleguide";
import {
  checkModules,
  MissingBackendModules,
} from "./backend-dependencies/openmrs-backend-dependencies";
import { NotificationActionButton } from "carbon-components-react/lib/components/Notification";

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

const PopupHandler = connect("isOpen")(({ isOpen }) => {
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

  useEffect(() => {
    const modules = (window.installedModules ?? [])
      .filter((module) => module[1].backendDependencies)
      .map((module) => ({
        backendDependencies: module[1].backendDependencies,
        moduleName: module[0],
      }));
    checkModules(modules).then(
      ({
        modulesWithMissingBackendModules,
        modulesWithWrongBackendModulesVersion,
      }) => {
        setModulesWithMissingBackendModules(modulesWithMissingBackendModules);
        setModulesWithWrongBackendModulesVersion(
          modulesWithWrongBackendModulesVersion
        );
        if (
          modulesWithMissingBackendModules.length > 0 ||
          modulesWithWrongBackendModulesVersion.length > 0
        ) {
          showToast({
            description: (
              <span>Found modules with unresolved backend dependencies.</span>
            ),
            action: (
              <NotificationActionButton onClick={showModuleDiagnostics}>
                View
              </NotificationActionButton>
            ),
            kind: "error",
          });
        }
      }
    );
  }, []);

  function togglePopup() {
    getStore().setState({ isOpen: !isOpen });
  }
  const showModuleDiagnostics = () => {
    setVisibleTabIndex(1);
    if (!isOpen) {
      togglePopup();
    }
    return false;
  };

  return (
    <>
      {" "}
      <button
        onClick={togglePopup}
        className={`${styles.popupTriggerButton} ${
          hasAlert ? styles.triggerButtonAlert : ""
        }`}
      />{" "}
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
    </>
  );
});
