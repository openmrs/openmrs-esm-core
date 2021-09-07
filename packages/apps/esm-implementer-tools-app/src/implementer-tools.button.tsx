import React from "react";
import { useTranslation } from "react-i18next";
import Close20 from "@carbon/icons-react/es/close/20";
import Tools20 from "@carbon/icons-react/es/tools/20";
import { HeaderGlobalAction } from "carbon-components-react/es/components/UIShell";
import { UserHasAccess, useStore } from "@openmrs/esm-framework";
import { implementerToolsStore, togglePopup } from "./store";
import styles from "./implementer-tools.styles.css";

const ImplementerToolsButton: React.FC = () => {
  const { t } = useTranslation();
  const { isOpen } = useStore(implementerToolsStore);

  return (
    <UserHasAccess privilege="coreapps.systemAdministration">
      <HeaderGlobalAction
        aria-label={t("implementerTools", "Implementer Tools")}
        aria-labelledby="Implementer Tools"
        className={styles.toolStyles}
        name="ImplementerToolsIcon"
        onClick={togglePopup}
      >
        {isOpen ? (
          <Close20 />
        ) : (
          <Tools20 className={styles.popupTriggerButton} />
        )}
      </HeaderGlobalAction>
    </UserHasAccess>
  );
};

export default ImplementerToolsButton;
