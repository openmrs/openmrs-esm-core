import React from 'react';
import { useTranslation } from 'react-i18next';
import { HeaderGlobalAction } from '@carbon/react';
import { CloseIcon, ToolsIcon, UserHasAccess, useStore } from '@openmrs/esm-framework';
import { implementerToolsStore, togglePopup } from './store';
import styles from './implementer-tools.styles.scss';

const ImplementerToolsButton: React.FC = () => {
  const { t } = useTranslation();
  const { isOpen } = useStore(implementerToolsStore);

  return (
    <UserHasAccess privilege="coreapps.systemAdministration">
      <HeaderGlobalAction
        aria-label={t('implementerTools', 'Implementer Tools')}
        aria-labelledby="Implementer Tools"
        className={styles.toolStyles}
        enterDelayMs={500}
        name="ImplementerToolsIcon"
        onClick={togglePopup}
      >
        {isOpen ? <CloseIcon size={20} /> : <ToolsIcon size={20} />}
      </HeaderGlobalAction>
    </UserHasAccess>
  );
};

export default ImplementerToolsButton;
