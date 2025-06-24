import React, { useState } from 'react';
import { TextInput, Button, InlineLoading, InlineNotification, Tile } from '@carbon/react';
import { openmrsFetch, sessionEndpoint, ArrowRightIcon, getCoreTranslation } from '@openmrs/esm-framework';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from '../logo.component';
import Footer from '../footer.component';
import styles from './login.scss';

const LoginWithTotp: React.FC = () => {
  const [totp, setTotp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const searchParams = new URLSearchParams();
      searchParams.append('code', totp);
      searchParams.append('redirect', 'spa/home');
      const url = `${sessionEndpoint}?${searchParams.toString()}`;

      const response = await openmrsFetch(url);
      const session = response.data;
      const authenticated = session?.authenticated;
      if (authenticated) {
        if (session.sessionLocation) {
          setTimeout(() => navigate('/openmrs/spa/home'), 0);
        } else {
          setTimeout(() => navigate('/login/location'), 0);
        }
      } else {
        setError('Invalid MFA code');
        setTotp('');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to verify MFA code');
      setTotp('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <Tile className={styles.loginCard}>
        {error && (
          <div className={styles.errorMessage}>
            <InlineNotification
              kind="error"
              subtitle={t(error)}
              title={getCoreTranslation('error')}
              onClick={() => setError(null)}
            />
          </div>
        )}
        <div className={styles.center}>
          <Logo t={t} />
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <TextInput
              id="totp"
              labelText={t('mfaCode', 'MFA Code')}
              value={totp}
              onChange={(e) => setTotp(e.target.value)}
              required
              maxLength={6}
              autoFocus
            />
            <Button
              type="submit"
              className={styles.continueButton}
              renderIcon={(props) => <ArrowRightIcon size={24} {...props} />}
              iconDescription={t('loginButtonIconDescription', 'Log in button')}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <InlineLoading className={styles.loader} description={t('loggingIn', 'Logging in') + '...'} />
              ) : (
                t('login', 'Verify')
              )}
            </Button>
          </div>
        </form>
      </Tile>
      <Footer />
    </div>
  );
};

export default LoginWithTotp;
