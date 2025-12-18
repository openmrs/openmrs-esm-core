import React, { useEffect } from 'react';
import { isDesktop, LeftNavMenu, useLayoutType, useLeftNavStore, useOnClickOutside } from '@openmrs/esm-framework';
import { createPortal } from 'react-dom';

interface SideMenuPanelProps {
  expanded: boolean;
  hidePanel: Parameters<typeof useOnClickOutside>[0];
}

/**
 * This is the menu that pops up when clicking on the hamburger button
 * on the top nav. It's also responsible for rendering the left nav
 * in desktop mode (via a react portal).
 */
const SideMenuPanel: React.FC<SideMenuPanelProps> = ({ expanded, hidePanel }) => {
  const menuRef = useOnClickOutside(hidePanel, expanded);

  useEffect(() => {
    window.addEventListener('popstate', hidePanel);
    return () => window.removeEventListener('popstate', hidePanel);
  }, [hidePanel]);
  const layout = useLayoutType();
  const { mode } = useLeftNavStore();

  const leftNavContainer = window.document.getElementById('omrs-left-nav-container');
  return (
    <>
      {(!isDesktop(layout) || mode === 'collapsed') && expanded && <LeftNavMenu ref={menuRef} isChildOfHeader />}
      {isDesktop(layout) &&
        mode === 'normal' &&
        leftNavContainer &&
        createPortal(<LeftNavMenu ref={menuRef} isChildOfHeader />, leftNavContainer)}
    </>
  );
};

export default SideMenuPanel;
