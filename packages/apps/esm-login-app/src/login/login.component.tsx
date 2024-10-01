import React, { useState, useRef, useEffect, useCallback } from 'react';
import { type To, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, InlineLoading, InlineNotification, PasswordInput, TextInput, Tile } from '@carbon/react';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  getCoreTranslation,
  navigate as openmrsNavigate,
  refetchCurrentUser,
  useConfig,
  useConnectivity,
  useSession,
} from '@openmrs/esm-framework';
import { type ConfigSchema } from '../config-schema';
import Logo from '../logo.component';
import styles from './login.scss';

export interface LoginReferrer {
  referrer?: string;
}

const hidden: React.CSSProperties = {
  height: 0,
  width: 0,
  border: 0,
  padding: 0,
};

const Login: React.FC = () => {
  const { showPasswordOnSeparateScreen, provider: loginProvider, links: loginLinks } = useConfig<ConfigSchema>();
  const isLoginEnabled = useConnectivity();
  const { t } = useTranslation();
  const { user } = useSession();
  const location = useLocation() as unknown as Omit<Location, 'state'> & {
    state: LoginReferrer;
  };

  const rawNavigate = useNavigate();
  const navigate = useCallback(
    (to: To) => {
      rawNavigate(to, { state: location.state });
    },
    [rawNavigate, location.state],
  );

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const usernameInputRef = useRef<HTMLInputElement>(null);

  const showUsername = location.pathname === '/login';
  const showPassword = !showPasswordOnSeparateScreen || location.pathname === '/login/confirm';

  useEffect(() => {
    if (!user) {
      if (loginProvider.type === 'oauth2') {
        openmrsNavigate({ to: loginProvider.loginUrl });
      } else if (!username && location.pathname === '/login/confirm') {
        navigate('/login');
      }
    }
  }, [username, navigate, location, user, loginProvider]);

  useEffect(() => {
    const fieldToFocus =
      showPasswordOnSeparateScreen && showPassword ? passwordInputRef.current : usernameInputRef.current;

    fieldToFocus?.focus();
  }, [showPassword, showPasswordOnSeparateScreen]);

  const continueLogin = useCallback(() => {
    const usernameField = usernameInputRef.current;

    if (usernameField.value && usernameField.value.trim()) {
      navigate('/login/confirm');
    } else {
      usernameField.focus();
    }
  }, [location.state, navigate]);

  const changeUsername = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => setUsername(evt.target.value), []);

  const changePassword = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => setPassword(evt.target.value), []);

  const handleSubmit = useCallback(
    async (evt: React.FormEvent<HTMLFormElement>) => {
      evt.preventDefault();
      evt.stopPropagation();

      if (!showPassword) {
        continueLogin();
        return false;
      } else if (!password || !password.trim()) {
        passwordInputRef.current.focus();
        return false;
      }

      try {
        setIsLoggingIn(true);

        const sessionStore = await refetchCurrentUser(username, password);
        const session = sessionStore.session;
        const authenticated = sessionStore?.session?.authenticated;
        if (authenticated) {
          if (session.sessionLocation) {
            let to = loginLinks?.loginSuccess || '/home';
            if (location?.state?.referrer) {
              if (location.state.referrer.startsWith('/')) {
                to = `\${openmrsSpaBase}${location.state.referrer}`;
              } else {
                to = location.state.referrer;
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
            navigate('/login');
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
          navigate('/login');
        }
      } finally {
        setIsLoggingIn(false);
      }

      return false;
    },

    [showPassword, username, password, navigate],
  );

  if (!loginProvider || loginProvider.type === 'basic') {
    return (
      <div className={styles.container}>
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
          {showPasswordOnSeparateScreen && showPassword ? (
            <div className={styles.backButtonDiv}>
              <Button
                className={styles.backButton}
                iconDescription={t('backToUserNameIconLabel', 'Back to username')}
                kind="ghost"
                onClick={() => navigate('/login')}
                renderIcon={(props) => <ArrowLeftIcon {...props} size={24} />}
              >
                <span>{t('back', 'Back')}</span>
              </Button>
            </div>
          ) : null}
          <div className={styles.center}>
            <Logo t={t} />
          </div>
          <form onSubmit={handleSubmit} ref={formRef}>
            {showUsername && (
              <div className={styles.inputGroup}>
                <TextInput
                  id="username"
                  type="text"
                  name="username"
                  labelText={t('username', 'Username')}
                  value={username}
                  onChange={changeUsername}
                  ref={usernameInputRef}
                  autoFocus
                  required
                />
                {/* For password managers */}
                {showPasswordOnSeparateScreen && (
                  <input
                    id="password"
                    style={hidden}
                    type="password"
                    name="password"
                    value={password}
                    onChange={changePassword}
                  />
                )}
                {showPasswordOnSeparateScreen && (
                  <Button
                    className={styles.continueButton}
                    renderIcon={(props) => <ArrowRightIcon size={24} {...props} />}
                    type="submit"
                    iconDescription="Continue to login"
                    onClick={continueLogin}
                    disabled={!isLoginEnabled}
                  >
                    {t('continue', 'Continue')}
                  </Button>
                )}
              </div>
            )}
            {showPassword && (
              <div className={styles.inputGroup}>
                <PasswordInput
                  id="password"
                  invalidText={t('validValueRequired', 'A valid value is required')}
                  labelText={t('password', 'Password')}
                  name="password"
                  onChange={changePassword}
                  ref={passwordInputRef}
                  required
                  showPasswordLabel={t('showPassword', 'Show password')}
                  value={password}
                />
                {/* For password managers */}
                {showPasswordOnSeparateScreen && (
                  <input
                    id="username"
                    type="text"
                    name="username"
                    style={hidden}
                    value={username}
                    onChange={changeUsername}
                    required
                  />
                )}
                <Button
                  type="submit"
                  className={styles.continueButton}
                  renderIcon={(props) => <ArrowRightIcon size={24} {...props} />}
                  iconDescription="Log in"
                  disabled={!isLoginEnabled || isLoggingIn}
                >
                  {isLoggingIn ? (
                    <InlineLoading className={styles.loader} description={t('loggingIn', 'Logging in') + '...'} />
                  ) : (
                    <span>{t('login', 'Log in')}</span>
                  )}
                </Button>
              </div>
            )}
          </form>
        </Tile>
        <div className={styles.footer}>
          <div className="card">
            <p className={styles.poweredByTxt}>{t('poweredBy', 'Powered by')}</p>
            <div>
              <svg width="156" height="40" viewBox="0 0 156 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M37.9121 12.0811H40.032V19.8035H40.3348L48.4611 12.0811H51.5147L42.6818 20.2325L51.9437 29.9486H48.8396L40.3348 20.8634H40.032V29.9486H37.9121V12.0811Z"
                  fill="black"
                />
                <path
                  d="M63.8236 27.8035C63.117 28.712 62.3431 29.3514 61.5019 29.7215C60.6606 30.0748 59.6848 30.2515 58.5744 30.2515C57.6491 30.2515 56.8162 30.0916 56.076 29.772C55.3357 29.4355 54.7048 28.9896 54.1832 28.4344C53.6785 27.8792 53.2831 27.2231 52.9971 26.466C52.7279 25.7089 52.5933 24.9013 52.5933 24.0433C52.5933 23.1347 52.7447 22.3019 53.0476 21.5448C53.3504 20.7709 53.771 20.1147 54.3094 19.5764C54.8478 19.0211 55.4871 18.5921 56.2274 18.2893C56.9677 17.9864 57.7752 17.835 58.6501 17.835C59.4745 17.835 60.2316 17.978 60.9214 18.264C61.6112 18.5332 62.2001 18.937 62.688 19.4754C63.1927 19.997 63.5797 20.6447 63.8489 21.4186C64.1181 22.1757 64.2527 23.0422 64.2527 24.018V24.6489H54.7132C54.7468 25.1537 54.8646 25.6416 55.0665 26.1127C55.2852 26.5669 55.5628 26.9707 55.8993 27.324C56.2358 27.6605 56.6312 27.9297 57.0854 28.1316C57.5397 28.3335 58.036 28.4344 58.5744 28.4344C59.4325 28.4344 60.1559 28.283 60.7448 27.9802C61.3336 27.6773 61.8636 27.2315 62.3347 26.6426L63.8236 27.8035ZM62.1328 22.9833C62.0991 21.9738 61.7711 21.1663 61.1485 20.5606C60.526 19.9549 59.668 19.6521 58.5744 19.6521C57.4808 19.6521 56.5975 19.9549 55.9246 20.5606C55.2516 21.1663 54.8478 21.9738 54.7132 22.9833H62.1328Z"
                  fill="black"
                />
                <path
                  d="M67.1176 20.9391C67.1176 20.4008 67.1007 19.896 67.0671 19.4249C67.0334 18.9538 67.0166 18.5248 67.0166 18.1379H68.8841C68.8841 18.4575 68.8925 18.7772 68.9094 19.0969C68.9262 19.4165 68.9346 19.7446 68.9346 20.0811H68.9851C69.1197 19.7951 69.3047 19.5175 69.5403 19.2483C69.7927 18.9791 70.0871 18.7435 70.4236 18.5416C70.7601 18.3229 71.1386 18.1547 71.5592 18.0369C71.9798 17.9023 72.4341 17.835 72.922 17.835C73.6959 17.835 74.3605 17.9528 74.9157 18.1883C75.4877 18.4239 75.9588 18.752 76.329 19.1726C76.6991 19.5932 76.9683 20.1063 77.1365 20.712C77.3216 21.3009 77.4141 21.9486 77.4141 22.6552V29.9486H75.4457V22.8571C75.4457 21.8645 75.227 21.0821 74.7895 20.5101C74.3521 19.9381 73.6707 19.6521 72.7453 19.6521C72.106 19.6521 71.5508 19.7614 71.0797 19.9801C70.6255 20.1989 70.2469 20.5101 69.9441 20.9139C69.6581 21.3177 69.4393 21.7972 69.2879 22.3524C69.1533 22.9076 69.086 23.5217 69.086 24.1947V29.9486H67.1176V20.9391Z"
                  fill="black"
                />
                <path
                  d="M85.3011 32.649C85.0992 33.1537 84.8889 33.608 84.6702 34.0117C84.4683 34.4324 84.216 34.7857 83.9131 35.0717C83.6271 35.3745 83.2738 35.6017 82.8532 35.7531C82.4494 35.9213 81.9531 36.0054 81.3642 36.0054C81.0782 36.0054 80.7754 35.9886 80.4557 35.955C80.1529 35.9213 79.8668 35.8372 79.5976 35.7026L79.85 33.9865C80.0519 34.0706 80.2622 34.1211 80.4809 34.1379C80.6996 34.1716 80.952 34.1884 81.238 34.1884C81.8774 34.1884 82.3484 34.0117 82.6513 33.6584C82.9541 33.3051 83.2149 32.834 83.4336 32.2452L84.2412 30.0243L79.3453 18.1379H81.6418L85.3011 27.3997H85.3516L88.8595 18.1379H91.0046L85.3011 32.649Z"
                  fill="black"
                />
                <path
                  d="M92.8035 19.6521C93.4092 19.0296 94.1242 18.5753 94.9486 18.2893C95.7898 17.9864 96.6395 17.835 97.4975 17.835C99.2473 17.835 100.509 18.2472 101.283 19.0716C102.057 19.896 102.444 21.1494 102.444 22.8319V27.9045C102.444 28.241 102.461 28.5943 102.494 28.9644C102.528 29.3177 102.57 29.6458 102.621 29.9486H100.728C100.661 29.6794 100.618 29.385 100.602 29.0654C100.602 28.7289 100.602 28.4344 100.602 28.1821H100.551C100.164 28.7877 99.6426 29.2841 98.9865 29.671C98.3471 30.058 97.5732 30.2515 96.6647 30.2515C96.059 30.2515 95.487 30.1758 94.9486 30.0243C94.427 29.8729 93.9644 29.6542 93.5606 29.3682C93.1736 29.0654 92.8624 28.6952 92.6268 28.2578C92.3913 27.8203 92.2735 27.3156 92.2735 26.7436C92.2735 25.7678 92.5259 25.0022 93.0306 24.447C93.5353 23.8918 94.1579 23.4796 94.8981 23.2104C95.6552 22.9412 96.4628 22.773 97.3208 22.7057C98.1957 22.6384 98.9949 22.6048 99.7183 22.6048H100.475V22.2514C100.475 21.3934 100.215 20.7457 99.6931 20.3082C99.1884 19.8708 98.4733 19.6521 97.548 19.6521C96.9086 19.6521 96.2777 19.7614 95.6552 19.9801C95.0495 20.182 94.5112 20.5017 94.0401 20.9391L92.8035 19.6521ZM98.507 24.2704C97.2451 24.2704 96.2441 24.447 95.5038 24.8004C94.7635 25.1537 94.3934 25.7341 94.3934 26.5417C94.3934 27.282 94.6373 27.8119 95.1253 28.1316C95.63 28.4344 96.2525 28.5859 96.9928 28.5859C97.5648 28.5859 98.0611 28.4933 98.4817 28.3083C98.9192 28.1064 99.2809 27.8456 99.5669 27.5259C99.8529 27.2062 100.072 26.8361 100.223 26.4155C100.374 25.9781 100.459 25.5154 100.475 25.0275V24.2704H98.507Z"
                  fill="black"
                />
                <path
                  d="M106.215 12.0811H117.445V14.0495H108.334V19.6521H116.839V21.6205H108.334V27.9802H117.899V29.9486H106.215V12.0811Z"
                  fill="black"
                />
                <path
                  d="M120.994 12.0811H124.149L130.205 26.0874H130.256L136.363 12.0811H139.442V29.9486H137.322V14.958H137.272L130.861 29.9486H129.574L123.164 14.958H123.114V29.9486H120.994V12.0811Z"
                  fill="black"
                />
                <path
                  d="M143.709 12.0811H148.277C149.135 12.0811 149.985 12.1315 150.826 12.2325C151.684 12.3334 152.449 12.5521 153.122 12.8886C153.795 13.2251 154.342 13.7214 154.763 14.3776C155.183 15.0169 155.394 15.8918 155.394 17.0022C155.394 18.3145 154.998 19.3745 154.208 20.182C153.417 20.9896 152.323 21.5028 150.927 21.7215L155.999 29.9486H153.4L148.555 21.9234H145.829V29.9486H143.709V12.0811ZM145.829 19.9549H147.722C148.311 19.9549 148.916 19.9381 149.539 19.9044C150.178 19.8708 150.759 19.7614 151.28 19.5764C151.818 19.3913 152.256 19.1053 152.592 18.7183C152.946 18.3145 153.122 17.7425 153.122 17.0022C153.122 16.3629 152.996 15.8497 152.744 15.4628C152.491 15.0758 152.155 14.7814 151.734 14.5795C151.331 14.3608 150.868 14.2178 150.346 14.1505C149.842 14.0832 149.328 14.0495 148.807 14.0495H145.829V19.9549Z"
                  fill="black"
                />
                <path
                  d="M3.02873 29.7491C1.11258 26.7903 0 23.2627 0 19.4751C0 15.375 1.30387 11.5793 3.51956 8.48023H8.56641C6.35072 11.5793 5.04685 15.375 5.04685 19.4751C5.04685 23.2627 6.15943 26.7903 8.07558 29.7491H3.02873Z"
                  fill="#7F7B72"
                />
                <path
                  d="M26.446 8.48022C28.3622 11.439 29.4748 14.9667 29.4748 18.7542C29.4748 22.8543 28.1709 26.65 25.9552 29.7491H20.9084C23.1241 26.65 24.4279 22.8543 24.4279 18.7542C24.4279 14.9667 23.3154 11.439 21.3992 8.48022L26.446 8.48022Z"
                  fill="#7F7B72"
                />
                <path
                  d="M21.8545 23.621C22.1799 22.2285 22.3515 20.7809 22.3515 19.2951C22.3515 17.8093 22.1799 16.3617 21.8545 14.9692H7.70789C7.38251 16.3617 7.21094 17.8093 7.21094 19.2951C7.21094 20.7809 7.38251 22.2285 7.70789 23.621H21.8545Z"
                  fill="#BB0000"
                />
                <path
                  d="M21.3362 25.4236H8.22266C9.45871 29.0492 11.762 32.2169 14.7794 34.5902C17.7968 32.2169 20.1001 29.0492 21.3362 25.4236Z"
                  fill="#006600"
                />
                <path
                  d="M14.7794 4C17.7969 6.37328 20.1001 9.54094 21.3362 13.1667H8.22266C9.45871 9.54094 11.7619 6.37328 14.7794 4Z"
                  fill="black"
                />
              </svg>
            </div>
          </div>
          <div className={styles.divider}></div>
          <div className="card">
            <p className={styles.poweredByTxt}>{t('distributionText', 'A distribution of')}</p>
            <div>
              <svg width="128" height="40" viewBox="0 0 128 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M13.5421 13.5556C15.2354 11.8624 17.575 10.8148 20.1598 10.8148C22.7376 10.8148 25.0719 11.8577 26.7638 13.5429L26.7709 7.31106C24.7896 6.29059 22.5412 5.71436 20.1598 5.71436C17.7771 5.71436 15.517 6.3634 13.5352 7.38424L13.5421 13.5556Z"
                  fill="#E15D29"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M26.7717 26.7803C25.0784 28.4739 22.7398 29.5211 20.155 29.5211C17.5772 29.5211 15.2429 28.4786 13.5497 26.793L13.543 33.0252C15.5252 34.0454 17.7726 34.6219 20.155 34.6219C22.5377 34.6219 24.7858 34.0454 26.767 33.0248L26.7717 26.7803Z"
                  fill="#E5A330"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M13.5561 26.7887C11.8629 25.0954 10.8153 22.7568 10.8153 20.172C10.8153 17.5942 11.8579 15.2602 13.5434 13.567L7.31121 13.5603C6.29108 15.5422 5.71484 17.7893 5.71484 20.172C5.71484 22.5547 6.29108 24.8028 7.31222 26.7843L13.5561 26.7887Z"
                  fill="#555191"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M26.7676 13.5425C28.4609 15.2354 29.5084 17.5754 29.5084 20.1602C29.5084 22.738 28.4659 25.0723 26.7799 26.7638L33.0125 26.7708C34.0327 24.7896 34.6088 22.5415 34.6088 20.1602C34.6088 17.7771 34.0327 15.5287 33.0118 13.5468L26.7676 13.5425Z"
                  fill="#0A8C7C"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M52.4981 20.1688C52.4981 17.2283 50.4417 14.8659 47.4477 14.8659C44.4531 14.8659 42.3973 17.2283 42.3973 20.1688C42.3973 23.1094 44.4531 25.4727 47.4477 25.4727C50.4417 25.4727 52.4981 23.1094 52.4981 20.1688ZM40.7734 20.1688C40.7734 16.3093 43.5694 13.46 47.4477 13.46C51.3254 13.46 54.1217 16.3093 54.1217 20.1688C54.1217 24.0293 51.3254 26.8797 47.4477 26.8797C43.5694 26.8797 40.7734 24.0293 40.7734 20.1688Z"
                  fill="black"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M60.3416 25.3917C62.1927 25.3917 63.3836 24.0001 63.3836 22.2046C63.3836 20.4091 62.1927 19.0169 60.3416 19.0169C58.4912 19.0169 57.3009 20.4091 57.3009 22.2046C57.3009 24.0001 58.4912 25.3917 60.3416 25.3917ZM55.873 17.9182H57.3009V19.1632H57.3379C58.1258 18.2472 59.1695 17.6978 60.4149 17.6978C63.1087 17.6978 64.9218 19.6034 64.9218 22.2046C64.9218 24.7694 63.0351 26.7108 60.6354 26.7108C59.0959 26.7108 57.8687 25.9412 57.3379 24.9702H57.3009V30.5446H55.873V17.9182Z"
                  fill="black"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M73.2017 21.4347C73.1469 19.9876 72.1933 19.0169 70.6182 19.0169C69.0434 19.0169 67.9997 19.9876 67.8165 21.4347H73.2017ZM74.4296 24.9344C73.4209 26.2348 72.2125 26.7108 70.6182 26.7108C67.9257 26.7108 66.2773 24.6962 66.2773 22.2046C66.2773 19.5486 68.1459 17.6978 70.674 17.6978C73.0928 17.6978 74.7399 19.3469 74.7399 22.1866V22.6445H67.8165C67.9257 24.1277 69.0615 25.3917 70.6182 25.3917C71.8451 25.3917 72.6703 24.9524 73.3476 24.0916L74.4296 24.9344Z"
                  fill="black"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M76.5902 19.9518C76.5902 19.1632 76.5176 18.4861 76.5176 17.9182H77.8725C77.8725 18.3762 77.9095 18.8515 77.9095 19.3282H77.9465C78.331 18.4861 79.3939 17.6978 80.8036 17.6978C83.0574 17.6978 84.0638 19.1271 84.0638 21.1968V26.4904H82.6359V21.3441C82.6359 19.9148 82.012 19.0169 80.6752 19.0169C78.8255 19.0169 78.0188 20.3544 78.0188 22.3149V26.4904H76.5902V19.9518Z"
                  fill="black"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M87.1289 13.7844H89.3837L93.7134 23.7953H93.7494L98.1131 13.7844H100.314V26.5545H98.7998V15.8401H98.7642L94.1813 26.5545H93.261L88.6798 15.8401H88.6439V26.5545H87.1289V13.7844Z"
                  fill="black"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M105.005 19.4124H106.357C108.035 19.4124 110.218 19.4124 110.218 17.3009C110.218 15.462 108.613 15.1914 107.134 15.1914H105.005V19.4124ZM103.49 13.7844H106.754C109.226 13.7844 111.841 14.1445 111.841 17.3009C111.841 19.1588 110.633 20.3681 108.649 20.6747L112.274 26.5545H110.417L106.953 20.819H105.005V26.5545H103.49V13.7844Z"
                  fill="black"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M120.377 16.0377C119.871 15.2263 118.97 14.8659 118.049 14.8659C116.714 14.8659 115.326 15.4976 115.326 17.0121C115.326 18.185 115.975 18.7084 118.013 19.3581C119.998 19.9894 121.838 20.6385 121.838 23.1455C121.838 25.6889 119.654 26.8797 117.347 26.8797C115.867 26.8797 114.28 26.3923 113.414 25.1113L114.712 24.0474C115.253 24.9864 116.336 25.4727 117.437 25.4727C118.735 25.4727 120.214 24.7151 120.214 23.2537C120.214 21.6844 119.15 21.4138 116.877 20.6562C115.073 20.0606 113.703 19.2666 113.703 17.1391C113.703 14.6859 115.813 13.46 118.049 13.46C119.475 13.46 120.683 13.8561 121.62 14.9561L120.377 16.0377Z"
                  fill="black"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M62.4824 30.5876H62.9611L63.8801 32.7138H63.8878L64.8149 30.5876H65.2824V33.3H64.9607V31.0243H64.9527L63.9799 33.3H63.7843L62.8115 31.0243H62.8041V33.3H62.4824V30.5876Z"
                  fill="black"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M66.6836 30.5876H68.3881V30.8863H67.0053V31.7368H68.2964V32.0357H67.0053V33.0011H68.4574V33.3H66.6836V30.5876Z"
                  fill="black"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M69.8803 33.0011H70.4927C71.1139 33.0011 71.5851 32.6868 71.5851 31.9435C71.5851 31.2006 71.1139 30.8863 70.4927 30.8863H69.8803V33.0011ZM69.5586 30.5876H70.6006C71.1327 30.5876 71.9293 30.9441 71.9293 31.9435C71.9293 32.944 71.1327 33.3 70.6006 33.3H69.5586V30.5876Z"
                  fill="black"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M72.9434 33.3H73.2654V30.5876H72.9434V33.3Z"
                  fill="black"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M76.3381 31.1471C76.1774 30.9283 75.9206 30.8174 75.6601 30.8174C75.055 30.8174 74.6258 31.3499 74.6258 31.9435C74.6258 32.5718 75.0513 33.0702 75.6601 33.0702C75.9895 33.0702 76.254 32.9359 76.4456 32.6907L76.687 32.8935C76.4456 33.2195 76.0934 33.3688 75.6601 33.3688C74.8823 33.3688 74.2812 32.7672 74.2812 31.9435C74.2812 31.1471 74.8557 30.5188 75.6601 30.5188C76.0281 30.5188 76.3881 30.6454 76.6177 30.944L76.3381 31.1471Z"
                  fill="black"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M78.5069 31.0015H78.4988L77.9358 32.3344H79.043L78.5069 31.0015ZM78.361 30.5876H78.6635L79.8164 33.3H79.441L79.1653 32.6333H77.8094L77.5297 33.3H77.166L78.361 30.5876Z"
                  fill="black"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M80.6738 30.5876H80.9958V33.0011H82.2369V33.3H80.6738V30.5876Z"
                  fill="black"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M84.9721 31.7828H85.2595C85.6158 31.7828 86.0793 31.7828 86.0793 31.3346C86.0793 30.9441 85.7385 30.8863 85.4245 30.8863H84.9721V31.7828ZM84.6504 30.5876H85.3438C85.8685 30.5876 86.4242 30.6642 86.4242 31.3346C86.4242 31.7291 86.1674 31.986 85.7459 32.0511L86.5159 33.3H86.1217L85.3855 32.0818H84.9721V33.3H84.6504V30.5876Z"
                  fill="black"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M87.5664 30.5876H89.2706V30.8863H87.8884V31.7368H89.1792V32.0357H87.8884V33.0011H89.3399V33.3H87.5664V30.5876Z"
                  fill="black"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M92.2368 31.1471C92.0758 30.9283 91.8193 30.8174 91.5585 30.8174C90.9535 30.8174 90.5242 31.3499 90.5242 31.9435C90.5242 32.5718 90.9498 33.0702 91.5585 33.0702C91.8879 33.0702 92.1525 32.9359 92.3437 32.6907L92.5851 32.8935C92.3437 33.2195 91.9914 33.3688 91.5585 33.3688C90.781 33.3688 90.1797 32.7672 90.1797 31.9435C90.1797 31.1471 90.7541 30.5188 91.5585 30.5188C91.9262 30.5188 92.2866 30.6454 92.5165 30.944L92.2368 31.1471Z"
                  fill="black"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M95.7111 31.9435C95.7111 31.3192 95.2742 30.8174 94.6385 30.8174C94.0026 30.8174 93.5659 31.3192 93.5659 31.9435C93.5659 32.5681 94.0026 33.0702 94.6385 33.0702C95.2742 33.0702 95.7111 32.5681 95.7111 31.9435ZM93.2207 31.9435C93.2207 31.1237 93.8147 30.5188 94.6385 30.5188C95.4621 30.5188 96.056 31.1237 96.056 31.9435C96.056 32.7639 95.4621 33.3688 94.6385 33.3688C93.8147 33.3688 93.2207 32.7639 93.2207 31.9435Z"
                  fill="black"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M97.3162 31.7828H97.6035C97.9595 31.7828 98.4231 31.7828 98.4231 31.3346C98.4231 30.9441 98.0822 30.8863 97.7683 30.8863H97.3162V31.7828ZM96.9941 30.5876H97.6873C98.2126 30.5876 98.7679 30.6642 98.7679 31.3346C98.7679 31.7291 98.5114 31.986 98.0903 32.0511L98.8597 33.3H98.4654L97.7296 32.0818H97.3162V33.3H96.9941V30.5876Z"
                  fill="black"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M100.105 33.0011H100.718C101.339 33.0011 101.809 32.6868 101.809 31.9435C101.809 31.2006 101.339 30.8863 100.718 30.8863H100.105V33.0011ZM99.7832 30.5876H100.825C101.358 30.5876 102.155 30.9441 102.155 31.9435C102.155 32.944 101.358 33.3 100.825 33.3H99.7832V30.5876Z"
                  fill="black"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M106.02 31.0663C105.913 30.8939 105.721 30.8174 105.526 30.8174C105.242 30.8174 104.947 30.9517 104.947 31.2734C104.947 31.5223 105.085 31.6335 105.518 31.7715C105.94 31.9054 106.331 32.0434 106.331 32.5758C106.331 33.116 105.867 33.3688 105.377 33.3688C105.062 33.3688 104.725 33.2653 104.541 32.9934L104.817 32.7672C104.932 32.9667 105.162 33.0702 105.395 33.0702C105.671 33.0702 105.985 32.9092 105.985 32.5985C105.985 32.2655 105.76 32.2077 105.277 32.0474C104.894 31.9208 104.603 31.7521 104.603 31.3004C104.603 30.779 105.051 30.5188 105.526 30.5188C105.828 30.5188 106.085 30.603 106.284 30.8365L106.02 31.0663Z"
                  fill="black"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M107.847 32.1316L106.836 30.5876H107.246L108.008 31.8136L108.793 30.5876H109.18L108.169 32.1316V33.3H107.847V32.1316Z"
                  fill="black"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M111.114 31.0663C111.006 30.8939 110.815 30.8174 110.619 30.8174C110.336 30.8174 110.041 30.9517 110.041 31.2734C110.041 31.5223 110.179 31.6335 110.612 31.7715C111.033 31.9054 111.424 32.0434 111.424 32.5758C111.424 33.116 110.96 33.3688 110.47 33.3688C110.156 33.3688 109.819 33.2653 109.635 32.9934L109.911 32.7672C110.026 32.9667 110.256 33.0702 110.489 33.0702C110.765 33.0702 111.079 32.9092 111.079 32.5985C111.079 32.2655 110.853 32.2077 110.371 32.0474C109.988 31.9208 109.696 31.7521 109.696 31.3004C109.696 30.779 110.144 30.5188 110.619 30.5188C110.922 30.5188 111.179 30.603 111.378 30.8365L111.114 31.0663Z"
                  fill="black"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M114.044 30.8863H113.148V33.3H112.826V30.8863H111.93V30.5876H114.044V30.8863Z"
                  fill="black"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M114.846 30.5876H116.55V30.8863H115.168V31.7368H116.458V32.0357H115.168V33.0011H116.619V33.3H114.846V30.5876Z"
                  fill="black"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M117.615 30.5876H118.094L119.013 32.7138H119.021L119.948 30.5876H120.416V33.3H120.094V31.0243H120.086L119.113 33.3H118.917L117.944 31.0243H117.937V33.3H117.615V30.5876Z"
                  fill="black"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Login;
