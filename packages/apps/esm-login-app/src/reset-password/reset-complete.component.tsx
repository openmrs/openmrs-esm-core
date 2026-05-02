import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Tile } from '@carbon/react';
import { ArrowRightIcon } from '@openmrs/esm-framework';
import Logo from '../logo.component';
import Footer from '../footer.component';
import styles from '../login/login.scss';

const ResetComplete: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <Tile className={styles.loginCard}>
        <div className={styles.center}>
          <Logo t={t} />
        </div>

        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          {t('passwordReset', 'Password reset')}
        </h1>
        <p style={{ marginBottom: '1.5rem', color: '#525252' }}>
          {t(
            'passwordResetSuccess',
            'Your password has been updated. You can now log in with your new credentials.',
          )}
        </p>

        <Button
          renderIcon={(props) => <ArrowRightIcon size={24} {...props} />}
          iconDescription={t('continueToLogin', 'Continue to log in')}
          onClick={() => navigate('/login')}
        >
          {t('continueToLogin', 'Continue to log in')}
        </Button>
      </Tile>
      <Footer />
    </div>
  );
};

export default ResetComplete;