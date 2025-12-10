import React from 'react';
import { Layer, Tile } from '@carbon/react';
import { getCoreTranslation } from '@openmrs/esm-translations';
import { CardHeader } from '../cards';
import styles from './error-card.module.scss';

export interface ErrorCardProps {
  error: any;
  headerTitle: string;
}

/**
 * Re-usable card for displaying a fetch error
 */
export const ErrorCard: React.FC<ErrorCardProps> = ({ error, headerTitle }) => {
  return (
    <Layer>
      <Tile className={styles.tile}>
        <CardHeader title={headerTitle} />
        <p className={styles.errorMessage}>
          {getCoreTranslation('error', 'Error')} {`${error?.response?.status}: `}
          {error?.response?.statusText}
        </p>
        <p className={styles.errorCopy}>
          {getCoreTranslation(
            'errorCopy',
            'Sorry, there was a problem displaying this information. You can try to reload this page, or contact the site administrator and quote the error code above.',
          )}
        </p>
      </Tile>
    </Layer>
  );
};
