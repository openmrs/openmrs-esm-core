import React, { useState } from "react";
import {
  Tablet,
  Laptop,
  Download,
  Document,
  Development,
  Touch_1,
} from "@carbon/react/icons";
import {
  Layer,
  Header,
  HeaderContainer,
  Tile,
  Theme,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SideNav,
  HeaderMenuItem,
  HeaderNavigation,
  HeaderPanel,
} from "@carbon/react";
import { BrowserRouter } from "react-router-dom";
import { ConfigurableLink, useConfig, useStore } from "@openmrs/esm-framework";
import { implementerToolsStore } from "./store";
import styles from "./implementer-tools.styles.scss";
import { useTranslation } from "react-i18next";

const ImplementerNavbar: React.FC = () => {
  const { isOpen } = useStore(implementerToolsStore);
  const { t } = useTranslation();
  const [showPages, setShowPages] = useState(false);
  const { logo } = useConfig();

  return isOpen ? (
    <BrowserRouter>
      <div>
        <HeaderContainer
          render={({ isSideNavExpanded, onClickSideNavExpand }) => (
            <>
              <Theme theme="g90">
                <Header
                  className={styles.implementerToolsHeader}
                  aria-label="OpenMRS Implementer Tools"
                >
                  <ConfigurableLink
                    className={styles.navLogo}
                    to="${openmrsSpaBase}/home"
                  >
                    <div className={styles.spacedLogo}>
                      {logo?.src ? (
                        <img
                          className={styles.logo}
                          src={logo.src}
                          alt={logo.alt}
                          width={110}
                          height={40}
                        />
                      ) : logo?.name ? (
                        logo.name
                      ) : (
                        <svg role="img" width={110} height={40}>
                          <use xlinkHref="#omrs-logo-white"></use>
                        </svg>
                      )}
                    </div>
                  </ConfigurableLink>
                  <HeaderNavigation>
                    <HeaderMenuItem>UI editor</HeaderMenuItem>
                    <HeaderMenuItem>Module Manager</HeaderMenuItem>
                  </HeaderNavigation>
                  <HeaderGlobalBar>
                    <HeaderGlobalAction
                      className={styles.implementerToolsGlobalBar}
                    >
                      <Tablet size={20} />
                    </HeaderGlobalAction>
                    <HeaderGlobalAction
                      className={styles.implementerToolsGlobalBar}
                    >
                      <Laptop size={20} />
                    </HeaderGlobalAction>
                    <HeaderGlobalAction
                      className={styles.implementerToolsGlobalBar}
                      aria-label="Downloads"
                      onClick={() => {}}
                    >
                      <Download size={20} />
                    </HeaderGlobalAction>
                  </HeaderGlobalBar>
                  <div className={styles.sideRailNav}>
                    <div>
                      <Document
                        onClick={() => {
                          setShowPages(!showPages);
                        }}
                        size={20}
                      />
                    </div>
                    <div>
                      <Development
                        onClick={() => {
                          setShowPages(!showPages);
                        }}
                        size={20}
                      />
                    </div>
                  </div>
                  <SideNav
                    className={styles.sideNavComponents}
                    isFixedNav
                    expanded={showPages && isOpen}
                  >
                    <p>
                      Select an element from the canvas to activate this panel
                    </p>
                  </SideNav>
                  <HeaderPanel style={{ backgroundColor: "#393939" }} expanded>
                    <Layer className={styles.selectElement}>
                      <Tile className={styles.selectionText}>
                        <Touch_1 size={30} />
                        <h5>Nothing selected</h5>
                        <p>
                          Select an element from the canvas to activate this
                          panel
                        </p>
                      </Tile>
                    </Layer>
                  </HeaderPanel>
                </Header>
              </Theme>
            </>
          )}
        />
      </div>
    </BrowserRouter>
  ) : null;
};
export default ImplementerNavbar;
