import React, { useState } from 'react';
import styles from './two-factor.scss';
import OtpInput from './otp-input.component';
import OTPCountdown from './otp-count-down.component';
import { useSearchParams } from 'react-router-dom';
import { navigate } from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';
import { useProviderDetails } from './two-factor.resource';

const TwoFactorAuthentication = () => {
  const [otpValue, setOtpValue] = useState('');
  const [error, setError] = useState(false);
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const next = searchParams.get('next');
  const COUNT_DOWN_DURATION = 60;
  const { nationalId, telephone, isLoading, error: providerError, mutate: providerMutate } = useProviderDetails();

  const handleOtpChange = (value: string) => {
    setOtpValue(value);
    setError(false);
  };

  const handleOtpComplete = (value: string) => {
    if (next) {
      navigate({ to: next });
    }
    // console.log('OTP Complete:', value);
    // Here you would typically validate the OTP with your backend
  };

  const handleResend = () => {
    // console.log('Resending OTP code...');
    // Here you would typically call your API to resend the OTP code
    setOtpValue('');
    setError(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <strong>{t('twoFactorAuthentication', 'Two Factor Authentication')}</strong>
        <p>{t('pleaseEnterTheOtpCodeToContinue', 'Please enter the otp code to continue')}</p>
        <OtpInput
          length={6}
          mask={true}
          onChange={handleOtpChange}
          onComplete={handleOtpComplete}
          error={error}
          autoFocus={true}
          placeholder=""
        />
        <OTPCountdown duration={COUNT_DOWN_DURATION} onResend={handleResend} />
      </div>
    </div>
  );
};

export default TwoFactorAuthentication;
