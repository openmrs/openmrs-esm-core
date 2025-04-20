import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, SwitcherItem } from '@carbon/react';
import { capitalize } from 'lodash-es';
import { TranslateIcon, showModal, useSession } from '@openmrs/esm-framework';
import styles from './change-language-link.scss';

/** The user menu item that shows the current language and has a button to change the language */
function ChangeLanguageLink() {
  const { t } = useTranslation();
  const session = useSession();

  const launchChangeLanguageModal = useCallback(() => {
    const dispose = showModal('change-language-modal', {
      closeModal: () => dispose(),
      size: 'sm',
    });
  }, []);

  const languageName = session?.locale
    ? new Intl.DisplayNames([session.locale], { type: 'language' })
    : new Intl.DisplayNames(['en'], { type: 'language' });

  return (
    <SwitcherItem className={styles.panelItemContainer} aria-label={t('changeLanguage', 'Change language')}>
      <div>
        <TranslateIcon size={20} />
        <p>{capitalize(languageName.of(session?.locale ?? 'en'))}</p>
      </div>
      <Button kind="ghost" onClick={launchChangeLanguageModal}>
        {t('change', 'Change')}
      </Button>
    </SwitcherItem>
  );
}

export default ChangeLanguageLink;
