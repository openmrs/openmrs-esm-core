import React, { ReactNode } from "react";
import { ExtensionSlot } from "@openmrs/esm-framework";
import styles from "./shared-page-layout.styles.scss";

export interface SharedPageLayoutProps {
  header: string;
  showBreadcrumbs?: boolean;
  primaryActions?: ReactNode;
}

const SharedPageLayout: React.FC<SharedPageLayoutProps> = ({
  header: title,
  showBreadcrumbs = true,
  primaryActions,
  children,
}) => {
  return (
    <>
      {showBreadcrumbs && (
        <ExtensionSlot extensionSlotName="breadcrumbs-slot" />
      )}
      <header className={styles.pageHeaderContainer}>
        <h1 className={styles.pageHeader}>{title}</h1>
        {primaryActions}
      </header>
      {children}
    </>
  );
};

export default SharedPageLayout;
