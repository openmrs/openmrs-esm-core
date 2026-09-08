import { Button } from '@carbon/react';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './count-down.scss';
import { useTranslation } from 'react-i18next';

export interface OTPCountdownProps {
  /** Duration of the countdown in seconds */
  duration?: number;
  /** Callback when resend is clicked */
  onResend?: () => Promise<void>;
  /** Whether to auto-start the countdown on mount */
  autoStart?: boolean;
  /** Whether to request the first OTP automatically on mount */
  autoRequest?: boolean;
  /** Additional CSS class name */
  className?: string;
  /** Text to display before the countdown */
  prefixText?: string;
  /** Text for the resend link */
  resendText?: string;
}

const OTPCountdown: React.FC<OTPCountdownProps> = ({
  duration = 60,
  onResend,
  autoStart = true,
  autoRequest = false,
  className,
  prefixText,
  resendText,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(autoStart ? duration : 0);
  const [isActive, setIsActive] = useState<boolean>(autoStart);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { t } = useTranslation();
  const [requested, setRequested] = useState<boolean>(false);

  // Format time as MM:SS
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Start the countdown
  const startCountdown = useCallback(() => {
    setTimeLeft(duration);
    setIsActive(true);
  }, [duration]);

  // Handle resend click
  const handleResend = useCallback(async () => {
    await onResend?.();
    setRequested(true);
    if (autoStart) {
      startCountdown();
    }
  }, [autoStart, startCountdown, onResend]);

  useEffect(() => {
    if (autoRequest) {
      void handleResend();
    }
  }, [autoRequest, handleResend]);

  // Countdown effect
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  if (!requested) {
    return (
      <Button type="button" kind="secondary" size="md" onClick={handleResend} aria-label={resendText}>
        {resendText || t('sendOTPCode', 'Send OTP Code')}
      </Button>
    );
  }

  return (
    <div className={`${styles.countdownContainer} ${className || ''}`}>
      {isActive && timeLeft > 0 ? (
        <span className={styles.countdownText}>
          {prefixText || t('resendCodeIn', 'Resend code in')}{' '}
          <span className={styles.time}>{formatTime(timeLeft)}</span>
        </span>
      ) : (
        <Button type="button" kind="secondary" size="md" onClick={handleResend} aria-label={resendText}>
          {resendText || t('resendCode', 'Resend code')}
        </Button>
      )}
    </div>
  );
};

export default OTPCountdown;
