import React, { useEffect, useState } from "react";
import { openmrsFetch, refetchCurrentUser } from "@openmrs/esm-framework";
import styles from "./logout.component.scss";
import Button from "carbon-components-react/es/components/Button";
import { useTranslation } from "react-i18next";

export interface LogoutProps {
  onLogout(): void;
}

const Logout: React.FC<LogoutProps> = ({ onLogout }) => {
  const { t } = useTranslation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const ac = new AbortController();
    if (isLoggingOut) {
      openmrsFetch("/ws/rest/v1/session", { method: "DELETE" })
        .then(refetchCurrentUser)
        .then(onLogout);
    }
    return () => ac.abort();
  }, [isLoggingOut, onLogout]);

  return (
    <Button
      className={styles.logout}
      onClick={() => setIsLoggingOut(true)}
      aria-labelledby="Logout"
      role="button"
    >
      {t("Logout", "Logout")}
    </Button>
  );
};

export default Logout;
