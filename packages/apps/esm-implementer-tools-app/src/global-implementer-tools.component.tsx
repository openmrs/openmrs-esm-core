import React from "react";
import { useTranslation } from "react-i18next";
import ChevronUp from "@carbon/icons-react/es/chevron--up/16";
import ChevronDown from "@carbon/icons-react/es/chevron--down/16";
import { UserHasAccess, useStore } from "@openmrs/esm-framework";
import { implementerToolsStore, togglePopup } from "./store";
import styles from "./implementer-tools.styles.scss";

const GlobalImplementerToolsButton: React.FC = () => {
  const { t } = useTranslation();
  const { isOpen } = useStore(implementerToolsStore);

  return (
    <UserHasAccess privilege="coreapps.systemAdministration">
      <div
        className={styles.chevronImplementerToolsButton}
        data-testid="globalImplementerToolsButton"
      >
        <div onClick={togglePopup} role="button" tabIndex={0}>
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </div>
      </div>
    </UserHasAccess>
  );
};

export default GlobalImplementerToolsButton;
