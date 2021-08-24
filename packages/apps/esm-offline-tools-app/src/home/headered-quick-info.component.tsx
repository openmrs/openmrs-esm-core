import React, { ReactNode } from "react";
import styles from "./headered-quick-info.styles.scss";

export interface HeaderedQuickInfoProps {
  header: string;
  content: ReactNode;
}

const HeaderedQuickInfo: React.FC<HeaderedQuickInfoProps> = ({
  header,
  content,
}) => {
  return (
    <div>
      <h4 className={styles.label01}>{header}</h4>
      <span className={styles.productiveHeading04}>{content}</span>
    </div>
  );
};

export default HeaderedQuickInfo;
