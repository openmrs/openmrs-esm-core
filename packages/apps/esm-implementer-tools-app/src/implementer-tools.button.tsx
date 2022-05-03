import React from "react";
import { useTranslation } from "react-i18next";
import Close20 from "@carbon/icons-react/es/close/20";
import Tools24 from "@carbon/icons-react/es/tools/24";
import { HeaderGlobalAction } from "carbon-components-react";
import { useStore } from "@openmrs/esm-framework";
import { implementerToolsStore, togglePopup } from "./store";
import styles from "./implementer-tools.styles.scss";

const ImplementerToolsButton: React.FC = () => {
  const { t } = useTranslation();
  const { isOpen } = useStore(implementerToolsStore);

  return (
    <HeaderGlobalAction
      aria-label={t("implementerTools", "Implementer Tools")}
      aria-labelledby="Implementer Tools"
      className={styles.toolStyles}
      name="ImplementerToolsIcon"
      onClick={togglePopup}
    >
      {isOpen ? <Close20 /> : <Tools24 />}
    </HeaderGlobalAction>
  );
};

export default ImplementerToolsButton;
