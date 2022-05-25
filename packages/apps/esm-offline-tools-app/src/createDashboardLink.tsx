import React from "react";
import { ConfigurableLink } from "@openmrs/esm-framework";

export const createDashboardLink = (db: { name: string }) => {
  const DashboardLink: React.FC<{ basePath: string }> = ({ basePath }) => {
    return (
      <div key={db.name}>
        <ConfigurableLink
          to={`${basePath}/${encodeURIComponent(db.name)}`}
          className="cds--side-nav__link"
        >
          {db.name}
        </ConfigurableLink>
      </div>
    );
  };
  return DashboardLink;
};
