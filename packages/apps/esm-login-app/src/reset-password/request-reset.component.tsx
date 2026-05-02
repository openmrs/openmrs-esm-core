import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, InlineLoading, TextInput, Tile } from '@carbon/react';
import { ArrowRightIcon } from '@openmrs/esm-framework';
import Logo from '../logo.component';
import Footer from '../footer.component';
import { requestPasswordReset } from './reset-password.resource';
import loginStyles from '../login/login.scss';
import styles from './reset-password.scss';

const RequestReset: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (evt: React.FormEvent<HTMLFormElement>) => {
      evt.preventDefault();
      if (!usernameOrEmail.trim()) return;

      setIsSubmitting(true);
      await requestPasswordReset(usernameOrEmail.trim());
      setIsSubmitting(false);
      navigate('/login/reset/sent', { state: { usernameOrEmail: usernameOrEmail.trim() } });
    },
    [usernameOrEmail, navigate],
  );

  return (
    <div className={loginStyles.container}>
      <Tile className={`${loginStyles.loginCard} ${styles.tileWithPadding}`}>
        <Button
          kind="ghost"
          size="sm"
          onClick={() => navigate('/login')}
          className={styles.backLink}
        >
          {t('backToLogin', 'Back to log in')}
        </Button>

        <div className={loginStyles.center}>
          <Logo t={t} />
        </div>

        <h1 className={styles.heading}>
          {t('resetYourPassword', 'Reset your password')}
        </h1>
        <p className={styles.subheading}>
          {t(
            'resetPasswordInstructions',
            "Enter your account details below. We'll email password reset instructions to the address on file.",
          )}
        </p>

        <form onSubmit={handleSubmit}>
          <div className={loginStyles.inputGroup}>
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
              className={loginStyles.continueButton}
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

        <p className={styles.helpText}>
          {t('needHelp', 'Need help?')}{' '}
          {t('contactSiteAdministrator', 'Contact the site administrator')}
        </p>
      </Tile>
      <Footer />
    </div>
  );
};

export default RequestReset;