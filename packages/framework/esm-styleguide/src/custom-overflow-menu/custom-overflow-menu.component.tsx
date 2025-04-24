/** @module @category UI */
import React, { useCallback } from 'react';
import classNames from 'classnames';
import { useLayoutType, useOnClickOutside } from '@openmrs/esm-react-utils';
import styles from './custom-overflow-menu.module.scss';

interface CustomOverflowMenuProps {
  menuTitle: React.ReactNode;
  children: React.ReactNode;
}

export function CustomOverflowMenu({ menuTitle, children }: CustomOverflowMenuProps) {
  const [menuIsOpen, setMenuIsOpen] = React.useState(false);
  const ref = useOnClickOutside<HTMLDivElement>(() => setMenuIsOpen(false), menuIsOpen);
  const isTablet = useLayoutType() === 'tablet';
  const toggleShowMenu = useCallback(() => setMenuIsOpen((state) => !state), []);

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
          {children}
        </ul>
        <span />
      </div>
    </div>
  );
}
