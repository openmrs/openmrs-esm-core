import React, { useState } from "react";
import { openmrsRootDecorator } from "@openmrs/esm-context";
import Popup from "./popup/popup.component";
import styles from "./implementer-tools.styles.css";
import { UserHasAccessReact } from "@openmrs/esm-api";

function Root(props: RootProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [hasAlert, setHasAlert] = useState(false);

  function togglePopup() {
    setIsPopupOpen(!isPopupOpen);
  }

  return (
    <UserHasAccessReact privilege="coreapps.systemAdministration">
      <button
        tabIndex={0}
        onClick={togglePopup}
        className={`${styles.popupTriggerButton} ${
          hasAlert ? styles.triggerButtonAlert : ""
        }`}
      />
      {isPopupOpen && <Popup close={togglePopup} setHasAlert={setHasAlert} />}
    </UserHasAccessReact>
  );
}

export default openmrsRootDecorator({
  featureName: "Implementer Tools",
  moduleName: "@openmrs/esm-implementer-tools-app",
})(Root);

type RootProps = {};
