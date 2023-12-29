import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { showModal, useSession } from '@openmrs/esm-framework';
import { Button } from '@carbon/react';

/** The user menu item that shows the current language and has a button to change the language */
export function ChangeLanguageLink() {
  const { t } = useTranslation();
  const session = useSession();

  const launchChangeModal = useCallback(() => {
    showModal('change-language-modal');
  }, []);

  return (
    <div>
      {session?.locale}
      <Button type="ghost" onClick={launchChangeModal}>
        {t('change', 'Change')}
      </Button>
    </div>
  );
}

export default ChangeLanguageLink;
