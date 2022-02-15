import { ExtensionSlot, useExtensionSlotMeta } from "@openmrs/esm-framework";
import React from "react";
import { RouteComponentProps, useRouteMatch } from "react-router-dom";
import { OfflineToolsPageConfig } from "../types";
import trimEnd from "lodash-es/trimEnd";

export interface OfflineToolsPageParams {
  page: string;
}

const OfflineToolsPage: React.FC<
  RouteComponentProps<OfflineToolsPageParams>
> = ({ match }) => {
  const basePath = trimEnd(window.getOpenmrsSpaBase(), "/") + match.url;
  const page = match.params.page;
  const meta = useExtensionSlotMeta<OfflineToolsPageConfig>(
    "offline-tools-page-slot"
  );
  const pageConfig = Object.values(meta).find(
    (pageConfig) => pageConfig.name === page
  );

  if (!pageConfig) {
    return null;
  }

  return (
    <>
      <ExtensionSlot extensionSlotName="breadcrumbs-slot" />
      <ExtensionSlot
        key={pageConfig.slot}
        extensionSlotName={pageConfig.slot}
        state={{ basePath }}
      />
    </>
  );
};

export default OfflineToolsPage;
