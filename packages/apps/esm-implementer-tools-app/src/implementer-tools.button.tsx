import React from "react";
import Tools20 from "@carbon/icons-react/es/tools/20";
import styles from "./implementer-tools.styles.css";
import { UserHasAccess } from "@openmrs/esm-framework";
import { togglePopup } from "./store";
import { HeaderGlobalAction } from "carbon-components-react/es/components/UIShell";
import { useTranslation } from "react-i18next";

const ImplementerToolsButton: React.FC = () => {
  const { t } = useTranslation();

  return (
    <UserHasAccess privilege="coreapps.systemAdministration">
      <HeaderGlobalAction
        onClick={togglePopup}
        aria-label={t("implementerTools", "Implementer Tools")}
        aria-labelledby="Implementer Tools"
        name="ImplementerToolsIcon"
        className={styles.toolStyles}
      >
        <Tools20 className={styles.popupTriggerButton} />
      </HeaderGlobalAction>
    </UserHasAccess>
  );
};

export default ImplementerToolsButton;
