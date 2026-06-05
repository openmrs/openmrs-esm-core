import React from 'react';
import { Layer, Tile } from '@carbon/react';
import { useLayoutType } from '@openmrs/esm-react-utils';
import { getCoreTranslation } from '@openmrs/esm-translations';
import styles from './error-state.module.scss';

export interface ErrorStateProps {
  /** The error that caused this error card to be rendered. Expected to be a failed fetch result. */
  error: any;
  /** The title to use for this empty component. This must be a pre-translated string. */
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

export const ErrorCard = ErrorState;
export type ErrorCardProps = ErrorStateProps;
