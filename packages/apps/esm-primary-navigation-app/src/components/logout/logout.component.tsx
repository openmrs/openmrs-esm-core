import React, { useEffect, useState } from "react";
import styles from "./logout.component.scss";
import { openmrsFetch, refetchCurrentUser } from "@openmrs/esm-framework";
import { Button } from "carbon-components-react";
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
