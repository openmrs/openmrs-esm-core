import React from 'react';
import { ChevronDownIcon, ChevronUpIcon, UserHasAccess, useStore } from '@openmrs/esm-framework';
import { implementerToolsStore, togglePopup } from './store';
import styles from './implementer-tools.styles.scss';
import { useTranslation } from 'react-i18next';

const GlobalImplementerToolsButton: React.FC = () => {
  const { isOpen } = useStore(implementerToolsStore);
  const { t } = useTranslation();

  return (
    <UserHasAccess privilege="O3 Implementer Tools">
      <div className={styles.chevronImplementerToolsButton} data-testid="globalImplementerToolsButton">
        <button
          type="button"
          onClick={togglePopup}
          aria-label={t('toggleImplementerTools', 'Toggle Implementer Tools')}
          className={styles.implementerToolsButton}
        >
          {isOpen ? <ChevronDownIcon size={16} /> : <ChevronUpIcon size={16} />}
        </button>
      </div>
    </UserHasAccess>
  );
};

export default GlobalImplementerToolsButton;
