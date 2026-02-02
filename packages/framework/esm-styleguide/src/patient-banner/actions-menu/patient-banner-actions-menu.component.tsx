/** @module @category UI */
import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { OverflowMenuVertical } from '@carbon/react/icons';
import { ExtensionSlot, useExtensionSlot, useLayoutType, useOnClickOutside } from '@openmrs/esm-react-utils';
import { getCoreTranslation } from '@openmrs/esm-translations';
import customOverflowMenuStyles from '../../custom-overflow-menu/custom-overflow-menu.module.scss';
import styles from './patient-banner-actions-menu.module.scss';

export interface PatientBannerActionsMenuProps {
  patient: fhir.Patient;
  patientUuid: string;
  actionsSlotName: string;
  /**
   * Parts of the actions slot extension state that don't really make sense go in this object,
   * so as to keep the PatientBannerActionsMenu API clean.
   */
  additionalActionsSlotState?: object;
}

/**
 * Overflow menu for the patient banner whose items come from an ExtensionSlot
 * rather than direct React children. Because cloneElement cannot inject props
 * into extension-rendered components, arrow key navigation is handled at the
 * container level via onKeyDown instead of delegating to Carbon's OverflowMenuItem.
 */
export function PatientBannerActionsMenu({
  patient,
  patientUuid,
  actionsSlotName,
  additionalActionsSlotState,
}: PatientBannerActionsMenuProps) {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const { extensions: patientActions } = useExtensionSlot(actionsSlotName);
  const isTablet = useLayoutType() === 'tablet';
  const ref = useOnClickOutside<HTMLDivElement>(() => setMenuIsOpen(false), menuIsOpen);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const uniqueId = useId();
  const triggerId = `patient-actions-menu-trigger-${uniqueId}`;
  const menuId = `patient-actions-menu-${uniqueId}`;

  const toggleShowMenu = useCallback(() => setMenuIsOpen((state) => !state), []);

  const closeMenuAndFocusTrigger = useCallback(() => {
    setMenuIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  const handleMenuKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape' && menuIsOpen) {
        e.stopPropagation();
        closeMenuAndFocusTrigger();
        return;
      }

      if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && menuIsOpen) {
        e.preventDefault();
        const enabledItems = menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])');
        if (!enabledItems?.length) {
          return;
        }

        const activeItem =
          (document.activeElement?.closest?.('[role="menuitem"]') as HTMLElement) ?? document.activeElement;
        const currentPos = Array.from(enabledItems).indexOf(activeItem as HTMLElement);

        if (currentPos === -1) {
          enabledItems[e.key === 'ArrowDown' ? 0 : enabledItems.length - 1]?.focus();
          return;
        }

        const direction = e.key === 'ArrowDown' ? 1 : -1;
        const nextPos = currentPos + direction;
        const wrappedPos = nextPos < 0 ? enabledItems.length - 1 : nextPos >= enabledItems.length ? 0 : nextPos;
        enabledItems[wrappedPos]?.focus();
      }
    },
    [closeMenuAndFocusTrigger, menuIsOpen],
  );

  useEffect(() => {
    if (menuIsOpen && menuRef.current) {
      const firstItem = menuRef.current.querySelector<HTMLElement>('[role="menuitem"]:not([disabled])');
      firstItem?.focus();
    }
  }, [menuIsOpen]);

  const patientActionsSlotState = useMemo(
    () => ({ patientUuid, patient, closeMenu: closeMenuAndFocusTrigger, ...additionalActionsSlotState }),
    [patientUuid, patient, closeMenuAndFocusTrigger, additionalActionsSlotState],
  );

  if (patientActions.length === 0) {
    return null;
  }

  return (
    <div className={styles.overflowMenuContainer}>
      <div
        data-overflow-menu
        className={classNames('cds--overflow-menu', customOverflowMenuStyles.container)}
        ref={ref}
      >
        <button
          className={classNames(
            'cds--btn',
            'cds--btn--ghost',
            'cds--overflow-menu__trigger',
            { 'cds--overflow-menu--open': menuIsOpen },
            customOverflowMenuStyles.overflowMenuButton,
          )}
          aria-controls={menuId}
          aria-expanded={menuIsOpen}
          aria-haspopup="true"
          id={triggerId}
          onClick={toggleShowMenu}
          onKeyDown={handleMenuKeyDown}
          ref={triggerRef}
        >
          <span className={styles.actionsButtonText}>{getCoreTranslation('actions', 'Actions')}</span>{' '}
          <OverflowMenuVertical size={16} style={{ marginLeft: '0.5rem', fill: '#78A9FF' }} />
        </button>
        <div
          className={classNames(
            'cds--overflow-menu-options',
            'cds--overflow-menu--flip',
            customOverflowMenuStyles.menu,
            {
              [customOverflowMenuStyles.show]: menuIsOpen,
            },
          )}
          aria-labelledby={triggerId}
          data-floating-menu-direction="bottom"
          id={menuId}
          onKeyDown={handleMenuKeyDown}
          ref={menuRef}
          role="menu"
          tabIndex={-1}
        >
          <ul
            className={classNames('cds--overflow-menu-options__content', {
              'cds--overflow-menu-options--lg': isTablet,
            })}
          >
            <ExtensionSlot name={actionsSlotName} key={actionsSlotName} state={patientActionsSlotState} />
          </ul>
          <span />
        </div>
      </div>
    </div>
  );
}
