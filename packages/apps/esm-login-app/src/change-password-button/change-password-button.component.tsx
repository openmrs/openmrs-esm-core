import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Button, Switcher, SwitcherDivider } from "@carbon/react";
import { navigate } from "@openmrs/esm-framework";
import styles from "./change-password-button.scss";

export interface ChangePasswordLinkProps {}

const ChangePasswordLink: React.FC<ChangePasswordLinkProps> = () => {
  const { t } = useTranslation();
  const goToChangePassword = useCallback(() => {
    navigate({ to: "${openmrsSpaBase}/change-password"});
  }, []);

  return (
    <>
      <SwitcherDivider className={styles.divider} />
      <Switcher aria-label="Switcher Container">
        <Button
          className={styles.userProfileButton}
          onClick={goToChangePassword}
          aria-labelledby="changePassword"
          role="button"
        >
          {t("changePassword", "Change Password")}
        </Button>
      </Switcher>
    </>
  );
};

export default ChangePasswordLink;