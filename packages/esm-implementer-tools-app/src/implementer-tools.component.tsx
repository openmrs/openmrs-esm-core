import React, { useState } from "react";
import { UserHasAccess } from "@openmrs/esm-react-utils";
import Popup from "./popup/popup.component";
import styles from "./implementer-tools.styles.css";

import "./backend-dependencies/openmrs-backend-dependencies";

export default function ImplementerTools() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [hasAlert, setHasAlert] = useState(false);

  function togglePopup() {
    setIsPopupOpen(!isPopupOpen);
  }

  return (
    <UserHasAccess privilege="coreapps.systemAdministration">
      <button
        tabIndex={0}
        onClick={togglePopup}
        className={`${styles.popupTriggerButton} ${
          hasAlert ? styles.triggerButtonAlert : ""
        }`}
      />
      {isPopupOpen && <Popup close={togglePopup} setHasAlert={setHasAlert} />}
    </UserHasAccess>
  );
}
