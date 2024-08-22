import React from 'react';
import styles from './description.styles.scss';
import { useStore } from '@openmrs/esm-framework';
import { implementerToolsStore } from '../../store';
import { useTranslation } from 'react-i18next';

export function Description() {
  const { t } = useTranslation();
  const { activeItemDescription } = useStore(implementerToolsStore);
  return (
    <div>
      {activeItemDescription ? (
        <>
          <h2 className={styles.path}>{activeItemDescription.path.slice(1).join(' → ')}</h2>
          <p className={styles.description}>{activeItemDescription.description}</p>
          <p className={styles.source}>
            {activeItemDescription.source === 'default' ? (
              <>{t('itemDescriptionSourceDefaultText', 'The current value is the default.')}</>
            ) : activeItemDescription.source ? (
              <>
                {t('activeItemSourceText', 'The current value comes from ')}
                {activeItemDescription.source}
              </>
            ) : null}
          </p>
          {activeItemDescription.value ? <h4 className={styles.productiveHeading01}>{t('value', 'Value')}</h4> : null}
          <p className={styles.value}>
            {Array.isArray(activeItemDescription.value)
              ? activeItemDescription.value.map((v, i) => (
                  <p key={`item-description-value-${i}`}>{JSON.stringify(v)}</p>
                ))
              : JSON.stringify(activeItemDescription.value)}
          </p>
        </>
      ) : null}
    </div>
  );
}
