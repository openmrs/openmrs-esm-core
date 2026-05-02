import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, InlineLoading, InlineNotification, TextInput, Tile } from '@carbon/react';
import { ArrowRightIcon } from '@openmrs/esm-framework';
import Logo from '../logo.component';
import Footer from '../footer.component';
import { requestPasswordReset } from './reset-password.resource';
import styles from '../login/login.scss';

const RequestReset: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = useCallback(
    async (evt: React.FormEvent<HTMLFormElement>) => {
      evt.preventDefault();
      if (!usernameOrEmail.trim()) return;

      setIsSubmitting(true);
      setErrorMessage('');

      const result = await requestPasswordReset(usernameOrEmail.trim());

      setIsSubmitting(false);

      if (result.status === 'not_found') {
        setErrorMessage(t('accountNotFound', "We couldn't find an account matching the details you entered."));
        return;
      }

      if (result.status === 'no_email') {
        setErrorMessage(t('noEmailOnFile', 'Contact your site administrator to reset your password.'));
        return;
      }

      navigate('/login/reset/sent', { state: { usernameOrEmail: usernameOrEmail.trim() } });
    },
    [usernameOrEmail, navigate, t],
  );

  return (
    <div className={styles.container}>
      <Tile className={styles.loginCard} style={{ paddingBottom: '2rem' }}>
        <Button
          kind="ghost"
          size="sm"
          onClick={() => navigate('/login')}
          style={{ marginBottom: '1rem', paddingLeft: 0 }}
        >
          {t('backToLogin', 'Back to log in')}
        </Button>

        <div className={styles.center}>
          <Logo t={t} />
        </div>

        {errorMessage && (
          <div className={styles.errorMessage}>
            <InlineNotification
              kind="error"
              subtitle={errorMessage}
              title={t('error', 'Error')}
              onClose={() => setErrorMessage('')}
            />
          </div>
        )}

        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          {t('resetYourPassword', 'Reset your password')}
        </h1>
        <p style={{ marginBottom: '1.5rem', color: '#525252' }}>
          {t(
            'resetPasswordInstructions',
            "Enter your account details below. We'll email password reset instructions to the address on file.",
          )}
        </p>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <TextInput
              id="reset-username-or-email"
              type="text"
              name="usernameOrEmail"
              labelText={t('usernameOrEmail', 'Username or email')}
              helperText={t(
                'usernameOrEmailHelper',
                'Enter the username or email associated with your OpenMRS account.',
              )}
              value={usernameOrEmail}
              onChange={(evt) => setUsernameOrEmail(evt.target.value)}
              required
              autoFocus
            />
            <Button
              type="submit"
              className={styles.continueButton}
              renderIcon={(props) => <ArrowRightIcon size={24} {...props} />}
              iconDescription={t('continue', 'Continue')}
              disabled={isSubmitting || !usernameOrEmail.trim()}
            >
              {isSubmitting ? (
                <InlineLoading description={t('submitting', 'Submitting') + '...'} />
              ) : (
                t('continue', 'Continue')
              )}
            </Button>
          </div>
        </form>

        <p style={{ marginTop: '1.5rem', marginBottom: '2rem', fontSize: '0.875rem', color: '#525252' }}>
            {t('needHelp', 'Need help?')}{' '}
            {t('contactSiteAdministrator', 'Contact the site administrator')}
        </p>
      </Tile>
      <Footer />
    </div>
  );
};

export default RequestReset;