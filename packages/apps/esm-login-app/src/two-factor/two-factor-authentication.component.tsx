import { Button, InlineLoading, ModalBody, ModalHeader } from '@carbon/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  patientName: string;
  telephone: string;
  nationalId: string;
  headers: Record<string, string>;
};
const TwoFactorAuthentication: React.FC<TwoFactorAuthenticationProps> = ({
  onSuccess,
  onClose,
  patientName,
  telephone,
  nationalId,
  headers,
}) => {
  const [otpValue, setOtpValue] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState(false);
  const { t } = useTranslation();
  const COUNT_DOWN_DURATION = 60;
  const otpExpiryMinutes = 5;

  const { onRequestOtp, onVerify } = useMemo(
    () => ({
      onRequestOtp: async (phone: string): Promise<void> => {
        const sanitizedPhone = sanitizePhoneNumber(phone);
        await otpManager.requestOTP(sanitizedPhone, patientName, otpExpiryMinutes, nationalId, headers);
      },
      onVerify: async (otp: string): Promise<void> => {
        const sanitizedPhone = sanitizePhoneNumber(telephone);
        const isValid = await otpManager.verifyOTP(sanitizedPhone, otp);
        if (!isValid) {
          throw new Error('OTP verification failed');
        }
      },
    }),
    [patientName, telephone, nationalId, headers],
  );

  useEffect(() => {
    return () => otpManager.cleanupExpiredOTPs();
  }, []);

  const handleOtpChange = (value: string) => {
    setOtpValue(value);
    setError(false);
  };

  const handleOtpComplete = async (value: string) => {
    setIsVerifying(true);
    try {
      await onVerify(value);
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

  const handleResend = useCallback(async () => {
    setOtpValue('');
    setError(false);
    await onRequestOtp(telephone);
  }, [onRequestOtp, telephone]);

  return (
    <>
      <ModalHeader title={t('twoFactorAuthentication', 'Two Factor Authentication')} closeModal={onClose} />
      <ModalBody className={styles.container}>
        <p>{t('pleaseEnterTheOtpCodeToContinue', 'Please enter the otp code to continue')}</p>
        {isVerifying && <InlineLoading description={t('verifying', 'Verifying') + '...'} />}
        <OtpInput
          length={5}
          mask={true}
          onChange={handleOtpChange}
          error={error}
          autoFocus={true}
          placeholder=""
          disabled={isVerifying}
        />
        <div className={styles.actions}>
          <Button
            kind="primary"
            disabled={isVerifying || otpValue.length !== 5}
            onClick={() => handleOtpComplete(otpValue)}
          >
            {t('validateOtp', 'Validate OTP')}
          </Button>
          <OTPCountdown duration={COUNT_DOWN_DURATION} onResend={handleResend} autoRequest />
        </div>
      </ModalBody>
    </>
  );
};

export default TwoFactorAuthentication;
