import React from 'react';
import { useTranslation } from 'react-i18next';
import type { TileProps } from '@carbon/react';
import { Button, Layer, Tile } from '@carbon/react';
import { ArrowRightIcon, navigate } from '@openmrs/esm-framework';
import styles from './overview-card.styles.scss';

export interface OverviewCardProps extends TileProps {
  header: string;
  viewLink: string;
  children?: React.ReactNode;
}

const OverviewCard: React.FC<OverviewCardProps> = ({ header, viewLink, children }) => {
  const { t } = useTranslation();

  return (
    <Layer>
      <Tile className={styles.overviewCard}>
        <div className={styles.headerContainer}>
          <h3 className={styles.heading}>{header}</h3>
          <Button
            className={styles.viewButton}
            kind="ghost"
            renderIcon={(props) => <ArrowRightIcon size={16} {...props} />}
            size="sm"
            onClick={() => navigate({ to: `\${openmrsSpaBase}/${viewLink}` })}
          >
            {t('homeOverviewCardView', 'View')}
          </Button>
        </div>
        <div className={styles.contentContainer}>{children}</div>
      </Tile>
    </Layer>
  );
};

export default OverviewCard;
