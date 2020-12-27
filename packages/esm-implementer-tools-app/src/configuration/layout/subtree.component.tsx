import React from "react";
import {
  StructuredListBody,
  StructuredListCell,
  StructuredListRow,
  StructuredListWrapper,
} from "carbon-components-react";
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
      </StructuredListRow>
      <StructuredListRow>
        <StructuredListWrapper
          className={`${styles.structuredList} ${styles.subtreeContainer}`}
        >
          <StructuredListBody>{children}</StructuredListBody>
        </StructuredListWrapper>
      </StructuredListRow>
    </>
  );
}
