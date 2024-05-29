import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, SwitcherItem } from '@carbon/react';
import { TranslateIcon, showModal, useSession } from '@openmrs/esm-framework';
import styles from './change-language-link.scss';

/** The user menu item that shows the current language and has a button to change the language */
export function ChangeLanguageLink() {
  const { t } = useTranslation();
  const session = useSession();

  const launchChangeLanguageModal = useCallback(() => showModal('change-language-modal'), []);

  const languageNames = new Intl.DisplayNames([session?.locale], { type: 'language' });

  return (
    <SwitcherItem className={styles.panelItemContainer} aria-label={t('changeLanguage', 'Change language')}>
      <div>
        <TranslateIcon size={20} />
        <p>{languageNames.of(session?.locale)}</p>
      </div>
      <Button kind="ghost" onClick={launchChangeLanguageModal}>
        {t('change', 'Change')}
      </Button>
    </SwitcherItem>
  );
}

export default ChangeLanguageLink;
