import React from "react";
import { ConfigurableLink } from "@openmrs/esm-framework";

export const createDashboardLink = (db: { title: string }) => {
  const DashboardLink: React.FC<{ basePath: string }> = ({ basePath }) => {
    return (
      <div key={db.title}>
        <ConfigurableLink
          to={`${basePath}/${encodeURIComponent(db.title)}`}
          className="bx--side-nav__link"
        >
          {db.title}
        </ConfigurableLink>
      </div>
    );
  };
  return DashboardLink;
};
