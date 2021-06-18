import React from "react";
import styles from "../styles.scss";
import ArrowRight24 from "@carbon/icons-react/es/arrow--right/24";
import Button from "carbon-components-react/es/components/Button";
import TextInput from "carbon-components-react/es/components/TextInput";
import { RouteComponentProps } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useConfig } from "@openmrs/esm-framework";
import { performLogin } from "./login.resource";
import { useCurrentUser } from "../CurrentUserContext";
import type { StaticContext } from "react-router";

const hidden: React.CSSProperties = {
  height: 0,
  width: 0,
  border: 0,
  padding: 0,
};

export interface LoginReferrer {
  referrer?: string;
}

export interface LoginProps
  extends RouteComponentProps<{}, StaticContext, LoginReferrer> {
  isLoginEnabled: boolean;
}

const Login: React.FC<LoginProps> = ({ history, location, isLoginEnabled }) => {
  const config = useConfig();
  const user = useCurrentUser();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const passwordInputRef = React.useRef<HTMLInputElement>(null);
  const usernameInputRef = React.useRef<HTMLInputElement>(null);
  const formRef = React.useRef<HTMLFormElement>(null);
  const [t] = useTranslation();

  React.useEffect(() => {
    if (user) {
      history.push("/login/location", location ? location.state : undefined);
    }
  }, [user, history, location]);

  React.useEffect(() => {
    const field = showPassword
      ? passwordInputRef.current
      : usernameInputRef.current;

    if (field) {
      field.focus();
    }
  }, [showPassword]);

  const continueLogin = React.useCallback(() => {
    const field = usernameInputRef.current;

    if (field.value.length > 0) {
      setShowPassword(true);
    } else {
      field.focus();
    }
  }, []);

  const changeUsername = React.useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => setUsername(evt.target.value),
    []
  );

  const changePassword = React.useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => setPassword(evt.target.value),
    []
  );

  const resetUserNameAndPassword = React.useCallback(() => {
    setUsername("");
    setPassword("");
  }, []);

  const handleSubmit = React.useCallback(
    async (evt: React.FormEvent<HTMLFormElement>) => {
      evt.preventDefault();
      evt.stopPropagation();

      if (!showPassword) {
        continueLogin();
        return false;
      }

      try {
        const loginRes = await performLogin(username, password);
        const authData = loginRes.data;
        const valid = authData && authData.authenticated;

        if (!valid) {
          throw new Error("Incorrect username or password");
        }
      } catch (error) {
        setErrorMessage(error.message);
        setShowPassword(false);
        resetUserNameAndPassword();
      }

      return false;
    },
    [continueLogin, resetUserNameAndPassword, showPassword, username, password]
  );

  const logo = config.logo.src ? (
    <img
      src={config.logo.src}
      alt={config.logo.alt}
      className={styles["logo-img"]}
    />
  ) : (
    <svg role="img" className={styles["logo"]}>
      <use xlinkHref="#omrs-logo-full-color"></use>
    </svg>
  );

  return (
    <div className={`canvas ${styles["container"]}`}>
      <div className={`omrs-card ${styles["login-card"]}`}>
        <div className={styles["center"]}>{logo}</div>
        <form onSubmit={handleSubmit} ref={formRef}>
          {!showPassword && (
            <div className={styles["input-group"]}>
              <TextInput
                id="username"
                type="text"
                name="username"
                labelText={t("username", "UserName")}
                className={styles.inputStyle}
                value={username}
                onChange={changeUsername}
                ref={usernameInputRef}
                autoFocus
                required
              />

              <input
                id="password"
                style={hidden}
                type="password"
                name="password"
                value={password}
                onChange={changePassword}
              />

              <Button
                className={styles.continueButton}
                renderIcon={ArrowRight24}
                type="submit"
                iconDescription="Next"
                onClick={continueLogin}
                disabled={!isLoginEnabled}
              >
                {t("continue", "Continue")}
              </Button>
            </div>
          )}
          {showPassword && (
            <div className={styles["input-group"]}>
              <input
                id="username"
                type="text"
                name="username"
                style={hidden}
                value={username}
                onChange={changeUsername}
                required
              />

              <TextInput.PasswordInput
                id="password"
                invalidText={t("A valid value is required")}
                labelText={t("password")}
                name="password"
                className={styles.inputStyle}
                value={password}
                onChange={changePassword}
                ref={passwordInputRef}
                required
                showPasswordLabel="Show password"
              />

              <Button
                aria-label="submit"
                type="submit"
                className={styles.continueButton}
                renderIcon={ArrowRight24}
                iconDescription="Next"
                disabled={!isLoginEnabled}
              >
                {t("login", "Log in")}
              </Button>
            </div>
          )}
          <div className={styles["center"]}>
            <p className={styles["error-msg"]}>
              {t("errorMessage", errorMessage)}
            </p>
          </div>
        </form>
      </div>
      <div className={styles["need-help"]}>
        <p className={styles["need-help-txt"]}>
          {t("needHelp", "Need help?")}
          <Button kind="ghost">
            {t("contactAdmin", "Contact the site administrator")}
          </Button>
        </p>
      </div>
      <div className={styles["footer"]}>
        <p className={styles["powered-by-txt"]}>
          {t("poweredBy", "Powered by")}
        </p>
        <div>
          <svg role="img" className={styles["powered-by-logo"]}>
            <use xlinkHref="#omrs-logo-partial-mono"></use>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Login;
