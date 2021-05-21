import React from "react";
import Tools20 from "@carbon/icons-react/es/tools/20";
import styles from "./implementer-tools.styles.css";
import { UserHasAccess, useStore } from "@openmrs/esm-framework";
import { implementerToolsStore, togglePopup } from "./store";
import { HeaderGlobalAction } from "carbon-components-react/es/components/UIShell";

const ImplementerToolsButton: React.FC = () => {
  const { hasAlert } = useStore(implementerToolsStore);

  return (
    <UserHasAccess privilege="coreapps.systemAdministration">
      <HeaderGlobalAction
        onClick={togglePopup}
        aria-label="Implementer Tools"
        aria-labelledby="Implementer Tools"
        name="ImplementerToolsIcon"
        className={styles.toolStyles}
      >
        <Tools20
          className={`${styles.popupTriggerButton} ${
            hasAlert ? styles.triggerButtonAlert : ""
          }`}
        />
      </HeaderGlobalAction>
    </UserHasAccess>
  );
};

export default ImplementerToolsButton;
