import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  InlineLoading,
  InlineNotification,
  PasswordInput,
  TextInput,
  Tile,
} from "@carbon/react";
import { ArrowLeft, ArrowRight } from "@carbon/react/icons";
import { useTranslation } from "react-i18next";
import {
  useConfig,
  interpolateUrl,
  useSession,
  refetchCurrentUser,
  clearCurrentUser,
  getSessionStore,
  useConnectivity,
} from "@openmrs/esm-framework";
import { performLogin } from "../login.resource";
import styles from "./login.scss";

const hidden: React.CSSProperties = {
  height: 0,
  width: 0,
  border: 0,
  padding: 0,
};

export interface LoginReferrer {
  referrer?: string;
}

export interface LoginProps extends LoginReferrer {}

const Login: React.FC<LoginProps> = () => {
  const config = useConfig();
  const isLoginEnabled = useConnectivity();
  const { t } = useTranslation();
  const { user } = useSession();
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const showPassword = location.pathname === "/login/confirm";

  useEffect(() => {
    if (user) {
      clearCurrentUser();
      refetchCurrentUser().then(() => {
        const authenticated =
          getSessionStore().getState().session.authenticated;
        if (authenticated) {
          navigate("/login/location", { state: location.state });
        }
      });
    } else if (!username && location.pathname === "/login/confirm") {
      navigate("/login", { state: location.state });
    }
  }, [username, navigate, location, user]);

  useEffect(() => {
    const field = showPassword
      ? passwordInputRef.current
      : usernameInputRef.current;

    if (field) {
      field.focus();
    }
  }, [showPassword]);

  useEffect(() => {
    if (!user && config.provider.type === "oauth2") {
      const loginUrl = config.provider.loginUrl;
      window.location.href = loginUrl;
    }
  }, [config, user]);

  const continueLogin = useCallback(() => {
    const field = usernameInputRef.current;

    if (field.value.length > 0) {
      navigate("/login/confirm", { state: location.state });
    } else {
      field.focus();
    }
  }, [location.state, navigate]);

  const changeUsername = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => setUsername(evt.target.value),
    []
  );

  const changePassword = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => setPassword(evt.target.value),
    []
  );

  const resetUserNameAndPassword = useCallback(() => {
    setUsername("");
    setPassword("");
  }, []);

  const handleSubmit = useCallback(
    async (evt: React.FormEvent<HTMLFormElement>) => {
      evt.preventDefault();
      evt.stopPropagation();

      if (!showPassword) {
        continueLogin();
        return false;
      }

      try {
        setIsLoggingIn(true);
        const loginRes = await performLogin(username, password);
        const authData = loginRes.data;
        const valid = authData && authData.authenticated;

        if (valid) {
          navigate("/login/location", { state: location.state });
        } else {
          throw new Error("invalidCredentials");
        }
      } catch (error) {
        setIsLoggingIn(false);
        setErrorMessage(error.message);
        resetUserNameAndPassword();
      }

      return false;
    },

    [
      showPassword,
      continueLogin,
      username,
      password,
      navigate,
      location.state,
      resetUserNameAndPassword,
    ]
  );

  const logo = config.logo.src ? (
    <img
      src={interpolateUrl(config.logo.src)}
      alt={config.logo.alt}
      className={styles["logo-img"]}
    />
  ) : (
    <svg role="img" className={styles["logo"]}>
      <title>OpenMRS logo</title>
      <use xlinkHref="#omrs-logo-full-color"></use>
    </svg>
  );

  if (config.provider.type === "basic") {
    return (
      <div className={`canvas ${styles["container"]}`}>
        {errorMessage && (
          <InlineNotification
            className={styles.errorMessage}
            kind="error"
            /**
             * This comment tells i18n to still keep the following translation keys (used as value for: errorMessage):
             * t('invalidCredentials')
             */
            subtitle={t(errorMessage)}
            title={t("error", "Error")}
            onClick={() => setErrorMessage("")}
          />
        )}
        <Tile className={styles["login-card"]}>
          {showPassword ? (
            <div className={styles["back-button-div"]}>
              <Button
                className={styles["back-button"]}
                iconDescription="Back to username"
                kind="ghost"
                onClick={() => navigate("/login")}
                renderIcon={(props) => (
                  <ArrowLeft
                    size={24}
                    style={{ marginRight: "0.5rem" }}
                    {...props}
                  />
                )}
              >
                <span>{t("back", "Back")}</span>
              </Button>
            </div>
          ) : null}
          <div className={styles["center"]}>{logo}</div>
          <form onSubmit={handleSubmit} ref={formRef}>
            {!showPassword && (
              <div className={styles["input-group"]}>
                <TextInput
                  id="username"
                  type="text"
                  name="username"
                  labelText={t("username", "Username")}
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
                  renderIcon={(props) => <ArrowRight size={24} {...props} />}
                  type="submit"
                  iconDescription="Continue to login"
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

                <PasswordInput
                  id="password"
                  invalidText={t(
                    "validValueRequired",
                    "A valid value is required"
                  )}
                  labelText={t("password", "Password")}
                  name="password"
                  value={password}
                  onChange={changePassword}
                  ref={passwordInputRef}
                  required
                  showPasswordLabel="Show password"
                />

                <Button
                  type="submit"
                  className={styles.continueButton}
                  renderIcon={(props) => <ArrowRight size={24} {...props} />}
                  iconDescription="Log in"
                  disabled={!isLoginEnabled || isLoggingIn}
                >
                  {isLoggingIn ? (
                    <InlineLoading
                      className={styles.loader}
                      description={t("loggingIn", "Logging in") + "..."}
                    />
                  ) : (
                    <span>{t("login", "Log in")}</span>
                  )}
                </Button>
              </div>
            )}
          </form>
        </Tile>
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
  }

  return null;
};

export default Login;
