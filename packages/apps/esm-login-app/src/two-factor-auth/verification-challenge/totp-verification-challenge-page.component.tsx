import React, { useCallback, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Checkbox, InlineNotification, Tile } from '@carbon/react';
import classnames from 'classnames';
import {
  useConfig,
  interpolateUrl,
  openmrsFetch,
  refetchCurrentUser,
  navigate as openmrsNavigate,
  ArrowRightIcon,
  OpenmrsFetchError,
  useConnectivity,
  ArrowLeftIcon,
} from '@openmrs/esm-framework';
import type { ConfigSchema } from '../../config-schema';
import Logo from '../../logo.component';
import { performLogout } from '../../redirect-logout/logout.resource';
import VerificationCodeInput from './verification-code-input.component';
import loginStyles from '../../login/login.scss';
import styles from './totp-verification-challenge-page.scss';

const TotpVerificationChallengePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isOnline = useConnectivity();
  const { background = { image: '', color: '' }, links: loginLinks } = useConfig<ConfigSchema>();
  const containerClassName = classnames(loginStyles.container, {
    [loginStyles.containerWithImage]: !!background.image,
    [loginStyles.containerWithColor]: !background.image && !!background.color,
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
  const [code, setCode] = useState('');
  const [rememberDevice, setRememberDevice] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isBackToLogin, setIsBackToLogin] = useState(false);
  const [verificationError, setVerificationError] = useState('');

  const handleVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsVerifying(true);
      setVerificationError('');

      const sessionUrl = rememberDevice ? '/ws/rest/v1/session?rememberMe=true' : '/ws/rest/v1/session';

      const response = await openmrsFetch(sessionUrl, {
        method: 'GET',
        headers: {
          'X-Totp-Code': code,
        },
      });

      if (response.data && response.data.authenticated) {
        const sessionStore = await refetchCurrentUser();
        const session = sessionStore?.session;

        if (session?.sessionLocation) {
          let to = loginLinks?.loginSuccess || '/home';
          const referrer = location?.state?.referrer || sessionStorage.getItem('loginReferrer');

          if (referrer && referrer.startsWith('/')) {
            to = `\${openmrsSpaBase}${referrer}`;
          }
          sessionStorage.removeItem('loginReferrer');
          openmrsNavigate({ to });
        } else {
          navigate('/login/location');
        }
      } else {
        setVerificationError(t('totpVerificationFailed', 'We could not verify that code. Please try again.'));
      }
    } catch (error: unknown) {
      let errorMessage = t('verificationFailedError', 'A network or server error occurred. Please try again.');

      if (error instanceof OpenmrsFetchError) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          errorMessage = t('invalidCode', 'Invalid verification code. Please try again.');
        }
        if (typeof error.responseBody === 'object' && error.responseBody !== null) {
          const body = error.responseBody as { error?: { translatedMessage?: string } };
          const translatedMessage = body.error?.translatedMessage;

          if (translatedMessage) {
            errorMessage = translatedMessage;
          }
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setVerificationError(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  const backToLogin = useCallback(
    async (event: React.MouseEvent) => {
      event.preventDefault();
      setIsBackToLogin(true);
      try {
        await performLogout();
        navigate('/login');
      } catch (error) {
        setVerificationError(
          t('backToLoginFailed', 'Failed to cancel the verification process. Please refresh the page and try again.'),
        );
        setIsBackToLogin(false);
      }
    },
    [navigate, t],
  );

  return (
    <div className={containerClassName} style={containerStyle}>
      {verificationError && (
        <div className={loginStyles.announcements}>
          <InlineNotification
            kind="error"
            title={t('error', 'Error')}
            subtitle={verificationError}
            onClose={() => setVerificationError('')}
          />
        </div>
      )}
      <Tile className={loginStyles.loginCard}>
        <div className={loginStyles.center}>
          <Logo t={t} />
        </div>

        <div className={styles.title}>
          <h5>{t('twoFactorVerification', 'Two-Factor Verification')}</h5>
        </div>
        <form onSubmit={handleVerify}>
          <VerificationCodeInput
            length={6}
            onComplete={(completeCode) => {
              setCode(completeCode);
            }}
          />
          <div className={styles.checkbox}>
            <div className={styles.checkboxInner}>
              <Checkbox
                id="remember-device"
                labelText={t('rememberDevice', 'Remember this device')}
                checked={rememberDevice}
                onChange={(event, { checked }) => setRememberDevice(checked)}
              />
            </div>
          </div>

          <div className={styles.actionButtons}>
            <Button
              type="button"
              className={styles.backToLoginButton}
              kind="ghost"
              onClick={backToLogin}
              disabled={isVerifying || isBackToLogin}
            >
              <ArrowLeftIcon size={10} />
              {t('backToLogin', 'Back to login')}
            </Button>
            <Button
              type="submit"
              className={styles.verifyButton}
              renderIcon={(props) => <ArrowRightIcon size={24} {...props} />}
              disabled={!isOnline || isVerifying || code.length !== 6 || isBackToLogin}
            >
              {isVerifying ? t('verifying', 'Verifying...') : t('verify', 'Verify')}
            </Button>
          </div>
        </form>
      </Tile>
    </div>
  );
};

export default TotpVerificationChallengePage;
