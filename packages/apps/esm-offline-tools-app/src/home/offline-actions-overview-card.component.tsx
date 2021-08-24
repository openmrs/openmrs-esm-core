import React from "react";
import { useTranslation } from "react-i18next";
import HeaderedQuickInfo from "./headered-quick-info.component";
import OverviewCard from "./overview-card.component";
import type { TileProps } from "carbon-components-react/lib/components/Tile/Tile";

export interface OfflineActionsOverviewCardProps extends TileProps {}

const OfflineActionsOverviewCard: React.FC<OfflineActionsOverviewCardProps> = (
  props
) => {
  const { t } = useTranslation();

  return (
    <OverviewCard
      header={t("homeOverviewCardOfflineActionsHeader", "Offline actions")}
      viewLink="#"
      {...props}
    >
      <HeaderedQuickInfo
        header={t(
          "homeOverviewCardOfflineActionsFailedToUpload",
          "Failed to upload"
        )}
        content="(tbd)"
      />
      <HeaderedQuickInfo
        header={t(
          "homeOverviewCardOfflineActionsPendingUpload",
          "Pending upload"
        )}
        content="(tbd)"
      />
      <HeaderedQuickInfo
        header={t(
          "homeOverviewCardOfflineActionsUploadedThisWeek",
          "Uploaded this week"
        )}
        content="(tbd)"
      />
    </OverviewCard>
  );
};

export default OfflineActionsOverviewCard;
