import React from "react";
import { Breadcrumb, BreadcrumbItem } from "carbon-components-react";
import { getBreadcrumbsFor } from "@openmrs/esm-api";
import { ConfigurableLink } from "@openmrs/esm-react-utils";

const Breadcrumbs: React.FC = () => {
  const path = location.pathname;
  const breadcrumbs = getBreadcrumbsFor(path);

  return (
    <Breadcrumb>
      {breadcrumbs.map((bc) => (
        <BreadcrumbItem key={bc.settings.path}>
          <ConfigurableLink to={bc.settings.path}>
            {bc.settings.title}
          </ConfigurableLink>
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
};

export default Breadcrumbs;
