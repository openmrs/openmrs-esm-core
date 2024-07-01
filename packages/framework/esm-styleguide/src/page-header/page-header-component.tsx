/** @module @category UI */
import React from 'react';
import styles from './reusable-page-header.scss';
import { useTranslation } from 'react-i18next';
import { ExtensionSlot } from '@openmrs/esm-framework';

interface pageHeaderProps {
  pageTitle: string;
  illustration: React.ReactElement;
}

export const PageHeader: React.FC<pageHeaderProps> = ({ pageTitle, illustration }) => {
  const { t } = useTranslation();

  const combineWords = (sentence: string): string => {
    const lowerCaseWords = (match: string) => match.toLowerCase();
    const capitalizeLetter = (_, group1: string) => group1.toUpperCase();
    return sentence.replace(/\b\w+/g, lowerCaseWords).replace(/\s(\w)/g, capitalizeLetter);
  };

  return (
    <div className={styles.pageHeader}>
      <div className={styles.leftJustifiedItems}>
        {illustration}
        <div className={styles.pageLabels}>
          <p>{t(`${combineWords(pageTitle)}`, `${pageTitle}`)}</p>
          <p className={styles.pageName}>{t(`${combineWords(pageTitle)}`, `${pageTitle}`)}</p>
        </div>
      </div>
      <ExtensionSlot name="page-header-utilities-slot" className={styles.rightJustifiedItems} />
    </div>
  );
};
