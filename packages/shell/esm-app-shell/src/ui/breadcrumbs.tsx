import React, { useEffect, useState } from "react";
import { Breadcrumb, BreadcrumbItem, InlineLoading } from "@carbon/react";
import {
  getBreadcrumbsFor,
  ConfigurableLink,
  BreadcrumbRegistration,
} from "@openmrs/esm-framework";

function getPath(path: string, params: Array<string>) {
  const parts = [...params];
  return path.replace(/:([A-Za-z0-9_]+)/g, (s) => parts.shift() ?? s);
}

function getParams(path: string, matcher: RegExp) {
  const match = matcher?.exec(path);

  if (match) {
    const [, ...params] = match;
    return params;
  } else {
    const segments = path.split("/");
    segments.pop();

    if (segments.length > 1) {
      const newPath = segments.join("/");
      return getParams(newPath, matcher);
    }
  }

  return [];
}

interface CustomBreadcrumbItemProps {
  breadcrumbRegistration: BreadcrumbRegistration;
  params: any;
}

export const CustomBreadcrumbItem: React.FC<CustomBreadcrumbItemProps> = ({
  breadcrumbRegistration,
  params,
}) => {
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (typeof breadcrumbRegistration.settings.title === "function") {
      Promise.resolve(breadcrumbRegistration.settings.title(params)).then(
        (res) => setTitle(res)
      );
    } else {
      setTitle(breadcrumbRegistration.settings.title);
    }
  }, [breadcrumbRegistration, params]);

  return (
    <BreadcrumbItem key={breadcrumbRegistration.settings.path}>
      <ConfigurableLink
        to={getPath(breadcrumbRegistration.settings.path, params)}
      >
        {title ? title : <InlineLoading />}
      </ConfigurableLink>
    </BreadcrumbItem>
  );
};

export const Breadcrumbs: React.FC = () => {
  const [path, setPath] = useState(location.pathname);
  const breadcrumbs = getBreadcrumbsFor(path);
  const currentBc = breadcrumbs[breadcrumbs.length - 1];
  const params = getParams(path, currentBc?.matcher);

  useEffect(() => {
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
    <Breadcrumb className="breadcrumbs-container">
      {breadcrumbs.map((bc, index) => (
        <CustomBreadcrumbItem
          key={`breadcrumb-item-${index}`}
          breadcrumbRegistration={bc}
          params={params}
        />
      ))}
    </Breadcrumb>
  );
};

export default Breadcrumbs;
