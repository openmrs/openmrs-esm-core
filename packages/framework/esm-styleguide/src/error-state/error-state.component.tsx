import React from 'react';
import { Layer, Tile } from '@carbon/react';
import { getCoreTranslation } from '@openmrs/esm-translations';
import { useLayoutType } from '@openmrs/esm-react-utils';
import styles from './error-state.module.scss';

export interface ErrorStateProps {
  error: any;
  headerTitle: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, headerTitle }) => {
  const isTablet = useLayoutType() === 'tablet';

  return (
    <Layer>
      <Tile className={styles.tile}>
        <div className={isTablet ? styles.tabletHeading : styles.desktopHeading}>
          <h4>{headerTitle}</h4>
        </div>
        <p className={styles.errorMessage}>
          {getCoreTranslation('error', 'Error')} {`${error?.response?.status}: `}
          {error?.response?.statusText}
        </p>
        <p className={styles.errorCopy}>{getCoreTranslation('errorCopy')}</p>
      </Tile>
    </Layer>
  );
};
