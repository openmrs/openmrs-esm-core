import React, { useRef, useState, useEffect, useCallback, type KeyboardEvent, type ChangeEvent } from 'react';
import styles from './otp-input.scss';

export interface OtpInputProps {
  /** Length of the OTP code */
  length?: number;
  /** Whether to mask the OTP (show dots instead of numbers) */
  mask?: boolean;
  /** Callback when OTP value changes */
  onChange?: (value: string) => void;
  /** Callback when OTP is complete */
  onComplete?: (value: string) => void;
  /** Initial value */
  value?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Whether the input has an error state */
  error?: boolean;
  /** Auto-focus the first input on mount */
  autoFocus?: boolean;
  /** Placeholder text for empty inputs */
  placeholder?: string;
  /** Additional CSS class name */
  className?: string;
}

const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  mask = false,
  onChange,
  onComplete,
  value = '',
  disabled = false,
  error = false,
  autoFocus = true,
  placeholder = '0',
  className,
}) => {
  const [otp, setOtp] = useState<string[]>(() => {
    const initialOtp = value.split('').slice(0, length);
    return Array(length)
      .fill('')
      .map((_, index) => initialOtp[index] || '');
  });
  const [focusedIndex, setFocusedIndex] = useState<number | null>(autoFocus ? 0 : null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Update internal state when value prop changes
  useEffect(() => {
    if (value !== otp.join('')) {
      const newOtp = value.split('').slice(0, length);
      setOtp(
        Array(length)
          .fill('')
          .map((_, index) => newOtp[index] || ''),
      );
    }
  }, [value, length]);

  // Focus the first input on mount if autoFocus is true
  useEffect(() => {
    if (autoFocus && inputRefs.current[0] && !disabled) {
      inputRefs.current[0]?.focus();
    }
  }, [autoFocus, disabled]);

  // Focus the input at the specified index
  const focusInput = useCallback(
    (index: number) => {
      if (index >= 0 && index < length && inputRefs.current[index] && !disabled) {
        inputRefs.current[index]?.focus();
        setFocusedIndex(index);
      }
    },
    [length, disabled],
  );

  // Handle input change
  const handleChange = useCallback(
    (index: number, newValue: string) => {
      // Only allow single digit
      if (newValue.length > 1) {
        return;
      }

      // Only allow digits
      if (newValue && !/^\d$/.test(newValue)) {
        return;
      }

      const newOtp = [...otp];
      newOtp[index] = newValue;
      setOtp(newOtp);

      const otpValue = newOtp.join('');
      onChange?.(otpValue);

      // Move to next input if value entered, or previous if deleted
      if (newValue && index < length - 1) {
        focusInput(index + 1);
      } else if (!newValue && index > 0) {
        focusInput(index - 1);
      }

      // Check if OTP is complete
      if (otpValue.length === length && otpValue.split('').every((digit) => digit !== '')) {
        onComplete?.(otpValue);
      }
    },
    [otp, length, onChange, onComplete, focusInput],
  );

  // Handle key down events
  const handleKeyDown = useCallback(
    (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace') {
        e.preventDefault();
        if (otp[index]) {
          handleChange(index, '');
        } else if (index > 0) {
          focusInput(index - 1);
          handleChange(index - 1, '');
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        focusInput(index - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        focusInput(index + 1);
      } else if (e.key === 'Delete') {
        e.preventDefault();
        handleChange(index, '');
      }
    },
    [otp, handleChange, focusInput],
  );

  // Handle paste
  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData('text/plain').trim();
      const digits = pastedData
        .split('')
        .filter((char) => /^\d$/.test(char))
        .slice(0, length);

      if (digits.length > 0) {
        const newOtp = [...otp];
        digits.forEach((digit, index) => {
          if (index < length) {
            newOtp[index] = digit;
          }
        });
        setOtp(newOtp);

        const otpValue = newOtp.join('');
        onChange?.(otpValue);

        // Focus the next empty input or the last input
        const nextEmptyIndex = newOtp.findIndex((digit) => !digit);
        if (nextEmptyIndex !== -1) {
          focusInput(nextEmptyIndex);
        } else {
          focusInput(length - 1);
          onComplete?.(otpValue);
        }
      }
    },
    [otp, length, onChange, onComplete, focusInput],
  );

  // Handle focus
  const handleFocus = useCallback((index: number) => {
    setFocusedIndex(index);
    inputRefs.current[index]?.select();
  }, []);

  // Handle blur
  const handleBlur = useCallback(() => {
    setFocusedIndex(null);
  }, []);

  return (
    <div className={`${styles.otpContainer} ${className || ''}`}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type={mask ? 'password' : 'text'}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={otp[index] || ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value)}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => handleFocus(index)}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          className={`${styles.otpInput} ${error ? styles.error : ''} ${focusedIndex === index ? styles.focused : ''} ${
            otp[index] ? styles.filled : ''
          }`}
          aria-label={`OTP digit ${index + 1} of ${length}`}
        />
      ))}
    </div>
  );
};

export default OtpInput;
