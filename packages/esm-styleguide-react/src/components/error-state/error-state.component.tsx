import React from "react";

import { Tile } from "carbon-components-react";
import styles from "./error-state.scss";

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  status,
  headerText,
  message,
}) => {
  return (
    <Tile light className={styles.tile}>
      <h1 className={styles.heading}>{headerText}</h1>
      <p className={styles.errorMessage}>{`${error} ${status}: ${message}`}</p>
    </Tile>
  );
};

export interface ErrorStateProps {
  /**
   * Error header text
   */
  headerText: string;
  /**
   * Error title
   */
  error: string;
  /**
   * Error status
   */
  status: string;
  /**
   * Error message
   */
  message: string;
}
