/** @module @category UI */
import React from 'react';
import styles from './page-header.module.scss';
import { useTranslation } from 'react-i18next';
import { useSession } from '@openmrs/esm-framework';

interface PageHeaderProps {
  dashboardTitle: string;
  illustration: React.ReactElement;
  utilities?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ dashboardTitle, illustration, utilities, className }) => {
  const { t } = useTranslation();
  const session = useSession();
  const location = session?.sessionLocation?.display;

  const combineWords = (sentence: string): string => {
    const lowerCaseWords = (match: string) => match.toLowerCase();
    const capitalizeLetter = (_, group1: string) => group1.toUpperCase();
    return sentence.replace(/\b\w+/g, lowerCaseWords).replace(/\s(\w)/g, capitalizeLetter);
  };

  return (
    <div className={className ? className : styles.pageHeader}>
      <div className={styles.leftJustifiedItems}>
        {illustration}
        <div className={styles.pageLabels}>
          <p>{location}</p>
          <p className={styles.pageName}>{t(`${combineWords(dashboardTitle)}`, `${dashboardTitle}`)}</p>
        </div>
      </div>
      <div className={styles.rightJustifiedItems}>{utilities}</div>
    </div>
  );
};
