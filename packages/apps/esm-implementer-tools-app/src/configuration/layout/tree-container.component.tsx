import React, { ReactNode } from "react";
import {
  StructuredListBody,
  StructuredListWrapper,
} from "carbon-components-react";
import styles from "./layout.styles.css";

export interface TreeContainerProps {
  children: ReactNode;
}

export function TreeContainer({ children }: TreeContainerProps) {
  return (
    <StructuredListWrapper className={styles.structuredList}>
      <StructuredListBody>{children}</StructuredListBody>
    </StructuredListWrapper>
  );
}
