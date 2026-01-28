/** @module @category UI */
import React, { useCallback, useMemo, useState } from 'react';
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

  const toggleShowMenu = useCallback(() => setMenuIsOpen((state) => !state), []);
  const closeMenu = useCallback(() => setMenuIsOpen(false), []);

  const patientActionsSlotState = useMemo(
    () => ({ patientUuid, patient, closeMenu, ...additionalActionsSlotState }),
    [patientUuid, patient, closeMenu, additionalActionsSlotState],
  );

  return (
    <>
      {patientActions.length > 0 ? (
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
              aria-haspopup="true"
              aria-expanded={menuIsOpen}
              id="custom-actions-overflow-menu-trigger"
              aria-controls="custom-actions-overflow-menu"
              onClick={toggleShowMenu}
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
              tabIndex={0}
              data-floating-menu-direction="bottom"
              role="menu"
              aria-labelledby="custom-actions-overflow-menu-trigger"
              id="custom-actions-overflow-menu"
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
      ) : null}
    </>
  );
}
