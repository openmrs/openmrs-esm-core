import React, { useCallback } from 'react';
import { Language } from '@carbon/react/icons';
import { useTranslation } from 'react-i18next';
import { showModal, useSession } from '@openmrs/esm-framework';
import { Button } from '@carbon/react';
import styles from './change-language-link.scss';

/** The user menu item that shows the current language and has a button to change the language */
export function ChangeLanguageLink() {
  const { t } = useTranslation();
  const session = useSession();

  const launchChangeModal = useCallback(() => {
    showModal('change-language-modal');
  }, []);

  const languageNames = new Intl.DisplayNames([session?.locale], { type: 'language' });

  return (
    <div className={styles.changeLanguageLinkContainer}>
      <Language size={20} />
      <div>
        {languageNames.of(session?.locale)}
        <Button kind="ghost" onClick={launchChangeModal}>
          {t('change', 'Change')}
        </Button>
      </div>
    </div>
  );
}

export default ChangeLanguageLink;
