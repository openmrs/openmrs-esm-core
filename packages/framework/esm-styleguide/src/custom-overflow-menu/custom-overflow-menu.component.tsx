/** @module @category UI */
import React, {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  type ComponentProps,
} from 'react';
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
  /** The content to display as the menu trigger button. */
  menuTitle: React.ReactNode;
  /** The menu items to display when the menu is open. */
  children: React.ReactNode;
}

/**
 * A custom overflow menu that supports a text/icon trigger button instead of
 * Carbon's icon-only OverflowMenu trigger. Uses CSS-based show/hide rather
 * than Carbon's FloatingMenu portal, so keyboard behavior (Escape, arrow keys,
 * auto-focus) is implemented here to match the WAI-ARIA menu button pattern.
 */
export function CustomOverflowMenu({ menuTitle, children }: CustomOverflowMenuProps) {
  const [menuIsOpen, setMenuIsOpen] = React.useState(false);
  const ref = useOnClickOutside<HTMLDivElement>(() => setMenuIsOpen(false), menuIsOpen);
  const isTablet = useLayoutType() === 'tablet';
  const toggleShowMenu = useCallback(() => setMenuIsOpen((state) => !state), []);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const uniqueId = useId();
  const triggerId = `custom-overflow-menu-trigger-${uniqueId}`;
  const menuId = `custom-overflow-menu-${uniqueId}`;

  const closeMenuAndFocusTrigger = useCallback(() => {
    setMenuIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  const contextValue = useMemo(() => ({ closeMenu: closeMenuAndFocusTrigger }), [closeMenuAndFocusTrigger]);

  const handleEscapeKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape' && menuIsOpen) {
        e.stopPropagation();
        closeMenuAndFocusTrigger();
      }
    },
    [closeMenuAndFocusTrigger, menuIsOpen],
  );

  const childArray = Children.toArray(children);

  useEffect(() => {
    if (menuIsOpen && menuRef.current) {
      const firstItem = menuRef.current.querySelector<HTMLElement>('[role="menuitem"]:not([disabled])');
      firstItem?.focus();
    }
  }, [menuIsOpen]);

  const handleOverflowMenuItemFocus = useCallback(
    ({ currentIndex, direction }: { currentIndex?: number; direction: number }) => {
      const enabledItems = menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])');
      if (!enabledItems?.length) {
        return;
      }

      const activeItem =
        (document.activeElement?.closest?.('[role="menuitem"]') as HTMLElement) ?? document.activeElement;
      const currentPos = Array.from(enabledItems).indexOf(activeItem as HTMLElement);
      if (currentPos === -1) {
        enabledItems[direction > 0 ? 0 : enabledItems.length - 1]?.focus();
        return;
      }

      const nextPos = currentPos + direction;
      const wrappedPos = nextPos < 0 ? enabledItems.length - 1 : nextPos >= enabledItems.length ? 0 : nextPos;
      enabledItems[wrappedPos]?.focus();
    },
    [],
  );

  const enrichedChildren = childArray.map((child, index) => {
    if (isValidElement(child)) {
      return cloneElement(child as React.ReactElement<any>, {
        closeMenu: closeMenuAndFocusTrigger,
        handleOverflowMenuItemFocus,
        index,
      });
    }
    return child;
  });

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
        aria-controls={menuId}
        aria-expanded={menuIsOpen}
        aria-haspopup="true"
        id={triggerId}
        onClick={toggleShowMenu}
        onKeyDown={handleEscapeKey}
        ref={triggerRef}
      >
        {menuTitle}
      </button>
      <div
        className={classNames('cds--overflow-menu-options', 'cds--overflow-menu--flip', styles.menu, {
          [styles.show]: menuIsOpen,
        })}
        aria-labelledby={triggerId}
        data-floating-menu-direction="bottom"
        id={menuId}
        onKeyDown={handleEscapeKey}
        ref={menuRef}
        role="menu"
        tabIndex={-1}
      >
        <ul
          className={classNames('cds--overflow-menu-options__content', { 'cds--overflow-menu-options--lg': isTablet })}
        >
          <CustomOverflowMenuContext.Provider value={contextValue}>
            {enrichedChildren}
          </CustomOverflowMenuContext.Provider>
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
