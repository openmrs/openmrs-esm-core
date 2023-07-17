import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Configuration } from "../configuration/configuration.component";
import type { FrontendModule } from "../types";
import { FrontendModules } from "../frontend-modules/frontend-modules.component";
import { BackendDependencies } from "../backend-dependencies/backend-dependencies.component";
import type { ResolvedDependenciesModule } from "../backend-dependencies/openmrs-backend-dependencies";
import styles from "./popup.styles.scss";
import { FeatureFlags } from "../feature-flags/feature-flags.component";
import ImplementerNavbar from "../global-implementer-tools-navbar";
import { useStore, useLayoutType } from "@openmrs/esm-framework";
import { implementerToolsStore } from "../store";

interface DevToolsPopupProps {
  close(): void;
  frontendModules: Array<FrontendModule>;
  backendDependencies: Array<ResolvedDependenciesModule>;
  visibleTabIndex?: number;
}

export default function Popup({
  close,
  frontendModules,
  backendDependencies,
}: DevToolsPopupProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const isTablet = useLayoutType() === "tablet";

  const tabContent = useMemo(() => {
    if (activeTab == 0) {
      return <Configuration />;
    } else if (activeTab == 1) {
      return <FrontendModules frontendModules={frontendModules} />;
    } else if (activeTab == 2) {
      return <BackendDependencies backendDependencies={backendDependencies} />;
    } else {
      return <FeatureFlags />;
    }
  }, [activeTab, backendDependencies, frontendModules]);

  const currentPageURL = window.location.href;
  const { isOpen } = useStore(implementerToolsStore);

  const iframeContent = useMemo(() => {
    const homeDivElement = document.querySelector(
      `div[id^="single-spa-application:@openmrs/esm-home-app-page"]`
    ) as HTMLDivElement;
    const applyStyles = () => {
      if (homeDivElement) {
        if (isOpen) {
          homeDivElement.style.display = "none";
        } else {
        }
      }
    };

    const removeImplementerToolsDiv = (iframeBody: HTMLElement | undefined) => {
      const divElements = iframeBody?.querySelectorAll(
        `div[id^="single-spa-application:@openmrs/esm-implementer-tools-app-page"]`
      ) as Array<HTMLDivElement> | undefined;
      divElements?.forEach((div) => {
        div.remove();
      });
    };
    return (
      <div style={{ backgroundColor: "#525252" }}>
        <div
          className={
            isTablet ? styles.iframeTabletLayout : styles.iframeDesktopLayout
          }
        >
          <iframe
            className={styles.implementerToolsIframe}
            title="implementer-tools-iframe"
            src={currentPageURL}
            width="100%"
            loading="lazy"
            onLoad={(event) => {
              const iframe = event.target as HTMLIFrameElement;
              const contentWindow = iframe.contentWindow;

              const iframeMutationObserver = new MutationObserver(() => {
                // Do something before DOM updates or elements are added within the iframe
                // For example:
                removeImplementerToolsDiv(contentWindow?.document?.body);
              });

              iframeMutationObserver.observe(contentWindow!.document, {
                childList: true,
                subtree: true,
              });

              if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", applyStyles);
              } else {
                applyStyles();
              }
            }}
          />
        </div>
      </div>
    );
  }, [currentPageURL, isOpen, isTablet]);

  return (
    <>
      <ImplementerNavbar />
      {iframeContent}
    </>
  );
}
