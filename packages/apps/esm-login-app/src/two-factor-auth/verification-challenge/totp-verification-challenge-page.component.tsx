import React, { useMemo, useState } from 'react';
import classnames from 'classnames';
import { useTranslation } from 'react-i18next';
import {
  useConfig,
  interpolateUrl,
  openmrsFetch,
  refetchCurrentUser,
  navigate as openmrsNavigate,
  ArrowRightIcon,
} from '@openmrs/esm-framework';
import type { ConfigSchema } from '../../config-schema';
import loginStyles from '../../login/login.scss';
import { Button, Checkbox, Tile } from '@carbon/react';
import Logo from '../../logo.component';
import VerificationCodeInput from './verification-code-input.component';
import styles from './totp-verification-challenge-page.scss';

const TotpVerificationChallengePage: React.FC = () => {
  const { t } = useTranslation();
  const { background = { image: '', color: '' } } = useConfig<ConfigSchema>();
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
  const [rememberDevice, setRememberDevice] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsVerifying(true);

      const sessionUrl = rememberDevice ? '/ws/rest/v1/session?rememberMe=true' : '/ws/rest/v1/session';

      const response = await openmrsFetch(sessionUrl, {
        method: 'GET',
        headers: {
          'X-Totp-Code': code,
        },
      });

      if (response.data && response.data.authenticated) {
        await refetchCurrentUser();
        openmrsNavigate({ to: '/login/location' });
      }
    } catch {
      console.error('Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className={containerClassName} style={containerStyle}>
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
                labelText={t('rememberDevice', 'Remember this device for 30 days')}
                checked={rememberDevice}
                onChange={(event, { checked }) => setRememberDevice(checked)}
              />
            </div>
          </div>

          <Button
            type="submit"
            className={styles.verifyButton}
            renderIcon={(props) => <ArrowRightIcon size={24} {...props} />}
          >
            {isVerifying ? t('verifying', 'Verifying...') : t('verify', 'Verify')}
          </Button>
        </form>
      </Tile>
    </div>
  );
};

export default TotpVerificationChallengePage;
