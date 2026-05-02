import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Tile } from '@carbon/react';
import Logo from '../logo.component';
import Footer from '../footer.component';
import styles from '../login/login.scss';

const ResetSent: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const usernameOrEmail = location.state?.usernameOrEmail ?? '';

  // Mask email if it looks like an email address
  const maskedAddress = usernameOrEmail.includes('@')
    ? (() => {
        const atIndex = usernameOrEmail.indexOf('@');
        const local = usernameOrEmail.slice(0, atIndex);
        const domain = usernameOrEmail.slice(atIndex);
        return local.slice(0, 2) + '***' + domain;
        })()
    : usernameOrEmail;

  return (
    <div className={styles.container}>
      <Tile className={styles.loginCard}>
        <div className={styles.center}>
          <Logo t={t} />
        </div>

        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          {t('checkYourEmail', 'Check your email')}
        </h1>
        <p style={{ marginBottom: '1rem', color: '#525252' }}>
          {t(
            'resetEmailSentMessage',
            "If an account matches the details you entered, we've sent a password reset link to the email on file. The link expires in 30 minutes.",
          )}
        </p>

        {maskedAddress && (
          <p
            style={{
              fontWeight: 600,
              marginBottom: '1.5rem',
              textTransform: 'uppercase',
              fontSize: '0.875rem',
            }}
          >
            {t('sentTo', 'SENT TO')} {maskedAddress}
          </p>
        )}

        <Button
          kind="ghost"
          style={{ marginBottom: '0.5rem', paddingLeft: 0 }}
          onClick={() => navigate('/login/reset')}
        >
          {t('resendEmail', 'Resend email')}
        </Button>

        <Button kind="ghost" style={{ paddingLeft: 0 }} onClick={() => navigate('/login')}>
          {t('backToLogin', 'Back to log in')}
        </Button>
      </Tile>
      <Footer />
    </div>
  );
};

export default ResetSent;