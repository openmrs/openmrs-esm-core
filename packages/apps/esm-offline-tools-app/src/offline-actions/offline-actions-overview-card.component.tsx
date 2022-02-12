import React from "react";
import { useTranslation } from "react-i18next";
import { usePendingSyncItems } from "../hooks/offline-actions";
import { routes } from "../constants";
import HeaderedQuickInfo from "../components/headered-quick-info.component";
import OverviewCard from "../components/overview-card.component";

const OfflineActionsOverviewCard: React.FC = () => {
  const { t } = useTranslation();
  const { data } = usePendingSyncItems();

  return (
    <OverviewCard
      header={t("homeOverviewCardOfflineActionsHeader", "Offline actions")}
      viewLink={routes.offlineToolsActions}
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
