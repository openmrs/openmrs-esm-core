import React from 'react';
import { ChevronDownIcon, ChevronUpIcon, UserHasAccess, useStore } from '@openmrs/esm-framework';
import { implementerToolsStore, togglePopup } from './store';
import styles from './implementer-tools.styles.scss';

const GlobalImplementerToolsButton: React.FC = () => {
  const { isOpen } = useStore(implementerToolsStore);

  return (
    <UserHasAccess privilege="coreapps.systemAdministration">
      <div className={styles.chevronImplementerToolsButton} data-testid="globalImplementerToolsButton">
        <div onClick={togglePopup} role="button" tabIndex={0}>
          {isOpen ? <ChevronDownIcon size={16} /> : <ChevronUpIcon size={16} />}
        </div>
      </div>
    </UserHasAccess>
  );
};

export default GlobalImplementerToolsButton;
