import React, { useState, useEffect } from 'react';
import { TextInput, Button, InlineNotification, SkeletonText } from '@carbon/react';
import { openmrsFetch, restBaseUrl, useSession } from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';

const TOTPSetup: React.FC = () => {
  const { t } = useTranslation();
  const session = useSession();
  const user = session?.user;
  const [secret, setSecret] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    setLoading(true);
    openmrsFetch(`${restBaseUrl}/authentication/totp/secret`, {
      method: 'GET',
    })
      .then(({ data }) => {
        setSecret(data.secret);
        setQrCode(data.qrCode);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || t('failedToFetchSecret', 'Failed to fetch TOTP secret.'));
        setLoading(false);
      });
  }, [t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setVerifying(true);
    try {
      // 1. Validate the TOTP code
      const { data } = await openmrsFetch(`${restBaseUrl}/authentication/totp/validate`, {
        method: 'POST',
        body: JSON.stringify({ secret, code: verificationCode }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!data.valid) {
        setError(t('invalidCode', 'Invalid code. Please try again.'));
        setVerifying(false);
        return;
      }
      // 2. Update user properties
      if (!user?.uuid) {
        setError(t('userSessionNotFound', 'User session not found.'));
        setVerifying(false);
        return;
      }
      const updatedUserProperties = {
        ...(user.userProperties ?? {}),
        'authentication.secondaryType': 'totp',
        'authentication.totp.secret': secret,
      };
      await openmrsFetch(`${restBaseUrl}/user/${user.uuid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userProperties: updatedUserProperties }),
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || t('verificationFailed', 'Failed to verify code or update user.'));
    } finally {
      setVerifying(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto' }}>
      <h3>{t('setupTwoFactorAuth', 'Set up Two-Factor Authentication')}</h3>
      <p>{t('scanQrCode', 'Scan the QR code below with your authenticator app, or enter the secret manually.')}</p>
      {loading ? (
        <SkeletonText paragraph width="100%" />
      ) : qrCode ? (
        <img src={qrCode} alt={t('totpQrCode', '2FA QR Code')} style={{ display: 'block', margin: '16px auto' }} />
      ) : null}
      <TextInput
        id="totp-secret"
        labelText={t('secret', 'Secret')}
        value={secret}
        readOnly
        style={{ marginBottom: 16 }}
        disabled={loading}
      />
      <TextInput
        id="verification-code"
        labelText={t('enterCodeFromApp', 'Enter code from your app')}
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        required
        maxLength={6}
        style={{ marginBottom: 16 }}
        disabled={loading || verifying}
      />
      <Button type="submit" disabled={loading || verifying}>
        {verifying ? t('verifying', 'Verifying...') : t('verifyAndEnable', 'Verify and Enable')}
      </Button>
      {error && (
        <InlineNotification
          kind="error"
          title={t('error', 'Error')}
          subtitle={error}
          onCloseButtonClick={() => setError(null)}
          style={{ marginTop: 16 }}
        />
      )}
      {success && (
        <InlineNotification
          kind="success"
          title={t('success', 'Success')}
          subtitle={t('totpSetupSuccess', '2FA has been set up successfully!')}
          style={{ marginTop: 16 }}
        />
      )}
    </form>
  );
};

export default TOTPSetup;
