import React from "react";
import {
  StructuredListBody,
  StructuredListCell,
  StructuredListRow,
  StructuredListWrapper,
} from "@carbon/react";
import styles from "./layout.styles.css";

export interface SubtreeProps {
  leaf: boolean;
  label: string;
  children: React.ReactNode;
  onMouseEnter?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export function Subtree({
  leaf,
  label,
  children,
  onMouseEnter,
  onMouseLeave,
}: SubtreeProps) {
  return leaf ? (
    <StructuredListRow
      className={styles.structuredListRow}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <StructuredListCell className={styles.labelCell}>
        {label}
      </StructuredListCell>
      <StructuredListCell>{children}</StructuredListCell>
    </StructuredListRow>
  ) : (
    <>
      <StructuredListRow
        className={styles.structuredListRow}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <StructuredListCell className={styles.labelCell}>
          {label}
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
}
