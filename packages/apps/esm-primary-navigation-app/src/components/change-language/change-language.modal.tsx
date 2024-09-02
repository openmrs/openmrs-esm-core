import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InlineLoading, Modal, ModalBody, RadioButton, RadioButtonGroup } from '@carbon/react';
import { useConnectivity, useSession } from '@openmrs/esm-framework';
import { postUserPropertiesOffline, postUserPropertiesOnline } from './change-language.resource';
import styles from './change-language.scss';

interface ChangeLanguageModalProps {
  close(): void;
}

export default function ChangeLanguageModal({ close }: ChangeLanguageModalProps) {
  const { t } = useTranslation();
  const isOnline = useConnectivity();
  const session = useSession();
  const user = session?.user;
  const allowedLocales = session?.allowedLocales ?? [];
  const [selectedLocale, setSelectedLocale] = useState(session?.locale);
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);

  const handleSubmit = useCallback(() => {
    setIsChangingLanguage(true);

    const postUserProperties = isOnline ? postUserPropertiesOnline : postUserPropertiesOffline;

    if (selectedLocale && selectedLocale !== session?.locale) {
      const ac = new AbortController();
      postUserProperties(
        user.uuid,
        {
          ...(user.userProperties ?? {}),
          defaultLocale: selectedLocale.replace(/-/gi, '_'),
        },
        ac,
      );
    }
  }, [isOnline, user.userProperties, user.uuid, selectedLocale]);

  const languageNames = useMemo(
    () =>
      Object.fromEntries(
        allowedLocales.map((locale) => [locale, new Intl.DisplayNames([locale], { type: 'language' }).of(locale)]),
      ),
    [allowedLocales],
  );

  return (
    <Modal
      open={true}
      className={styles.customModal}
      modalHeading={t('changeLanguage', 'Change language')}
      size="sm"
      primaryButtonText={
        isChangingLanguage ? (
          <InlineLoading description={t('changingLanguage', 'Changing language') + '...'} />
        ) : (
          t('change', 'Change')
        )
      }
      primaryButtonDisabled={isChangingLanguage || selectedLocale === session?.locale}
      secondaryButtonText={t('cancel', 'Cancel')}
      onRequestSubmit={handleSubmit}
      onRequestClose={close}
    >
      <ModalBody>
        <div className={styles.languageOptionsContainer}>
          <RadioButtonGroup
            valueSelected={selectedLocale}
            orientation="vertical"
            name="Language options"
            onChange={(locale) => setSelectedLocale(locale.toString())}
          >
            {allowedLocales.map((locale, i) => (
              <RadioButton
                className={styles.languageRadioButton}
                key={`locale-option-${locale}-${i}`}
                id={`locale-option-${locale}-${i}`}
                name={locale}
                labelText={languageNames[locale]}
                value={locale}
              />
            ))}
          </RadioButtonGroup>
        </div>
      </ModalBody>
    </Modal>
  );
}
