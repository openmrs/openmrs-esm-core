import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ModalBody, ModalFooter, ModalHeader, RadioButton, RadioButtonGroup } from '@carbon/react';
import { useConnectivity, useSession } from '@openmrs/esm-framework';
import { postUserPropertiesOffline, postUserPropertiesOnline } from './change-language.resource';
import styles from './change-language-modal.scss';

interface ChangeLanguageModalProps {
  close(): void;
}

export default function ChangeLanguageModal({ close }: ChangeLanguageModalProps) {
  const { t } = useTranslation();
  const session = useSession();
  const user = session?.user;
  const allowedLocales = session?.allowedLocales ?? [];
  const [selectedLocale, setSelectedLocale] = useState(session?.locale);
  const isOnline = useConnectivity();

  const onSubmit = useCallback(() => {
    const postUserProperties = isOnline ? postUserPropertiesOnline : postUserPropertiesOffline;
    if (selectedLocale !== session?.locale) {
      const ac = new AbortController();
      postUserProperties(
        user.uuid,
        {
          ...(user.userProperties ?? {}),
          defaultLocale: selectedLocale,
        },
        ac,
      );
    }
  }, [isOnline, user.userProperties, user.uuid, selectedLocale]);

  const languageNames = useMemo(
    () => Object.fromEntries(allowedLocales.map((l) => [l, new Intl.DisplayNames([l], { type: 'language' }).of(l)])),
    [allowedLocales],
  );

  return (
    <>
      <ModalHeader closeModal={close} title={t('changeLanguage', 'Change Language')} />
      <ModalBody>
        <div className={styles.languageOptionsContainer}>
          <RadioButtonGroup
            valueSelected={selectedLocale}
            orientation="vertical"
            name="Login locations"
            onChange={(l) => {
              setSelectedLocale(l.toString());
            }}
          >
            {allowedLocales.map((l, i) => (
              <RadioButton
                className={styles.languageRadioButton}
                key={`locale-option-${l}`}
                id={`locale-option-${l}`}
                name={l}
                labelText={languageNames[l]}
                value={l}
              />
            ))}
          </RadioButtonGroup>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={close}>
          {t('cancel', 'Cancel')}
        </Button>
        <Button type="submit" onClick={onSubmit}>
          {t('apply', 'Apply')}
        </Button>
      </ModalFooter>
    </>
  );
}
