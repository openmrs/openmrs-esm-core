import React, { useEffect, useMemo, useState } from "react";
import last from "lodash-es/last";
import { BrowserRouter, useLocation } from "react-router-dom";
import { ConfigurableLink } from "@openmrs/esm-framework";
interface DashboardLinkConfig {
  basePath?: string;
  path: string;
  title: string | (() => string | Promise<string>);
}

const DashboardLink: React.FC<DashboardLinkConfig> = ({
  basePath,
  path,
  title,
}) => {
  const location = useLocation();
  const navLink = useMemo(
    () => decodeURIComponent(last(location.pathname.split("/"))),
    [location.pathname]
  );
  const [resolvedTitle, setResolvedTitle] = useState<string | undefined>();

  useEffect(() => {
    if (typeof title === "function") {
      Promise.resolve(title())
        .then((resolvedValue) => {
          setResolvedTitle(resolvedValue);
        })
        .catch((e: Error) => {
          throw e;
        });
    } else {
      setResolvedTitle(title);
    }
  }, [title]);

  const activeClassName =
    path === navLink ? "active-left-nav-link" : "non-active";

  return (
    title &&
    resolvedTitle && (
      <div key={path} className={activeClassName}>
        <ConfigurableLink
          to={`${basePath}/${encodeURIComponent(path)}`}
          className={`cds--side-nav__link ${activeClassName}`}
        >
          {resolvedTitle}
        </ConfigurableLink>
      </div>
    )
  );
};

export const createDashboardLink = (db: DashboardLinkConfig) => {
  return ({ basePath }: { basePath: string }) => (
    <BrowserRouter>
      <DashboardLink basePath={basePath} path={db.path} title={db.title} />
    </BrowserRouter>
  );
};
