import React from "react";
import { ConfigurableLink } from "@openmrs/esm-framework";

export const createDashboardLink = (db: { name: string; title: string }) => {
  const DashboardLink: React.FC<{ basePath: string }> = ({ basePath }) => {
    return (
      <div key={db.name}>
        <ConfigurableLink
          to={`${basePath}/${db.name}`}
          className="bx--side-nav__link"
        >
          {db.title}
        </ConfigurableLink>
      </div>
    );
  };
  return DashboardLink;
};
