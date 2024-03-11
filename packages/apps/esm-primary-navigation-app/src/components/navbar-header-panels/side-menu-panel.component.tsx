import React, { useEffect } from 'react';
import { LeftNavMenu, useOnClickOutside } from '@openmrs/esm-framework';

interface SideMenuPanelProps {
  expanded: boolean;
  hidePanel: Parameters<typeof useOnClickOutside>[0];
}

const SideMenuPanel: React.FC<SideMenuPanelProps> = ({ expanded, hidePanel }) => {
  const menuRef = useOnClickOutside(hidePanel, expanded);

  useEffect(() => {
    window.addEventListener('popstate', hidePanel);
    return () => window.removeEventListener('popstate', hidePanel);
  }, [hidePanel]);

  return expanded && <LeftNavMenu ref={menuRef} isChildOfHeader />;
};

export default SideMenuPanel;
