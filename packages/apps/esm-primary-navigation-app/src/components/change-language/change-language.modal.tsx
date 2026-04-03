import classNames from 'classnames';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { capitalize } from 'lodash-es';
import {
  Button,
  Checkbox,
  InlineLoading,
  ModalBody,
  ModalFooter,
  ModalHeader,
  RadioButton,
  RadioButtonGroup,
} from '@carbon/react';
import { mutate } from 'swr';
import {
  setSessionLocale,
  setUserProperties,
  showSnackbar,
  useAbortController,
  useSession,
} from '@openmrs/esm-framework';
import styles from './change-language.scss';

interface ChangeLanguageModalProps {
  close(): void;
}

export default function ChangeLanguageModal({ close }: ChangeLanguageModalProps) {
  const { t } = useTranslation();
  const session = useSession();
  const user = session?.user;
  const allowedLocales = session?.allowedLocales ?? [];
  const [selectedLocale, setSelectedLocale] = useState(session?.locale);
  const [shouldChangeDefaultLocale, setShouldChangeDefaultLocale] = useState(true);
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  const ac = useAbortController();

  const handleSubmit = useCallback(async () => {
    setIsChangingLanguage(true);

    if (selectedLocale && selectedLocale !== session?.locale) {
      const formattedLocale = selectedLocale.replace(/-/gi, '_');

      try {
        // Update the active session locale so the change takes effect immediately.
        // This updates sessionStore, which triggers setUserLanguage() → <html lang> → i18n.changeLanguage().
        await setSessionLocale(formattedLocale, ac);
      } catch (error) {
        showSnackbar({
          kind: 'error',
          title: t('errorChangingLanguage', 'Error changing language'),
          subtitle: error?.message,
        });
        setIsChangingLanguage(false);
        return;
      }

      // From this point, the session locale has changed. Even if persisting the
      // default or revalidating caches fails, we close the modal since the UI
      // already reflects the new language.
      if (shouldChangeDefaultLocale) {
        try {
          await setUserProperties(user.uuid, { ...(user.userProperties ?? {}), defaultLocale: formattedLocale }, ac);
        } catch (error) {
          showSnackbar({
            kind: 'warning',
            title: t('errorSavingLanguagePreference', 'Language changed, but your default could not be saved'),
            subtitle: error?.message,
          });
        }
      }

      // Revalidate all SWR caches so backend data is refetched in the new locale.
      // Failures here are non-critical — stale data will be refreshed on next navigation.
      mutate(() => true).catch(() => {});

      close();
    }
  }, [ac, close, selectedLocale, session?.locale, shouldChangeDefaultLocale, t, user.userProperties, user.uuid]);

  const languageNames = useMemo(
    () =>
      Object.fromEntries(
        allowedLocales.map((locale) => [locale, new Intl.DisplayNames([locale], { type: 'language' }).of(locale)]),
      ),
    [allowedLocales],
  );

  return (
    <>
      <ModalHeader closeModal={close} title={t('changeLanguage', 'Change language')} />
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
                labelText={capitalize(languageNames[locale])}
                value={locale}
              />
            ))}
          </RadioButtonGroup>
        </div>
      </ModalBody>
      <div className={classNames('cds--layer-two', styles.updateDefaultLocaleContainer)} role="region">
        <Checkbox
          id={`change-default-locale`}
          labelText={t('changeDefaultLocale', 'Save as my default language')}
          checked={shouldChangeDefaultLocale}
          onChange={(_, { checked }) => setShouldChangeDefaultLocale(checked)}
        />
        <p className={classNames(styles.updateDefaultLocaleExplainer)}>
          {t('changeDefaultLocaleExplanation', 'Leave this unchecked to change language for this session only')}
        </p>
      </div>
      <ModalFooter>
        <Button kind="secondary" onClick={close}>
          {t('cancel', 'Cancel')}
        </Button>
        <Button
          className={styles.submitButton}
          disabled={isChangingLanguage || selectedLocale === session?.locale}
          type="submit"
          onClick={handleSubmit}
        >
          {isChangingLanguage ? (
            <InlineLoading description={t('changingLanguage', 'Changing language') + '...'} />
          ) : (
            <span>{t('change', 'Change')}</span>
          )}
        </Button>
      </ModalFooter>
    </>
  );
}
