import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Tile } from '@carbon/react';
import { ArrowRightIcon } from '@openmrs/esm-framework';
import Logo from '../logo.component';
import Footer from '../footer.component';
import loginStyles from '../login/login.scss';
import styles from './reset-password.scss';

const ResetComplete: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className={loginStyles.container}>
      <Tile className={loginStyles.loginCard}>
        <div className={loginStyles.center}>
          <Logo t={t} />
        </div>

        <h1 className={styles.heading}>
          {t('passwordReset', 'Password reset')}
        </h1>
        <p className={styles.subheading}>
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