import React from "react";
import { useTranslation } from "react-i18next";
import HeaderedQuickInfo from "./headered-quick-info.component";
import OverviewCard from "./overview-card.component";
import type { TileProps } from "carbon-components-react";
import { usePendingSyncItems } from "../hooks/offline-actions";
import { routes } from "../constants";

export interface OfflineActionsOverviewCardProps extends TileProps {}

const OfflineActionsOverviewCard: React.FC<OfflineActionsOverviewCardProps> = (
  props
) => {
  const { t } = useTranslation();
  const { data } = usePendingSyncItems();

  return (
    <OverviewCard
      header={t("homeOverviewCardOfflineActionsHeader", "Offline actions")}
      viewLink={routes.offlineToolsActions}
      {...props}
    >
      <HeaderedQuickInfo
        header={t(
          "homeOverviewCardOfflineActionsFailedToUpload",
          "Failed to upload"
        )}
        isLoading={!data}
        content={<>{data?.filter((x) => x.lastError).length}</>}
      />
      <HeaderedQuickInfo
        header={t(
          "homeOverviewCardOfflineActionsPendingUpload",
          "Pending upload"
        )}
        isLoading={!data}
        content={<>{data?.length}</>}
      />
    </OverviewCard>
  );
};

export default OfflineActionsOverviewCard;
