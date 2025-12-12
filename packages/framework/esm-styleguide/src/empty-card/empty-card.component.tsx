import React from 'react';
import classNames from 'classnames';
import { Button, Layer, Tile } from '@carbon/react';
import { useLayoutType } from '@openmrs/esm-react-utils';
import { getCoreTranslation } from '@openmrs/esm-translations';
import { CardHeader } from '../cards';
import styles from './empty-card.module.scss';

export interface EmptyCardProps {
  /** The name of the type of item that would be displayed here if not empty. This must be a pre-translated string. */
  displayText: string;
  /** The title to use for this empty component. This must be a pre-translated string. */
  headerTitle: string;
  /** A callback to invoke when the user tries to record a new item. */
  launchForm?(): void;
}

export const EmptyCardIllustration = ({ width = '64', height = '64' }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 64 64">
      <use href={`#omrs-empty-data-illustration`} />
    </svg>
  );
};

/**
 * Re-usable card for displaying an empty state
 */
export const EmptyCard: React.FC<EmptyCardProps> = (props) => {
  const isTablet = useLayoutType() === 'tablet';
  const launchForm = props.launchForm;

  return (
    <Layer className={styles.layer}>
      <Tile className={styles.tile}>
        <CardHeader title={props.headerTitle} />
        <EmptyCardIllustration />
        <p className={styles.content}>
          {getCoreTranslation('emptyStateText', 'There are no {{displayText}} to display', {
            displayText: props.displayText,
          })}
        </p>
        <p className={styles.action}>
          {launchForm && (
            <Button onClick={() => launchForm()} kind="ghost" size={isTablet ? 'lg' : 'sm'}>
              {getCoreTranslation('recordNewEntry', 'Record {{ displayText }}', {
                displayText: props.displayText,
              })}
            </Button>
          )}
        </p>
      </Tile>
    </Layer>
  );
};
