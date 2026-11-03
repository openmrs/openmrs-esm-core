import classNames from 'classnames';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { upperFirst } from 'lodash-es';
import {
  Button,
  Checkbox,
  InlineLoading,
  InlineNotification,
  ModalBody,
  ModalFooter,
  ModalHeader,
  RadioButton,
  RadioButtonGroup,
} from '@carbon/react';
import { getLocaleDisplayName, useAbortController, useSession } from '@openmrs/esm-framework';
import { updateSessionLocale, updateUserProperties } from './change-language.resource';
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
  const [errorMessage, setErrorMessage] = useState('');
  const ac = useAbortController();

  const handleSubmit = useCallback(async () => {
    if (!selectedLocale || selectedLocale === session?.locale) {
      return;
    }

    setIsChangingLanguage(true);
    setErrorMessage('');

    // The backend expects Java's `Locale#toString()` form, so hyphens go back to underscores.
    const formattedLocale = selectedLocale.replace(/-/gi, '_');

    try {
      if (shouldChangeDefaultLocale) {
        await updateUserProperties(
          user?.uuid,
          {
            // Spreading undefined is a no-op, so no fallback object is needed.
            ...user?.userProperties,
            defaultLocale: formattedLocale,
          },
          ac,
        );
      } else {
        await updateSessionLocale(formattedLocale, ac);
      }
      // On success the resource reloads the page, so the loading state is intentionally left set.
    } catch (error) {
      // Same shape the change-password modal reads: the REST error body when there is one,
      // the transport error otherwise.
      // `||` rather than `??`: these are all strings, and an empty one should fall through to the
      // next candidate rather than render an error notification with no message in it.
      setErrorMessage(
        error?.responseBody?.error?.message ||
          error?.responseBody?.message ||
          error?.message ||
          t('changeLanguageFailedSubtitle', 'Please try again. Your language has not been changed.'),
      );
      setIsChangingLanguage(false);
    }
  }, [ac, session?.locale, selectedLocale, shouldChangeDefaultLocale, user?.userProperties, user?.uuid]);

  const languageNames = useMemo(
    () => Object.fromEntries(allowedLocales.map((locale) => [locale, getLocaleDisplayName(locale)])),
    [allowedLocales],
  );

  return (
    <>
      <ModalHeader closeModal={close} title={t('changeLanguage', 'Change language')} />
      <ModalBody>
        {errorMessage && (
          <InlineNotification
            className={styles.errorNotification}
            hideCloseButton
            kind="error"
            lowContrast
            subtitle={errorMessage}
            title={t('changeLanguageFailed', 'Error changing language')}
          />
        )}
        <div className={styles.languageOptionsContainer}>
          <RadioButtonGroup
            valueSelected={selectedLocale}
            orientation="vertical"
            name="Language options"
            onChange={(locale) => {
              setSelectedLocale(locale.toString());
              // A failure refers to the locale that was submitted, so it should not outlive it.
              setErrorMessage('');
            }}
          >
            {allowedLocales.map((locale, i) => (
              <RadioButton
                className={styles.languageRadioButton}
                key={`locale-option-${locale}-${i}`}
                id={`locale-option-${locale}-${i}`}
                name={locale}
                labelText={upperFirst(languageNames[locale])}
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
