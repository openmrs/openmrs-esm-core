import { Button, Checkbox, ModalBody, ModalFooter, ModalHeader } from '@carbon/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
type TermsOfAccessModalProps = {
  onClose: () => void;
  onAccepted: () => void;
};
const TermsOfAccessModal: React.FC<TermsOfAccessModalProps> = ({ onAccepted, onClose }) => {
  const { t } = useTranslation();
  const [agree, setAgree] = useState(false);
  return (
    <>
      <ModalHeader title={t('authorizedAccessOnly', 'Authorized access only')} />
      <ModalBody>
        <p>
          {t(
            'termsOfAccessBody1',
            'This system contains confidential and sensitive health information for patients/clients. Access is restricted to authorized users for approved healthcare providers and official purposes only.',
          )}
        </p>
        <br />
        <p>
          {t(
            'termsOfAccessBody2',
            'All access and activities are logged and subject to audit. Unauthorized access, use, or disclosure may result in disciplinary and/or legal action. (DPA 2019, DHA 2023)',
          )}
        </p>
        <br />
        <p>
          <strong>{t('consentNotice', 'Consent Notice')}:</strong>
          <span>
            {t(
              'termsOfAccessConsent',
              'By logging into this TaifaCare HMIS, you acknowledge that patient information is maintained within the system, in compliance with Section 24 and Section 31 of the Digital Health Act, 2023. You consent to abide by the Act, ensuring confidentiality, integrity, and lawful use of digital health data. Unauthorized access or misuse is prohibited and subject to disciplinary and legal action under Section 59.',
            )}
          </span>
        </p>
        <br />
        <Checkbox
          id="checkbox-terms-of-access"
          labelText={t(
            'agreeToTermsOfAccess',
            'I Agree - I have read and consent to abide by the Digital Health Act provisions.',
          )}
          checked={agree}
          onChange={(_, { checked }) => setAgree(checked)}
        />
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={onClose}>
          {t('cancel', 'Cancel')}
        </Button>
        <Button kind="primary" onClick={onAccepted} disabled={!agree}>
          {t('continue', 'Continue')}
        </Button>
      </ModalFooter>
    </>
  );
};

export default TermsOfAccessModal;
