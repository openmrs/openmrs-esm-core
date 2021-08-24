import React from "react";
import { ConfigurableLink } from "@openmrs/esm-framework";
import { useTranslation } from "react-i18next";
import { routes } from "../constants";

const links = [
  {
    to: routes.offlineTools,
    translationKey: "navLinkHome",
    translationDefaultValue: "Home",
  },
  {
    to: routes.offlineToolsPatients,
    translationKey: "navLinkPatients",
    translationDefaultValue: "Patients",
  },
];

const OfflineToolsNavMenu: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      {links.map((link) => (
        <div key={link.to}>
          <ConfigurableLink
            to={"${openmrsSpaBase}" + link.to}
            className="bx--side-nav__link"
          >
            {t(link.translationKey, link.translationDefaultValue)}
          </ConfigurableLink>
        </div>
      ))}
    </>
  );
};

export default OfflineToolsNavMenu;
