import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from '@carbon/react';
import styles from './app-search-bar.scss';

import { type AssignedExtension, Extension, useConnectedExtensions } from '@openmrs/esm-framework';
import { ComponentContext } from '@openmrs/esm-framework/src/internal';

const appMenuItemSlot = 'app-menu-item-slot';

interface AppSearchBarProps {
  onChange?: (searchTerm: string) => void;
  onClear: () => void;
  onSubmit: (searchTerm: string) => void;
  small?: boolean;
}

const AppSearchBar = React.forwardRef<HTMLInputElement, AppSearchBarProps>(
  ({ onChange, onClear, onSubmit, small }, ref) => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const menuItemExtensions = useConnectedExtensions(appMenuItemSlot) as AssignedExtension[];

    const handleChange = (val: string) => {
      setSearchTerm(val);
      if (onChange) {
        onChange(val);
      }
    };

    const handleSubmit = (evt: React.FormEvent) => {
      evt.preventDefault();
      if (onSubmit) {
        onSubmit(searchTerm);
      }
    };

    const filteredExtensions = menuItemExtensions
      .filter((extension) => {
        const itemName = extension?.name ?? '';
        return itemName.toLowerCase().includes(searchTerm.toLowerCase());
      })
      .map((extension) => (
        <ComponentContext.Provider
          key={extension?.id}
          value={{
            featureName: 'app-menu',
            moduleName: extension?.moduleName,
            extension: {
              extensionId: extension?.id,
              extensionSlotName: appMenuItemSlot,
              extensionSlotModuleName: extension?.moduleName,
            },
          }}
        >
          <Extension />
        </ComponentContext.Provider>
      ));

    return (
      <>
        <form onSubmit={handleSubmit} className={styles.searchArea}>
          <Search
            autoFocus
            className={styles.appSearchInput}
            closeButtonLabelText={t('clearSearch', 'Clear')}
            labelText=""
            onChange={(event) => handleChange(event.target.value)}
            onClear={onClear}
            placeholder={t('searchForModule', 'Search for module')}
            size={small ? 'sm' : 'lg'}
            value={searchTerm}
            ref={ref}
            data-testid="appSearchBar"
          />
        </form>
        <div className={styles.searchItems}>
          {searchTerm
            ? filteredExtensions
            : menuItemExtensions.map((extension) => (
                <ComponentContext.Provider
                  key={extension?.id}
                  value={{
                    featureName: 'app-menu',
                    moduleName: extension?.moduleName,
                    extension: {
                      extensionId: extension?.id,
                      extensionSlotName: appMenuItemSlot,
                      extensionSlotModuleName: extension?.moduleName,
                    },
                  }}
                >
                  <Extension />
                </ComponentContext.Provider>
              ))}
        </div>
      </>
    );
  },
);

export default AppSearchBar;
