import React from "react";

import { Link, Tile } from "carbon-components-react";
import EmptyDataIllustration from "./empty-data-illustration.component";
import styles from "./empty-state.scss";

/**
 * Component for rendering empty state of the enclosing component
 * @param props
 */
export const EmptyState: React.FC<EmptyStateProps> = (props) => {
  return (
    <Tile light className={styles.tile}>
      <h1 className={styles.heading}>{props.headerTitle}</h1>
      <EmptyDataIllustration />
      <p className={styles.content}>{props.message}</p>
      {props.launchForm && (
        <p className={styles.action}>
          <Link onClick={() => props.launchForm?.()}>
            {props.launchFormText}
          </Link>
        </p>
      )}
    </Tile>
  );
};

export interface EmptyStateProps {
  /**
   * Empty state title
   */
  headerTitle: string;
  /**
   * Empty state message
   */
  message: string;
  /**
   * Optional callback for rendering the form that records new entries
   * @default null
   */
  launchForm?: Function;
  /**
   * Text to render for the launch-form widget
   */
  launchFormText?: string;
}
