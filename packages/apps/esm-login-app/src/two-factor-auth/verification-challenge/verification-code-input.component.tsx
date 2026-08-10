import React, { useEffect, useRef, useState } from 'react';
import { TextInput } from '@carbon/react';
import styles from './verification-code-input.scss';
import { useTranslation } from 'react-i18next';

interface VerificationCodeInputProps {
  length: number;
  onComplete: (code: string) => void;
}

const VerificationCodeInput: React.FC<VerificationCodeInputProps> = ({ length = 6, onComplete }) => {
  const { t } = useTranslation();
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus the first input box on mount
    setTimeout(() => {
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }, 100);
  }, []);

  // Handle the code input typing
  const handleCodeInputChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    // Only allow numeric input
    const value = event.target.value;
    if (isNaN(Number(value))) return;

    // Take only the last character
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // If the user filled the last box, trigger onComplete prop
    const combinedOtp = newOtp.join('');
    if (combinedOtp.length === length) {
      onComplete(combinedOtp);
    }

    // Move focus to the next input box if the current one is filled
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace to move focus to the previous input box
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === 'Backspace') {
      if (!otp[index] && index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  // Handle copy and paste to allow pasting the entire code
  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    const pastedData = event.clipboardData.getData('text').slice(0, length);

    // Only numbers are allowed to paste
    if (!/^\d+$/.test(pastedData)) return;

    // Spread the pasted code across the input boxes
    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      newOtp[index] = char;
      if (inputRefs.current[index]) {
        inputRefs.current[index]!.value = char;
      }
    });
    setOtp(newOtp);

    // Trigger onComplete prop
    if (pastedData.length === length) {
      onComplete(pastedData);
      inputRefs.current[length - 1]?.focus();
    } else {
      inputRefs.current[pastedData.length]?.focus();
    }
  };

  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>{t('enterCode', 'Enter the code from your authenticator app')}</label>
      <div className={styles.otpContainer} onPaste={handlePaste}>
        {otp.map((data, index) => (
          <TextInput
            className={styles.otpInput}
            key={index}
            id={`otp-input-${index}`}
            type="text"
            maxLength={1}
            value={data}
            labelText={`Digit ${index + 1}`}
            hideLabel
            ref={(el: HTMLInputElement | null) => (inputRefs.current[index] = el)}
            onChange={(event) => handleCodeInputChange(event, index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          />
        ))}
      </div>
    </div>
  );
};

export default VerificationCodeInput;
