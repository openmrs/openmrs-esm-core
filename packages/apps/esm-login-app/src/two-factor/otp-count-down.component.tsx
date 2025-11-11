import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './count-down.scss';
import { useTranslation } from 'react-i18next';

export interface OTPCountdownProps {
  /** Duration of the countdown in seconds */
  duration?: number;
  /** Callback when resend is clicked */
  onResend?: () => void;
  /** Whether to auto-start the countdown on mount */
  autoStart?: boolean;
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
  className,
  prefixText,
  resendText,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(autoStart ? duration : 0);
  const [isActive, setIsActive] = useState<boolean>(autoStart);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { t } = useTranslation();

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
  const handleResend = useCallback(() => {
    startCountdown();
    onResend?.();
  }, [startCountdown, onResend]);

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

  return (
    <div className={`${styles.countdownContainer} ${className || ''}`}>
      {isActive && timeLeft > 0 ? (
        <span className={styles.countdownText}>
          {prefixText || t('resendCodeIn', 'Resend code in')}{' '}
          <span className={styles.time}>{formatTime(timeLeft)}</span>
        </span>
      ) : (
        <button type="button" onClick={handleResend} className={styles.resendButton} aria-label={resendText}>
          {resendText || t('resendCode', 'Resend code')}
        </button>
      )}
    </div>
  );
};

export default OTPCountdown;
