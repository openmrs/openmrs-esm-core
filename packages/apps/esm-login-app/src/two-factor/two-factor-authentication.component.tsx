import { InlineLoading, ModalBody, ModalHeader } from '@carbon/react';
import { navigate, showSnackbar } from '@openmrs/esm-framework';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import OTPCountdown from './otp-count-down.component';
import OtpInput from './otp-input.component';
import { otpManager } from './otp.resource';
import { sanitizePhoneNumber, useProviderDetails } from './two-factor.resource';
import styles from './two-factor.scss';

type TwoFactorAuthenticationProps = {
  redirectTo: string;
  onClose: () => void;
};
const TwoFactorAuthentication: React.FC<TwoFactorAuthenticationProps> = ({ redirectTo, onClose }) => {
  const [otpValue, setOtpValue] = useState('');
  const [error, setError] = useState(false);
  const { t } = useTranslation();
  const COUNT_DOWN_DURATION = 60;
  const otpExpiryMinutes = 5;
  const { nationalId, telephone, isLoading, error: providerError, mutate: providerMutate, name } = useProviderDetails();
  useEffect(() => {
    if (providerError)
      showSnackbar({
        title: t('errorGettingProviderDetails', 'Error getting provider details'),
        subtitle: providerError?.message,
        kind: 'error',
      });
  }, [providerError]);

  const createDynamicOTPHandlers = (patientName: string, phoneNumber: string, nationalId: string) => {
    return {
      onRequestOtp: async (phone: string): Promise<void> => {
        const sanitizedPhone = sanitizePhoneNumber(phone);
        await otpManager.requestOTP(sanitizedPhone, patientName, otpExpiryMinutes, nationalId);
      },
      onVerify: async (otp: string, _phoneNumber?: string): Promise<void> => {
        const sanitizedPhone = sanitizePhoneNumber(phoneNumber);
        const isValid = await otpManager.verifyOTP(sanitizedPhone, otp);
        if (!isValid) {
          throw new Error('OTP verification failed');
        }
      },
      cleanup: (): void => {
        otpManager.cleanupExpiredOTPs();
      },
    };
  };

  if (isLoading) {
    return <InlineLoading description={t('loading', 'Loading') + '...'} />;
  }

  const { onRequestOtp, onVerify, cleanup } = createDynamicOTPHandlers(name, telephone, nationalId); // TODO: rePLACE NUMBER WITH TELEPHON VARIABLE

  const handleOtpChange = (value: string) => {
    setOtpValue(value);
    setError(false);
  };

  const handleOtpComplete = async (value: string) => {
    try {
      await onVerify(value, telephone);
      navigate({ to: redirectTo });
      onClose?.();
    } catch (error) {
      setError(true);
    }
  };

  const handleResend = () => {
    // console.log('Resending OTP code...');
    // Here you would typically call your API to resend the OTP code
    setOtpValue('');
    setError(false);
    onRequestOtp(telephone);
  };

  return (
    <>
      <ModalHeader title={t('twoFactorAuthentication', 'Two Factor Authentication')} closeModal={onClose} />
      <ModalBody className={styles.container}>
        {/* <strong>{t('twoFactorAuthentication', 'Two Factor Authentication')}</strong> */}
        <p>{t('pleaseEnterTheOtpCodeToContinue', 'Please enter the otp code to continue')}</p>
        <OtpInput
          length={5}
          mask={true}
          onChange={handleOtpChange}
          onComplete={handleOtpComplete}
          error={error}
          autoFocus={true}
          placeholder=""
        />
        <OTPCountdown duration={COUNT_DOWN_DURATION} onResend={handleResend} />
      </ModalBody>
    </>
  );
};

export default TwoFactorAuthentication;
