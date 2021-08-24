import React from "react";
import { ExtensionSlot } from "@openmrs/esm-framework";
import styles from "./shared-page-layout.styles.scss";

export interface SharedPageLayoutProps {
  header: string;
  showBreadcrumbs?: boolean;
}

const SharedPageLayout: React.FC<SharedPageLayoutProps> = ({
  header: title,
  showBreadcrumbs = true,
  children,
}) => {
  return (
    <>
      {showBreadcrumbs && (
        <ExtensionSlot extensionSlotName="breadcrumbs-slot" />
      )}
      <h1 className={styles.pageHeader}>{title}</h1>
      {children}
    </>
  );
};

export default SharedPageLayout;
