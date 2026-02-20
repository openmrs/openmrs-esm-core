import React from 'react';
import { Layer, Tile } from '@carbon/react';
import { getCoreTranslation } from '@openmrs/esm-translations';
import styles from './error-state.module.scss';
import { CardHeader } from '../cards';

export interface ErrorStateProps {
  /** The error that caused this error card to be rendered. Expected to be a failed fetch result. */
  error: any;
  /** The title to use for this empty component. This must be a pre-translated string. */
  headerTitle: string;
}

function getErrorDetail(error: any): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as any).response === 'object' &&
    (error as any).response !== null
  ) {
    const { status, statusText } = error.response;
    const parts: Array<string | number> = [];
    if (status != null) parts.push(status);
    if (statusText) parts.push(statusText);
    return parts.length ? ` ${parts.join(': ')}` : '';
  }
  if (error instanceof Error) {
    return ` ${error.message}`;
  }
  if (typeof error === 'string') {
    return ` ${error}`;
  }
  return '';
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, headerTitle }) => {
  return (
    <Layer>
      <Tile className={styles.tile}>
        <CardHeader title={headerTitle} />
        <p className={styles.errorMessage}>
          {getCoreTranslation('error', 'Error')}
          {getErrorDetail(error)}
        </p>
        <p className={styles.errorCopy}>{getCoreTranslation('errorCopy')}</p>
      </Tile>
    </Layer>
  );
};

export const ErrorCard = ErrorState;
export type ErrorCardProps = ErrorStateProps;
