import React from "react";
import { useTranslation } from "react-i18next";
import { ChevronUp, ChevronDown } from "@carbon/react/icons";
import { UserHasAccess, useStore } from "@openmrs/esm-framework";
import { implementerToolsStore, togglePopup } from "./store";
import styles from "./implementer-tools.styles.scss";

const GlobalImplementerToolsButton: React.FC = () => {
  const { isOpen } = useStore(implementerToolsStore);

  return (
    <UserHasAccess privilege="coreapps.systemAdministration">
      <div
        className={styles.chevronImplementerToolsButton}
        data-testid="globalImplementerToolsButton"
      >
        <div onClick={togglePopup} role="button" tabIndex={0}>
          {isOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </div>
      </div>
    </UserHasAccess>
  );
};

export default GlobalImplementerToolsButton;
