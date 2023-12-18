import React from 'react';
import { ExtensionSlot } from '@openmrs/esm-framework';
import styles from './cards-container.styles.scss';

/**
 * Renders the quick-info cards of the offline tools dashboard.
 *
 * The cards are provided via extensions and aligned in a grid layout by this component.
 */
const CardsContainer: React.FC = () => {
  return <ExtensionSlot name="offline-tools-dashboard-cards" className={styles.overviewCardContainer} />;
};

export default CardsContainer;
