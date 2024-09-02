import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, SwitcherItem } from '@carbon/react';
import { TranslateIcon, useSession } from '@openmrs/esm-framework';
import styles from './change-language-link.scss';
import ChangeLanguageModal from './change-language.modal';

/** The user menu item that shows the current language and has a button to change the language */
export function ChangeLanguageLink() {
  const { t } = useTranslation();
  const session = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const languageNames = new Intl.DisplayNames([session?.locale], { type: 'language' });

  return (
    <>
      <SwitcherItem className={styles.panelItemContainer} aria-label={t('changeLanguage', 'Change language')}>
        <div>
          <TranslateIcon size={20} />
          <p>{languageNames.of(session?.locale)}</p>
        </div>
        <Button kind="ghost" onClick={() => setIsModalOpen(true)}>
          {t('change', 'Change')}
        </Button>
      </SwitcherItem>
      {isModalOpen && <ChangeLanguageModal close={() => setIsModalOpen(false)} />}
    </>
  );
}

export default ChangeLanguageLink;
