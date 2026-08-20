import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import classnames from 'classnames';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, InlineLoading, InlineNotification, Link, PasswordInput, TextInput, Tile } from '@carbon/react';
import {
  ArrowRightIcon,
  getCoreTranslation,
  InformationFilledIcon,
  interpolateUrl,
  PasswordIcon,
  refetchCurrentUser,
  navigate as openmrsNavigate,
  useConfig,
  useConnectivity,
  UserIcon,
  useSession,
} from '@openmrs/esm-framework';
import { type ConfigSchema } from '../config-schema';
import Logo from '../logo.component';
import Footer from '../footer.component';
import styles from './login.scss';

export interface LoginReferrer {
  referrer?: string;
}

const supportEmail = 'support@uzimahosp.org';

const Login: React.FC = () => {
  const {
    announcements = [],
    background = { image: '', color: '' },
    showPasswordOnSeparateScreen,
    provider: loginProvider,
    links: loginLinks,
  } = useConfig<ConfigSchema>();
  const isLoginEnabled = useConnectivity();
  const { t } = useTranslation();
  const { user } = useSession();
  const location = useLocation() as unknown as Omit<Location, 'state'> & {
    state: LoginReferrer;
  };
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPasswordField, setShowPasswordField] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const usernameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) {
      if (loginProvider.type === 'oauth2' || loginProvider.type === 'custom') {
        openmrsNavigate({ to: loginProvider.loginUrl });
      } else if (!username && location.pathname === '/login/confirm') {
        navigate('/login');
      }
    }
  }, [username, navigate, location, user, loginProvider]);

  useEffect(() => {
    if (showPasswordOnSeparateScreen) {
      if (showPasswordField) {
        if (!passwordInputRef.current?.value) {
          passwordInputRef.current?.focus();
        }
      } else {
        usernameInputRef.current?.focus();
      }
    }
  }, [showPasswordField, showPasswordOnSeparateScreen]);

  const continueLogin = useCallback(() => {
    const currentUsername = usernameInputRef.current?.value?.trim();
    if (currentUsername) {
      // If credentials were autofilled, input onChange might not have been called
      setUsername(currentUsername);
      setShowPasswordField(true);
    } else {
      usernameInputRef.current?.focus();
    }
  }, []);

  const changeUsername = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => setUsername(evt.target.value), []);
  const changePassword = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => setPassword(evt.target.value), []);

  const containerClassName = classnames(styles.container, {
    [styles.containerWithImage]: !!background.image,
    [styles.containerWithColor]: !background.image && !!background.color,
  });

  const containerStyle = useMemo<React.CSSProperties | undefined>(() => {
    if (background.image) {
      return { '--login-bg-image': `url(${interpolateUrl(background.image)})` } as React.CSSProperties;
    }
    if (background.color) {
      return { '--login-bg-color': background.color } as React.CSSProperties;
    }
    return undefined;
  }, [background]);

  const stats = useMemo(
    () => [
      { value: '120k+', label: t('statRecordsPerYear', 'Records / year') },
      { value: '500+', label: t('statTeamMembers', 'Team members') },
      { value: '5', label: t('statLocations', 'Locations') },
    ],
    [t],
  );

  const handleSubmit = useCallback(
    async (evt: React.FormEvent<HTMLFormElement>) => {
      evt.preventDefault();
      evt.stopPropagation();

      // If credentials were autofilled, input onChange might not have been called
      const currentUsername = usernameInputRef.current?.value?.trim() || username;
      const currentPassword = passwordInputRef.current?.value || password;

      if (showPasswordOnSeparateScreen && !showPasswordField) {
        continueLogin();
        return false;
      }

      if (!currentPassword || !currentPassword.trim()) {
        passwordInputRef.current?.focus();
        return false;
      }

      try {
        setIsLoggingIn(true);
        const sessionStore = await refetchCurrentUser(currentUsername, currentPassword);
        const session = sessionStore.session;
        const authenticated = sessionStore?.session?.authenticated;

        if (authenticated) {
          if (session.sessionLocation) {
            let to = loginLinks?.loginSuccess || '/home';
            if (location?.state?.referrer) {
              // Only accept relative paths; absolute or protocol-relative referrers
              // are silently ignored to prevent open-redirect attacks after login.
              if (location.state.referrer.startsWith('/')) {
                to = `\${openmrsSpaBase}${location.state.referrer}`;
              }
            }

            openmrsNavigate({ to });
          } else {
            navigate('/login/location');
          }
        } else {
          setErrorMessage(t('invalidCredentials', 'Invalid username or password'));
          setUsername('');
          setPassword('');
          if (showPasswordOnSeparateScreen) {
            setShowPasswordField(false);
          }
        }

        return true;
      } catch (error: unknown) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage(t('invalidCredentials', 'Invalid username or password'));
        }
        setUsername('');
        setPassword('');
        if (showPasswordOnSeparateScreen) {
          setShowPasswordField(false);
        }
      } finally {
        setIsLoggingIn(false);
      }
    },
    [
      username,
      password,
      navigate,
      showPasswordOnSeparateScreen,
      showPasswordField,
      loginLinks,
      location,
      t,
      continueLogin,
    ],
  );

  if (!loginProvider || loginProvider.type === 'basic') {
    const usernameField = (
      <div className={styles.inputWithIcon}>
        <UserIcon size={16} className={styles.inputIcon} />
        <TextInput
          id="username"
          type="text"
          name="username"
          autoComplete="username"
          labelText={t('usernameOrStaffId', 'Username / Staff ID')}
          placeholder={t('usernamePlaceholder', 'e.g. j.doe or ID-00412')}
          value={username}
          onChange={changeUsername}
          ref={usernameInputRef}
          required
          autoFocus
        />
      </div>
    );

    const passwordField = (
      <div className={styles.inputWithIcon}>
        <PasswordIcon size={16} className={styles.inputIcon} />
        <PasswordInput
          id="password"
          labelText={t('password', 'Password')}
          name="password"
          autoComplete="current-password"
          onChange={changePassword}
          ref={passwordInputRef}
          required
          value={password}
          showPasswordLabel={t('showPassword', 'Show password')}
          invalidText={t('validValueRequired', 'A valid value is required')}
        />
      </div>
    );

    const forgotPasswordLink = (
      <Link className={styles.forgotPassword} href="#">
        {t('forgotPassword', 'Forgot password?')}
      </Link>
    );

    return (
      <div className={containerClassName} style={containerStyle} data-testid="login-container">
        <section className={styles.hero}>
          <div className={styles.heroBrand}>
            <div>
              <p className={styles.heroEyebrow}>{t('brandName', 'MBS Health')}</p>
              <p className={styles.heroBrandTitle}>{t('brandTagline', 'Hospital Management System')}</p>
            </div>
          </div>
          <div className={styles.heroBody}>
            <h1 className={styles.heroTitle}>
              {t('heroTitleLead', 'Compassionate')}{' '}
              <span className={styles.heroAccent}>{t('heroTitleAccent', 'Care,')}</span>{' '}
              {t('heroTitleRest', 'Powered by Technology.')}
            </h1>
            <p className={styles.heroSubtitle}>
              {t(
                'heroSubtitle',
                'Streamlining patient records, pharmacy diagnostics, procurement and billing — so you can spend more time healing.',
              )}
            </p>
          </div>
          <ul className={styles.statsRow}>
            {stats.map((stat) => (
              <li key={stat.label}>
                <Tile className={styles.statTile}>
                  <span className={styles.statValue}>{stat.value}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </Tile>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.formPanel}>
          <div className={styles.formInner}>
            {announcements.length > 0 && (
              <div className={styles.announcements}>
                {announcements.map((announcement, i) => (
                  <InlineNotification
                    key={i}
                    kind={announcement.kind}
                    title={announcement.title ? t(announcement.title) : ''}
                    subtitle={t(announcement.text)}
                    lowContrast
                    hideCloseButton
                  />
                ))}
              </div>
            )}

            <Tile className={styles.loginCard}>
              {errorMessage && (
                <div className={styles.errorMessage}>
                  <InlineNotification
                    kind="error"
                    subtitle={t(errorMessage)}
                    title={getCoreTranslation('error')}
                    onClick={() => setErrorMessage('')}
                  />
                </div>
              )}

              <p className={styles.cardEyebrow}>{t('welcomeBack', 'Welcome back')}</p>
              <h2 className={styles.cardTitle}>{t('signIn', 'Sign In')}</h2>
              <p className={styles.cardSubtitle}>
                {t('signInSubtitle', 'Enter your credentials to access the portal.')}
              </p>

              <form onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                  {usernameField}
                  {showPasswordOnSeparateScreen ? (
                    <>
                      <div className={showPasswordField ? styles.passwordField : styles.hiddenPasswordField}>
                        {showPasswordField && forgotPasswordLink}
                        <div className={styles.inputWithIcon}>
                          <PasswordIcon size={16} className={styles.inputIcon} />
                          <PasswordInput
                            id="password"
                            labelText={t('password', 'Password')}
                            name="password"
                            autoComplete="current-password"
                            onChange={changePassword}
                            ref={passwordInputRef}
                            required
                            value={password}
                            showPasswordLabel={t('showPassword', 'Show password')}
                            invalidText={t('validValueRequired', 'A valid value is required')}
                            aria-hidden={!showPasswordField}
                            tabIndex={showPasswordField ? 0 : -1}
                          />
                        </div>
                      </div>
                      {showPasswordField ? (
                        <Button
                          type="submit"
                          className={styles.continueButton}
                          renderIcon={(props) => <ArrowRightIcon size={24} {...props} />}
                          iconDescription={t('loginButtonIconDescription', 'Log in button')}
                          disabled={!isLoginEnabled || isLoggingIn}
                        >
                          {isLoggingIn ? (
                            <InlineLoading
                              className={styles.loader}
                              description={t('loggingIn', 'Logging in') + '...'}
                            />
                          ) : (
                            t('login', 'Log in')
                          )}
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          className={styles.continueButton}
                          renderIcon={(props) => <ArrowRightIcon size={24} {...props} />}
                          iconDescription={t('continueToPassword', 'Continue to password')}
                          onClick={(evt) => {
                            evt.preventDefault();
                            continueLogin();
                          }}
                          disabled={!isLoginEnabled}
                        >
                          {t('continue', 'Continue')}
                        </Button>
                      )}
                    </>
                  ) : (
                    <>
                      <div className={styles.passwordField}>
                        {forgotPasswordLink}
                        {passwordField}
                      </div>
                      <Button
                        type="submit"
                        className={styles.continueButton}
                        renderIcon={(props) => <ArrowRightIcon size={24} {...props} />}
                        iconDescription={t('loginButtonIconDescription', 'Log in button')}
                        disabled={!isLoginEnabled || isLoggingIn}
                      >
                        {isLoggingIn ? (
                          <InlineLoading className={styles.loader} description={t('loggingIn', 'Logging in') + '...'} />
                        ) : (
                          t('login', 'Log in')
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </form>
            </Tile>

            <div className={styles.restrictedNotice}>
              <span className={styles.restrictedIcon}>
                <InformationFilledIcon size={16} />
              </span>
              <p>
                {t(
                  'restrictedNotice',
                  'This portal is restricted to authorised staff. All activity is logged and audited. For access issues contact',
                )}{' '}
                <Link href={`mailto:${supportEmail}`}>{supportEmail}</Link>.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }
  return null;
};

export default Login;
