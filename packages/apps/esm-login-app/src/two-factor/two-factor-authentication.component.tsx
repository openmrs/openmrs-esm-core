import { InlineLoading, ModalBody, ModalHeader } from '@carbon/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import OTPCountdown from './otp-count-down.component';
import OtpInput from './otp-input.component';
import { otpManager } from './otp.resource';
import { sanitizePhoneNumber } from './two-factor.resource';
import styles from './two-factor.scss';
import { showSnackbar } from '@openmrs/esm-framework';

type TwoFactorAuthenticationProps = {
  onSuccess?: () => Promise<void>;
  onClose: () => void;
  name: string;
  telephone: string;
  nationalId: string;
  headers: Record<string, string>;
};
const TwoFactorAuthentication: React.FC<TwoFactorAuthenticationProps> = ({
  onSuccess,
  onClose,
  name,
  telephone,
  nationalId,
  headers,
}) => {
  const [otpValue, setOtpValue] = useState('');
  const [otpInputDisabled, setOtpInputDisabled] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState(false);
  const { t } = useTranslation();
  const COUNT_DOWN_DURATION = 60;
  const otpExpiryMinutes = 5;

  const createDynamicOTPHandlers = (patientName: string, phoneNumber: string, nationalId: string) => {
    return {
      onRequestOtp: async (phone: string): Promise<void> => {
        const sanitizedPhone = sanitizePhoneNumber(phone);
        await otpManager.requestOTP(sanitizedPhone, patientName, otpExpiryMinutes, nationalId, headers);
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

  const { onRequestOtp, onVerify, cleanup } = createDynamicOTPHandlers(name, telephone, nationalId); // TODO: rePLACE NUMBER WITH TELEPHON VARIABLE

  const handleOtpChange = (value: string) => {
    setOtpValue(value);
    setError(false);
  };

  const handleOtpComplete = async (value: string) => {
    setIsVerifying(true);
    try {
      await onVerify(value, telephone);
      showSnackbar({
        title: t('otpVerified', 'OTP verified'),
        subtitle: t('otpVerifiedMessage', 'OTP verified successfully'),
        kind: 'success',
      });
      await onSuccess?.();
      onClose?.();
    } catch (error) {
      setError(true);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    // console.log('Resending OTP code...');
    // Here you would typically call your API to resend the OTP code
    setOtpValue('');
    setError(false);
    await onRequestOtp(telephone);
    setOtpInputDisabled(false);
  };

  return (
    <>
      <ModalHeader title={t('twoFactorAuthentication', 'Two Factor Authentication')} closeModal={onClose} />
      <ModalBody className={styles.container}>
        <p>{t('pleaseEnterTheOtpCodeToContinue', 'Please enter the otp code to continue')}</p>
        {isVerifying ? (
          <InlineLoading description={t('verifying', 'Verifying') + '...'} />
        ) : (
          <>
            <OtpInput
              length={5}
              mask={true}
              onChange={handleOtpChange}
              onComplete={handleOtpComplete}
              error={error}
              autoFocus={true}
              placeholder=""
              disabled={otpInputDisabled}
            />
            <OTPCountdown duration={COUNT_DOWN_DURATION} onResend={handleResend} />
          </>
        )}
      </ModalBody>
    </>
  );
};

export default TwoFactorAuthentication;
