import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, InlineLoading, PasswordInput, Tile } from '@carbon/react';
import { ArrowRightIcon } from '@openmrs/esm-framework';
import Logo from '../logo.component';
import Footer from '../footer.component';
import styles from '../login/login.scss';

const ResetConfirm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rules = [
    { label: t('atLeast8Chars', 'At least 8 characters'), valid: newPassword.length >= 8 },
    { label: t('oneUppercase', 'One uppercase letter'), valid: /[A-Z]/.test(newPassword) },
    { label: t('oneNumber', 'One number'), valid: /[0-9]/.test(newPassword) },
    { label: t('oneSymbol', 'One symbol (e.g. !@#$)'), valid: /[^A-Za-z0-9]/.test(newPassword) },
  ];

  const passedRules = rules.filter((r) => r.valid).length;
  const isValid = passedRules >= 3 && newPassword === confirmPassword;

  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (!isValid) return;
    setIsSubmitting(true);
    // TODO: call password reset confirmation endpoint with token from URL
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/login/reset/complete');
    }, 1000);
  };

  return (
    <div className={styles.container}>
      <Tile className={styles.loginCard}>
        <div className={styles.center}>
          <Logo t={t} />
        </div>

        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          {t('setNewPassword', 'Set a new password')}
        </h1>
        <p style={{ marginBottom: '1.5rem', color: '#525252' }}>
          {t(
            'setNewPasswordInstructions',
            'Your new password must be at least 8 characters and include letters, numbers, and a symbol.',
          )}
        </p>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <PasswordInput
              id="new-password"
              labelText={t('newPassword', 'New password')}
              value={newPassword}
              onChange={(evt) => setNewPassword(evt.target.value)}
              required
              autoFocus
            />

            <ul style={{ listStyle: 'none', padding: 0, margin: '0.5rem 0 1rem' }}>
              {rules.map((rule) => (
                <li
                  key={rule.label}
                  style={{
                    color: rule.valid ? '#24a148' : '#525252',
                    fontSize: '0.875rem',
                    marginBottom: '0.25rem',
                  }}
                >
                  {rule.valid ? '✓' : '○'} {rule.label}
                </li>
              ))}
            </ul>

            <PasswordInput
              id="confirm-password"
              labelText={t('confirmPassword', 'Confirm password')}
              value={confirmPassword}
              onChange={(evt) => setConfirmPassword(evt.target.value)}
              required
            />

            <Button
              type="submit"
              className={styles.continueButton}
              renderIcon={(props) => <ArrowRightIcon size={24} {...props} />}
              iconDescription={t('resetPassword', 'Reset password')}
              disabled={!isValid || isSubmitting}
              style={{ marginTop: '1rem' }}
            >
              {isSubmitting ? (
                <InlineLoading description={t('submitting', 'Submitting') + '...'} />
              ) : (
                t('resetPassword', 'Reset password')
              )}
            </Button>
          </div>
        </form>
      </Tile>
      <Footer />
    </div>
  );
};

export default ResetConfirm;