import React from 'react';
import { StructuredListBody, StructuredListCell, StructuredListRow, StructuredListWrapper } from '@carbon/react';
import styles from './layout.styles.scss';

export interface SubtreeProps {
  leaf: boolean;
  label: string;
  children: React.ReactNode;
  onMouseEnter?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export const Subtree = React.forwardRef<HTMLSpanElement, SubtreeProps>(
  ({ leaf, label, children, onMouseEnter, onMouseLeave }: SubtreeProps, ref) => {
    return leaf ? (
      <StructuredListRow className={styles.structuredListRow} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <StructuredListCell className={styles.labelCell}>
          <span className={styles.label} ref={ref}>
            {label}
          </span>
        </StructuredListCell>
        <StructuredListCell>{children}</StructuredListCell>
      </StructuredListRow>
    ) : (
      <>
        <StructuredListRow className={styles.structuredListRow} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
          <StructuredListCell className={styles.labelCell}>
            <span className={styles.label} ref={ref}>
              {label}
            </span>
          </StructuredListCell>
          <StructuredListCell />
        </StructuredListRow>
        <StructuredListRow className={styles.structuredListRow}>
          <StructuredListCell />
          <StructuredListCell className={styles.subtreeCell}>
            <StructuredListWrapper className={styles.structuredList}>
              <StructuredListBody>{children}</StructuredListBody>
            </StructuredListWrapper>
          </StructuredListCell>
        </StructuredListRow>
      </>
    );
  },
);
