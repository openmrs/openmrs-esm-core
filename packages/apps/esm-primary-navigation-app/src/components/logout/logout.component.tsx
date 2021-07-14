import React from "react";
import styles from "./logout.component.scss";
import Button from "carbon-components-react/es/components/Button";
import { logoutUser } from "@openmrs/esm-framework";
import { useTranslation } from "react-i18next";

export interface LogoutProps {}

const Logout: React.FC<LogoutProps> = () => {
  const { t } = useTranslation();

  return (
    <Button
      className={styles.logout}
      onClick={logoutUser}
      aria-labelledby="Logout"
      role="button"
    >
      {t("Logout", "Logout")}
    </Button>
  );
};

export default Logout;
