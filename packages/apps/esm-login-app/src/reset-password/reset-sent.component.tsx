import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Tile } from '@carbon/react';
import Logo from '../logo.component';
import Footer from '../footer.component';
import loginStyles from '../login/login.scss';
import styles from './reset-password.scss';

const ResetSent: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const usernameOrEmail = location.state?.usernameOrEmail ?? '';

  const maskedAddress = usernameOrEmail.includes('@')
    ? (() => {
        const atIndex = usernameOrEmail.indexOf('@');
        const local = usernameOrEmail.slice(0, atIndex);
        const domain = usernameOrEmail.slice(atIndex);
        return local.slice(0, 2) + '***' + domain;
      })()
    : usernameOrEmail;

  return (
    <div className={loginStyles.container}>
      <Tile className={loginStyles.loginCard}>
        <div className={loginStyles.center}>
          <Logo t={t} />
        </div>

        <h1 className={styles.heading}>
          {t('checkYourEmail', 'Check your email')}
        </h1>
        <p className={styles.subheadingSmall}>
          {t(
            'resetEmailSentMessage',
            "If an account matches the details you entered, we've sent a password reset link to the email on file. The link expires in 30 minutes.",
          )}
        </p>

        {maskedAddress && (
          <p className={styles.sentTo}>
            {t('sentTo', 'SENT TO')} {maskedAddress}
          </p>
        )}

        <Button
          kind="ghost"
          className={styles.ghostButton}
          onClick={() => navigate('/login/reset')}
        >
          {t('resendEmail', 'Resend email')}
        </Button>

        <Button
          kind="ghost"
          className={styles.ghostButtonNoPadding}
          onClick={() => navigate('/login')}
        >
          {t('backToLogin', 'Back to log in')}
        </Button>
      </Tile>
      <Footer />
    </div>
  );
};

export default ResetSent;