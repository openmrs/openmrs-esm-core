import React, { useCallback } from "react";
import styles from "./logout.component.scss";
import { navigate } from "@openmrs/esm-framework";
import { Button, Switcher, SwitcherDivider } from "carbon-components-react";
import { useTranslation } from "react-i18next";

export interface LogoutProps {}

const Logout: React.FC<LogoutProps> = () => {
  const { t } = useTranslation();
  const logout = useCallback(() => {
    navigate({ to: "${openmrsSpaBase}/logout" });
  }, []);

  return (
    <>
      <SwitcherDivider className={styles.divider} />
      <Switcher aria-label="Switcher Container">
        <Button
          className={styles.logout}
          onClick={logout}
          aria-labelledby="Logout"
          role="button"
        >
          {t("Logout", "Logout")}
        </Button>
      </Switcher>
    </>
  );
};

export default Logout;
