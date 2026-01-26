/** @module @category UI */
import React, { createContext, useCallback, useContext, useMemo, type ComponentProps } from 'react';
import classNames from 'classnames';
import { OverflowMenuItem } from '@carbon/react';
import { useLayoutType, useOnClickOutside } from '@openmrs/esm-react-utils';
import styles from './custom-overflow-menu.module.scss';

interface CustomOverflowMenuContextValue {
  closeMenu: () => void;
}

const CustomOverflowMenuContext = createContext<CustomOverflowMenuContextValue | null>(null);

export function useCustomOverflowMenu() {
  const context = useContext(CustomOverflowMenuContext);
  if (!context) {
    throw new Error('useCustomOverflowMenu must be used within a CustomOverflowMenu');
  }
  return context;
}

interface CustomOverflowMenuProps {
  menuTitle: React.ReactNode;
  children: React.ReactNode;
}

export function CustomOverflowMenu({ menuTitle, children }: CustomOverflowMenuProps) {
  const [menuIsOpen, setMenuIsOpen] = React.useState(false);
  const ref = useOnClickOutside<HTMLDivElement>(() => setMenuIsOpen(false), menuIsOpen);
  const isTablet = useLayoutType() === 'tablet';
  const toggleShowMenu = useCallback(() => setMenuIsOpen((state) => !state), []);
  const closeMenu = useCallback(() => setMenuIsOpen(false), []);
  const contextValue = useMemo(() => ({ closeMenu }), [closeMenu]);

  return (
    <div data-overflow-menu className={classNames('cds--overflow-menu', styles.container)} ref={ref}>
      <button
        className={classNames(
          'cds--btn',
          'cds--btn--ghost',
          'cds--overflow-menu__trigger',
          { 'cds--overflow-menu--open': menuIsOpen },
          styles.overflowMenuButton,
        )}
        aria-haspopup="true"
        aria-expanded={menuIsOpen}
        id="custom-actions-overflow-menu-trigger"
        aria-controls="custom-actions-overflow-menu"
        onClick={toggleShowMenu}
      >
        {menuTitle}
      </button>
      <div
        className={classNames('cds--overflow-menu-options', 'cds--overflow-menu--flip', styles.menu, {
          [styles.show]: menuIsOpen,
        })}
        tabIndex={0}
        data-floating-menu-direction="bottom"
        role="menu"
        aria-labelledby="custom-actions-overflow-menu-trigger"
        id="custom-actions-overflow-menu"
      >
        <ul
          className={classNames('cds--overflow-menu-options__content', { 'cds--overflow-menu-options--lg': isTablet })}
        >
          <CustomOverflowMenuContext.Provider value={contextValue}>{children}</CustomOverflowMenuContext.Provider>
        </ul>
        <span />
      </div>
    </div>
  );
}

type OverflowMenuItemProps = ComponentProps<typeof OverflowMenuItem>;

export function CustomOverflowMenuItem(props: Omit<OverflowMenuItemProps, 'closeMenu'>) {
  const context = useContext(CustomOverflowMenuContext);
  return <OverflowMenuItem {...props} closeMenu={context?.closeMenu} />;
}
