/** @module @category UI */
import React from "react";
import { BrowserRouter } from "react-router-dom";

import { ExtensionSlot, useStore } from "@openmrs/esm-react-utils";
import { createGlobalStore } from "@openmrs/esm-state";
import { SideNav, SideNavProps } from "carbon-components-react";
import styles from "./left-nav.module.scss";

interface LeftNavStore {
  slotName: string | null;
  basePath: string;
}

const leftNavStore = createGlobalStore<LeftNavStore>("left-nav", {
  slotName: null,
  basePath: window.spaBase,
});

export function setLeftNav({ name, basePath }) {
  leftNavStore.setState({ slotName: name, basePath });
}

export function unsetLeftNav(name) {
  if (leftNavStore.getState().slotName == name) {
    leftNavStore.setState({ slotName: null });
  }
}

type LeftNavMenuProps = SideNavProps;

export const LeftNavMenu = React.forwardRef<HTMLElement, LeftNavMenuProps>(
  (props, ref) => {
    const { slotName, basePath } = useStore(leftNavStore);
    const currentPath = window.location ?? { pathname: "" };

    return (
      <BrowserRouter>
        <SideNav
          ref={ref}
          expanded
          aria-label="Left navigation"
          className={styles.leftNav}
          {...props}
        >
          <ExtensionSlot extensionSlotName="global-nav-menu-slot" />
          {slotName ? (
            <ExtensionSlot
              extensionSlotName={slotName}
              state={{ basePath, currentPath }}
            />
          ) : null}
        </SideNav>
      </BrowserRouter>
    );
  }
);
