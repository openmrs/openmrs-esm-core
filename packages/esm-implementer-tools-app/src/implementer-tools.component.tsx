import React, { useState } from "react";
import { UserHasAccess } from "@openmrs/esm-react-utils";
import { connect, Provider } from "unistore/react";
import Popup from "./popup/popup.component";
import styles from "./implementer-tools.styles.css";

import "./backend-dependencies/openmrs-backend-dependencies";
import { getStore } from "./store";
import { showToast } from "@openmrs/esm-styleguide";
import {
  checkModules,
  MissingBackendModules,
} from "./backend-dependencies/openmrs-backend-dependencies";
import { useEffect } from "react";

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
    determineUnresolvedDeps();
  }, []);
  function togglePopup() {
    getStore().setState({ isOpen: !isOpen });
  }
  const showModuleDiagnostics = (e) => {
    e.preventDefault();
    setVisibleTabIndex(1);
    if (!isOpen) {
      togglePopup();
    }
    return false;
  };

  const determineUnresolvedDeps = () => {
    const modules = window.installedModules
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
              <span>
                Found modules with unresolved backend dependencies.{" "}
                <a href="#" onClick={showModuleDiagnostics}>
                  See details
                </a>
              </span>
            ),
            kind: "error",
          });
        }
      }
    );
  };
  console.log("Is open:", isOpen);
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
