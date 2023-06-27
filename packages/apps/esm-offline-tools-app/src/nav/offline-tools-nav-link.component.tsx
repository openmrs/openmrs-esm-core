import React from "react";
import { ConfigurableLink } from "@openmrs/esm-framework";
import { routes } from "../constants";

interface OfflineToolsNavLinkProps {
  page?: string;
  title: string;
}

export default function OfflineToolsNavLink({
  page,
  title,
}: OfflineToolsNavLinkProps) {
  return (
    <div key={page}>
      <ConfigurableLink
        to={
          "${openmrsSpaBase}/" + routes.offlineTools + (page ? `/${page}` : "")
        }
        className="cds--side-nav__link"
      >
        {title}
      </ConfigurableLink>
    </div>
  );
}
