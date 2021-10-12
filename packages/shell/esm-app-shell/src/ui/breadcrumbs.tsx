import React, { useEffect, useState } from "react";
import { Breadcrumb, BreadcrumbItem } from "carbon-components-react";
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
  bc: BreadcrumbRegistration;
  params: any;
}

export const CustomBreadcrumbItem: React.FC<CustomBreadcrumbItemProps> = ({
  bc,
  params,
}) => {
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (typeof bc.settings.title === "function") {
      if (bc.settings.title?.constructor?.name === "AsyncFunction") {
        (bc.settings.title(params) as Promise<string>).then((res) =>
          setTitle(res)
        );
      } else {
        setTitle(bc.settings.title(params) as string);
      }
    } else {
      setTitle(bc.settings.title);
    }
  }, [bc, params]);

  return (
    <BreadcrumbItem key={bc.settings.path}>
      <ConfigurableLink to={getPath(bc.settings.path, params)}>
        {title}
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
      {breadcrumbs.map((bc) => (
        <CustomBreadcrumbItem bc={bc} params={params} />
      ))}
    </Breadcrumb>
  );
};

export default Breadcrumbs;
