import React, { useMemo } from "react";
import last from "lodash-es/last";
import { BrowserRouter, useLocation } from "react-router-dom";
import { ConfigurableLink } from "@openmrs/esm-framework";
import styles from "./dashboard-link.scss";

interface DashboardLinkConfig {
  title: string;
}

const DashboardLink: React.FC<{ basePath: string; title: string }> = ({
  basePath,
  title,
}) => {
  const location = useLocation();
  const navLink = useMemo(
    () => decodeURIComponent(last(location.pathname.split("/"))),
    [location.pathname]
  );

  const activeClassName =
    title === navLink ? "active-left-nav-link" : "non-active";

  return (
    <div key={title} className={activeClassName}>
      <ConfigurableLink
        to={`${basePath}/${encodeURIComponent(title)}`}
        className={"cds--side-nav__link " + styles.link}
      >
        {title}
      </ConfigurableLink>
    </div>
  );
};

export const createDashboardLink = (db: DashboardLinkConfig) => {
  return ({ basePath }: { basePath: string }) => (
    <BrowserRouter>
      <DashboardLink title={db.title} basePath={basePath} />
    </BrowserRouter>
  );
};
