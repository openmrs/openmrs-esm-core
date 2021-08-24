import React from "react";
import { useTranslation } from "react-i18next";
import HeaderedQuickInfo from "./headered-quick-info.component";
import OverviewCard from "./overview-card.component";

const FormsOverviewCard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <OverviewCard
      header={t("homeOverviewCardFormsHeader", "Forms")}
      viewLink="#"
    >
      <HeaderedQuickInfo
        header={t("homeOverviewCardFormsDownloaded", "Available offline")}
        content="(tbd)"
      />
    </OverviewCard>
  );
};

export default FormsOverviewCard;
