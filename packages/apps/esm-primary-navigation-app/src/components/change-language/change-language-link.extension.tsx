import React, { useCallback } from 'react';
import { Language } from '@carbon/react/icons';
import { useTranslation } from 'react-i18next';
import { showModal, useSession } from '@openmrs/esm-framework';
import { Button } from '@carbon/react';
import styles from './change-language-link.scss';
import { SwitcherItem } from '@carbon/react';

/** The user menu item that shows the current language and has a button to change the language */
export function ChangeLanguageLink() {
  const { t } = useTranslation();
  const session = useSession();

  const launchChangeModal = useCallback(() => {
    showModal('change-language-modal');
  }, []);

  const languageNames = new Intl.DisplayNames([session?.locale], { type: 'language' });

  return (
    <SwitcherItem className={styles.panelItemContainer}>
      <div>
        <Language size={20} />
        <p>{languageNames.of(session?.locale)}</p>
      </div>
      <Button kind="ghost" onClick={launchChangeModal}>
        {t('change', 'Change')}
      </Button>
    </SwitcherItem>
  );
}

export default ChangeLanguageLink;
