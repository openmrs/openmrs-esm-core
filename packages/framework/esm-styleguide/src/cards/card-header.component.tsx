import React from 'react';
import classNames from 'classnames';
import { useLayoutType } from '@openmrs/esm-react-utils';
import styles from './card-header.module.scss';

export interface CardHeaderProps {
  /** The title for this card. This must be a pre-translated string. */
  title: string;
  /** The contents of the card header to render if any. */
  children?: React.ReactNode;
}

/**
 * Re-usable header component for O3-style cards, like those found on the patient chart
 */
export function CardHeader({ title, children }: CardHeaderProps) {
  const isTablet = useLayoutType() === 'tablet';

  return (
    <div
      className={classNames({
        [styles.tabletHeader]: isTablet,
        [styles.desktopHeader]: !isTablet,
      })}
    >
      <h4>{title}</h4>
      {children}
    </div>
  );
}
