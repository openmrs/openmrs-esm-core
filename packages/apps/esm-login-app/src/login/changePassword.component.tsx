// ChangePassword.tsx

import React, { useState, useCallback } from "react";
import { TextInput, Button } from "@carbon/react";
import { useTranslation } from "react-i18next";
import { changePassword as changePasswordApi } from "../login.resource";

interface ChangePasswordProps {
  onSuccess: () => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ onSuccess }) => {
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleChangePassword = useCallback(async () => {
    try {
      // Validate password change inputs (add more validation as needed)
      if (newPassword !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      // Call your API to change the password
      await changePasswordApi(currentPassword, newPassword);

      // Reset form and show success message
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
      onSuccess();
    } catch (error) {
      setError("Error changing password. Please try again."); // Handle API error
    }
  }, [currentPassword, newPassword, confirmPassword, onSuccess]);

  return (
    <div>
      <h2>{t("changePassword", "Change Password")}</h2>
      <TextInput
        type="password"
        labelText={t("currentPassword", "Current Password")}
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />
      <TextInput
        type="password"
        labelText={t("newPassword", "New Password")}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <TextInput
        type="password"
        labelText={t("confirmPassword", "Confirm Password")}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Button onClick={handleChangePassword}>
        {t("changePassword", "Change Password")}
      </Button>
    </div>
  );
};

export default ChangePassword;
