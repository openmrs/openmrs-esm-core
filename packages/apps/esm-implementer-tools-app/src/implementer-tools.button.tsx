import React from "react";
import { useTranslation } from "react-i18next";
import { HeaderGlobalAction } from "@carbon/react";
import { Close, Tools } from "@carbon/react/icons";
import { UserHasAccess, useStore } from "@openmrs/esm-framework";
import { implementerToolsStore, togglePopup } from "./store";
import styles from "./implementer-tools.styles.scss";

const ImplementerToolsButton: React.FC = () => {
  const { t } = useTranslation();
  const { isOpen } = useStore(implementerToolsStore);

  return (
    <UserHasAccess privilege="coreapps.systemAdministration">
      <HeaderGlobalAction
        aria-label={t("implementerTools", "Implementer Tools")}
        aria-labelledby="Implementer Tools"
        className={styles.toolStyles}
        enterDelayMs={500}
        name="ImplementerToolsIcon"
        onClick={togglePopup}
      >
        {isOpen ? <Close size={20} /> : <Tools size={20} />}
      </HeaderGlobalAction>
    </UserHasAccess>
  );
};

export default ImplementerToolsButton;
