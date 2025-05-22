import React, { useEffect } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { HeaderPanel } from '@carbon/react';
import { Launch } from '@carbon/react/icons';
import { ExtensionSlot, useOnClickOutside, useConfig } from '@openmrs/esm-framework';
import styles from './app-menu-panel.scss';

interface AppMenuProps {
  expanded: boolean;
  hidePanel: Parameters<typeof useOnClickOutside>[0];
}

const AppMenuPanel: React.FC<AppMenuProps> = ({ expanded, hidePanel }) => {
  const appMenuRef = useOnClickOutside<HTMLDivElement>(hidePanel, expanded);
  const config = useConfig();
  const { t } = useTranslation();

  useEffect(() => {
    window.addEventListener('popstate', hidePanel);
    return () => window.removeEventListener('popstate', hidePanel);
  }, [hidePanel]);

  return (
    expanded && (
      <div ref={appMenuRef} style={{ display: 'inline' }}>
        <HeaderPanel
          className={classNames({ [styles.headerPanel]: expanded })}
          aria-label="App Menu Panel"
          expanded={expanded}
        >
          <ExtensionSlot className={styles.menuLink} name="app-menu-slot" />
          {config?.externalRefLinks?.length > 0 && (
            <div className={classNames(styles.menuLink, styles.externalLinks)}>
              {config?.externalRefLinks?.map((link) => (
                <a target="_blank" rel="noopener noreferrer" href={link?.redirect}>
                  {t(link?.title)}
                  <Launch size={16} className={styles.launchIcon} />
                </a>
              ))}
            </div>
          )}
        </HeaderPanel>
      </div>
    )
  );
};

export default AppMenuPanel;
