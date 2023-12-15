import React from 'react';
import { useTranslation } from 'react-i18next';
import { Layer, Tile } from '@carbon/react';
import { useLayoutType } from '@openmrs/esm-framework';
import { EmptyDataIllustration } from './empty-data-illustration.component';
import styles from './empty-state.scss';

type EmptyStateProps = {
  displayText: string;
  headerTitle: string;
};

const EmptyState: React.FC<EmptyStateProps> = ({ displayText, headerTitle }) => {
  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';
  return (
    <Layer>
      <Tile className={styles.tile}>
        <div className={isTablet ? styles.tabletHeading : styles.desktopHeading}>
          <h4>{headerTitle}</h4>
        </div>
        <EmptyDataIllustration />
        <p className={styles.content}>
          {t('emptyStateText', 'There are no {{displayText}} to display', {
            displayText,
          })}
        </p>
      </Tile>
    </Layer>
  );
};

export default EmptyState;
