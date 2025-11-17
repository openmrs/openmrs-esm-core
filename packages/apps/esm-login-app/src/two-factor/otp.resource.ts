import { type FetchResponse, openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import useSWR from 'swr';

export interface OtpContext extends Record<string, string | number> {
  otp: string;
  patient_name: string;
  expiry_time: number;
}

export interface OtpPayload {
  otp: string;
  receiver: string;
}

export interface OtpResponse {
  success: boolean;
  message: string;
}

export interface OTPSource {
  otpSource?: string;
}

/**
 * Generates a random OTP of a specified length.
 */
export function generateOTP(length = 5) {
  let otpNumbers = '0123456789';
  let OTP = '';
  const len = otpNumbers.length;
  for (let i = 0; i < length; i++) {
    OTP += otpNumbers[Math.floor(Math.random() * len)];
  }
  return OTP;
}

/**
 * Replaces placeholders in a template string with values from a given context.
 */
export function parseMessage<T extends Record<string, string | number>>(context: T, template: string): string {
  if (!template?.trim()) {
    throw new Error('Template must be a non-empty string');
  }

  const placeholderRegex = /\{\{([^{}]+)\}\}/g;

  return template.replace(placeholderRegex, (match, key: string) => {
    const trimmedKey = key.trim();
    return trimmedKey in context ? String(context[trimmedKey]) : match;
  });
}

/**
 * Builds a URL for sending an SMS message.
 */
function buildSmsUrl(message: string, receiver: string, nationalId: string | null = null): string {
  const encodedMessage = encodeURIComponent(message);
  let url = `${restBaseUrl}/kenyaemr/send-kenyaemr-sms?message=${encodedMessage}&phone=${receiver}`;

  if (nationalId?.trim()) {
    url += `&nationalId=${encodeURIComponent(nationalId)}`;
  }
  return url;
}

/**
 * Validates required parameters.
 */
function validateOtpInputs(receiver: string, patientName: string): void {
  if (!receiver?.trim() || !patientName?.trim()) {
    throw new Error('Missing required parameters: receiver or patientName');
  }
}

/**
 * Hook to get OTP source configuration
 */
export const useOtpSource = () => {
  const url = `${restBaseUrl}/kenyaemr/checkotpsource`;

  const { data, error, isLoading } = useSWR<FetchResponse<OTPSource>>(url, openmrsFetch);

  return {
    otpSource: data?.data?.otpSource,
    data,
    error,
    isLoading,
  };
};

/**
 * Sends OTP via SMS for KEHMIS workflow (client generates OTP)
 */
async function sendOtpKehmis(
  otp: string,
  receiver: string,
  patientName: string,
  expiryMinutes: number = 5,
  nationalId: string | null = null,
): Promise<void> {
  validateOtpInputs(receiver, patientName);

  const context: OtpContext = {
    otp,
    patient_name: patientName,
    expiry_time: expiryMinutes,
  };

  const messageTemplate =
    'Dear {{patient_name}}, Your One-Time Password (OTP) for access is {{otp}}.' +
    ' Do not share this code with anyone. The code is valid for {{expiry_time}} minutes.';

  try {
    const message = parseMessage(context, messageTemplate);
    const url = buildSmsUrl(message, receiver, nationalId);

    const response = await openmrsFetch(url, {
      method: 'POST',
      redirect: 'follow',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to send OTP: ${errorMessage}`);
  }
}

class KehmisOTPManager {
  private otpStore: Map<string, { otp: string; timestamp: number; attempts: number; expiryTime: number }> = new Map();
  private readonly MAX_ATTEMPTS = 3;

  async requestOTP(
    phoneNumber: string,
    patientName: string,
    expiryMinutes: number = 5,
    nationalId: string | null = null,
  ): Promise<void> {
    this.cleanupExpiredOTPs();

    const otp = generateOTP(5);
    const expiryTime = expiryMinutes * 60 * 1000;

    const otpData = {
      otp,
      timestamp: Date.now(),
      attempts: 0,
      expiryTime,
    };

    this.otpStore.set(phoneNumber, otpData);

    await sendOtpKehmis(otp, phoneNumber, patientName, expiryMinutes, nationalId);
  }

  async verifyOTP(phoneNumber: string, inputOtp: string): Promise<boolean> {
    this.cleanupExpiredOTPs();

    const storedData = this.otpStore.get(phoneNumber);

    if (!storedData) {
      throw new Error('No OTP found for this phone number. Please request a new OTP.');
    }

    if (Date.now() - storedData.timestamp > storedData.expiryTime) {
      this.otpStore.delete(phoneNumber);
      throw new Error('OTP has expired. Please request a new OTP.');
    }

    storedData.attempts++;

    if (storedData.attempts > this.MAX_ATTEMPTS) {
      this.otpStore.delete(phoneNumber);
      throw new Error('Maximum OTP attempts exceeded. Please request a new OTP.');
    }

    if (storedData.otp === inputOtp.trim()) {
      this.otpStore.delete(phoneNumber);
      return true;
    } else {
      this.otpStore.set(phoneNumber, storedData);
      throw new Error(`Invalid OTP. ${this.MAX_ATTEMPTS - storedData.attempts} attempts remaining.`);
    }
  }

  cleanupExpiredOTPs(): void {
    const now = Date.now();
    for (const [phoneNumber, data] of this.otpStore.entries()) {
      if (now - data.timestamp > data.expiryTime) {
        this.otpStore.delete(phoneNumber);
      }
    }
  }

  hasValidOTP(phoneNumber: string): boolean {
    const storedData = this.otpStore.get(phoneNumber);
    if (!storedData) {
      return false;
    }
    return Date.now() - storedData.timestamp <= storedData.expiryTime;
  }

  getRemainingTimeMinutes(phoneNumber: string): number {
    const storedData = this.otpStore.get(phoneNumber);
    if (!storedData) {
      return 0;
    }
    const elapsed = Date.now() - storedData.timestamp;
    const remaining = Math.max(0, storedData.expiryTime - elapsed);
    return Math.ceil(remaining / (60 * 1000));
  }

  getRemainingAttempts(phoneNumber: string): number {
    const storedData = this.otpStore.get(phoneNumber);
    if (!storedData) {
      return 0;
    }
    return Math.max(0, this.MAX_ATTEMPTS - storedData.attempts);
  }

  hasActiveOTPs(): boolean {
    return this.otpStore.size > 0;
  }
}

/**
 * Requests OTP from server (server generates and sends OTP)
 */
async function requestOtpFromServer(
  receiver: string,
  patientName: string,
  expiryMinutes: number = 5,
  nationalId: string | null = null,
): Promise<{ id: string; message: string }> {
  validateOtpInputs(receiver, patientName);

  const context: OtpContext = {
    otp: '{{OTP}}',
    patient_name: patientName,
    expiry_time: expiryMinutes,
  };

  const messageTemplate =
    'Dear {{patient_name}}, Your OTP to access your Shared Health Records is {{otp}}.' +
    ' By entering this code, you consent to accessing your records. Valid for {{expiry_time}} minutes.';

  try {
    const message = parseMessage(context, messageTemplate);
    const url = buildSmsUrl(message, receiver, nationalId);

    const response = await openmrsFetch(url, {
      method: 'POST',
      redirect: 'follow',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let responseText = await response.text();

    let unwrappedText: string;
    try {
      unwrappedText = JSON.parse(responseText);
    } catch (e) {
      unwrappedText = responseText;
    }

    const jsonMatch = unwrappedText.match(/\{.*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON in server response');
    }

    let data;
    try {
      data = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      throw new Error('Invalid JSON response from server');
    }

    if (data.status === 'success' && data.id) {
      return {
        id: data.id,
        message: data.message || 'OTP sent successfully',
      };
    } else {
      const errorMessage = data.message || 'Failed to send OTP - no ID returned';
      throw new Error(errorMessage);
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.startsWith('Failed to send OTP')) {
        throw error;
      }
      throw new Error(`Failed to send OTP: ${error.message}`);
    }
    throw new Error('Failed to send OTP: Unknown error occurred');
  }
}

/**
 * Verifies OTP with server
 */
async function verifyOtpWithServer(otpId: string, otp: string): Promise<boolean> {
  try {
    const url = `${restBaseUrl}/kenyaemr/validate-otp`;

    const response = await openmrsFetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: otpId,
        otp: otp.trim(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rawText = await response.text();

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(rawText);
    } catch (e) {
      throw new Error('Invalid response from server');
    }

    let data = parsedResponse;
    if (parsedResponse.response && typeof parsedResponse.response === 'string') {
      try {
        data = JSON.parse(parsedResponse.response);
      } catch (e) {
        throw new Error('Invalid nested response from server');
      }
    }

    if (data.status === 'success' || data.valid === true) {
      return true;
    } else {
      const errorMessage = data.message || 'Invalid OTP';
      throw new Error(errorMessage);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'OTP verification failed';
    throw new Error(errorMessage);
  }
}

class HieOTPManager {
  private otpSessions: Map<
    string,
    {
      otpId: string;
      timestamp: number;
      attempts: number;
      expiryTime: number;
      nationalId?: string | null;
      phoneNumber: string;
    }
  > = new Map();
  private readonly MAX_ATTEMPTS = 3;

  async requestOTP(
    phoneNumber: string,
    patientName: string,
    expiryMinutes: number = 5,
    nationalId: string | null = null,
  ): Promise<void> {
    this.cleanupExpiredOTPs();

    const expiryTime = expiryMinutes * 60 * 1000;

    try {
      const { id, message } = await requestOtpFromServer(phoneNumber, patientName, expiryMinutes, nationalId);
      const sessionData = {
        otpId: id,
        timestamp: Date.now(),
        attempts: 0,
        expiryTime,
        nationalId,
        phoneNumber,
      };

      this.otpSessions.set(phoneNumber, sessionData);
    } catch (error) {
      console.error('Error requesting OTP from server', error);
      throw error;
    }
  }

  async verifyOTP(phoneNumber: string, inputOtp: string): Promise<boolean> {
    // Clean up expired sessions before verification
    this.cleanupExpiredOTPs();

    const sessionData = this.otpSessions.get(phoneNumber);

    if (!sessionData) {
      throw new Error('No OTP session found for this phone number. Please request a new OTP.');
    }

    if (Date.now() - sessionData.timestamp > sessionData.expiryTime) {
      this.otpSessions.delete(phoneNumber);
      throw new Error('OTP has expired. Please request a new OTP.');
    }

    sessionData.attempts++;

    if (sessionData.attempts > this.MAX_ATTEMPTS) {
      this.otpSessions.delete(phoneNumber);
      throw new Error('Maximum OTP attempts exceeded. Please request a new OTP.');
    }

    try {
      const isValid = await verifyOtpWithServer(sessionData.otpId, inputOtp);

      if (isValid) {
        this.otpSessions.delete(phoneNumber);
        return true;
      } else {
        this.otpSessions.set(phoneNumber, sessionData);
        throw new Error(`Invalid OTP. ${this.MAX_ATTEMPTS - sessionData.attempts} attempts remaining.`);
      }
    } catch (error) {
      this.otpSessions.set(phoneNumber, sessionData);

      const errorMessage = error instanceof Error ? error.message : 'Invalid OTP';
      const remainingAttempts = this.MAX_ATTEMPTS - sessionData.attempts;

      if (remainingAttempts > 0) {
        throw new Error(`${errorMessage} ${remainingAttempts} attempts remaining.`);
      } else {
        this.otpSessions.delete(phoneNumber);
        throw new Error('Maximum OTP attempts exceeded. Please request a new OTP.');
      }
    }
  }

  cleanupExpiredOTPs(): void {
    const now = Date.now();
    for (const [phoneNumber, data] of this.otpSessions.entries()) {
      if (now - data.timestamp > data.expiryTime) {
        this.otpSessions.delete(phoneNumber);
      }
    }
  }

  hasValidOTP(phoneNumber: string): boolean {
    const sessionData = this.otpSessions.get(phoneNumber);
    if (!sessionData) {
      return false;
    }
    return Date.now() - sessionData.timestamp <= sessionData.expiryTime;
  }

  getRemainingTimeMinutes(phoneNumber: string): number {
    const sessionData = this.otpSessions.get(phoneNumber);
    if (!sessionData) {
      return 0;
    }
    const elapsed = Date.now() - sessionData.timestamp;
    const remaining = Math.max(0, sessionData.expiryTime - elapsed);
    return Math.ceil(remaining / (60 * 1000));
  }

  getRemainingAttempts(phoneNumber: string): number {
    const sessionData = this.otpSessions.get(phoneNumber);
    if (!sessionData) {
      return 0;
    }
    return Math.max(0, this.MAX_ATTEMPTS - sessionData.attempts);
  }

  hasActiveOTPs(): boolean {
    return this.otpSessions.size > 0;
  }
}

interface IOTPManager {
  requestOTP(
    phoneNumber: string,
    patientName: string,
    expiryMinutes?: number,
    nationalId?: string | null,
  ): Promise<void>;
  verifyOTP(phoneNumber: string, inputOtp: string): Promise<boolean>;
  cleanupExpiredOTPs(): void;
  hasValidOTP(phoneNumber: string): boolean;
  getRemainingTimeMinutes(phoneNumber: string): number;
  getRemainingAttempts(phoneNumber: string): number;
  hasActiveOTPs(): boolean;
}

class OTPManagerAdapter implements IOTPManager {
  private kehmisManager: KehmisOTPManager;
  private hieManager: HieOTPManager;
  private currentSource: string;

  constructor(otpSource: string = 'kehmis') {
    this.kehmisManager = new KehmisOTPManager();
    this.hieManager = new HieOTPManager();
    this.currentSource = otpSource;
  }

  setOtpSource(source: string) {
    this.currentSource = source;
  }

  private getManager(): IOTPManager {
    return this.currentSource === 'hie' ? this.hieManager : this.kehmisManager;
  }

  async requestOTP(
    phoneNumber: string,
    patientName: string,
    expiryMinutes: number = 5,
    nationalId: string | null = null,
  ): Promise<void> {
    this.cleanupExpiredOTPs();
    return this.getManager().requestOTP(phoneNumber, patientName, expiryMinutes, nationalId);
  }

  async verifyOTP(phoneNumber: string, inputOtp: string): Promise<boolean> {
    this.cleanupExpiredOTPs();
    return this.getManager().verifyOTP(phoneNumber, inputOtp);
  }

  cleanupExpiredOTPs(): void {
    this.kehmisManager.cleanupExpiredOTPs();
    this.hieManager.cleanupExpiredOTPs();
  }

  hasValidOTP(phoneNumber: string): boolean {
    return this.getManager().hasValidOTP(phoneNumber);
  }

  getRemainingTimeMinutes(phoneNumber: string): number {
    return this.getManager().getRemainingTimeMinutes(phoneNumber);
  }

  getRemainingAttempts(phoneNumber: string): number {
    return this.getManager().getRemainingAttempts(phoneNumber);
  }

  hasActiveOTPs(): boolean {
    return this.kehmisManager.hasActiveOTPs() || this.hieManager.hasActiveOTPs();
  }
}

export const otpManager = new OTPManagerAdapter();

export const cleanupAllOTPs = (): void => {
  otpManager.cleanupExpiredOTPs();
};

/**
 * Create OTP handlers with dynamic source detection
 */
export function createOtpHandlers(
  patientName: string,
  expiryMinutes: number,
  nationalId: string | null = null,
  otpSource?: string,
) {
  if (otpSource) {
    otpManager.setOtpSource(otpSource);
  }

  return {
    onRequestOtp: async (phone: string): Promise<void> => {
      await otpManager.requestOTP(phone, patientName, expiryMinutes, nationalId);
    },
    onVerify: async (otp: string, phoneNumber: string): Promise<void> => {
      const isValid = await otpManager.verifyOTP(phoneNumber, otp);
      if (!isValid) {
        throw new Error('OTP verification failed');
      }
    },
    hasValidOTP: (phone: string): boolean => {
      return otpManager.hasValidOTP(phone);
    },
    getRemainingTime: (phone: string): number => {
      return otpManager.getRemainingTimeMinutes(phone);
    },
    getRemainingAttempts: (phone: string): number => {
      return otpManager.getRemainingAttempts(phone);
    },
    cleanup: (): void => {
      otpManager.cleanupExpiredOTPs();
    },
  };
}
