import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
} from "carbon-components-react/es/components/Breadcrumb";
import { getBreadcrumbsFor, ConfigurableLink } from "@openmrs/esm-framework";

function getPath(path: string, params: Array<string>) {
  const parts = [...params];
  return path.replace(/:([A-Za-z0-9_]+)/g, (s) => parts.shift() ?? s);
}

function getParams(path: string, matcher: RegExp) {
  const match = matcher?.exec(path);

  if (match) {
    const [, ...params] = match;
    return params;
  }

  return [];
}

const breadcrumbsStyle: React.CSSProperties = { padding: "1rem" };

const Breadcrumbs: React.FC = () => {
  const [path, setPath] = React.useState(location.pathname);
  const breadcrumbs = getBreadcrumbsFor(path);
  const currentBc = breadcrumbs[breadcrumbs.length - 1];
  const params = getParams(path, currentBc?.matcher);

  React.useEffect(() => {
    const handler = () => setPath(location.pathname);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  if (breadcrumbs.length > 4) {
    breadcrumbs.splice(1, breadcrumbs.length - 3, {
      ...breadcrumbs[1],
      settings: {
        ...breadcrumbs[1].settings,
        title: "...",
      },
    });
  }

  return (
    <Breadcrumb style={breadcrumbsStyle}>
      {breadcrumbs.map((bc) => (
        <BreadcrumbItem key={bc.settings.path}>
          <ConfigurableLink to={getPath(bc.settings.path, params)}>
            {bc.settings.title}
          </ConfigurableLink>
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
};

export default Breadcrumbs;
