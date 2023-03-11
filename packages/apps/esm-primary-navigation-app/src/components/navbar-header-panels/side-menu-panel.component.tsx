import React, { useEffect, useRef } from "react";
import { LeftNavMenu } from "@openmrs/esm-framework";

interface SideMenuPanelProps {
  expanded: boolean;
  hidePanel: () => void;
}

const SideMenuPanel: React.FC<SideMenuPanelProps> = ({
  expanded,
  hidePanel,
}) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef?.current && !menuRef.current.contains(event.target)) {
        hidePanel();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuRef, hidePanel]);

  useEffect(() => {
    window.addEventListener("popstate", hidePanel);
    return window.addEventListener("popstate", hidePanel);
  }, [hidePanel]);

  return expanded && <LeftNavMenu ref={menuRef} isChildOfHeader />;
};

export default SideMenuPanel;
