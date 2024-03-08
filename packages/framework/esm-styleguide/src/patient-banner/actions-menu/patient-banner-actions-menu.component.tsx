import { ExtensionSlot, useConnectedExtensions } from '@openmrs/esm-react-utils';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { OverflowMenuVertical } from '@carbon/react/icons';
import styles from './patient-banner-actions-menu.module.scss';
import { CustomOverflowMenu } from '../../custom-overflow-menu/custom-overflow-menu.component';
import { translateFrom } from '@openmrs/esm-utils';

export interface PatientBannerActionsMenuProps {
  patientUuid: string;
  isDeceased: boolean;
  actionsSlotName: string;
  /**
   * Parts of the actions slot extension state that don't really make sense go in this object,
   * so as to keep the PatientBannerActionsMenu API clean.
   */
  additionalActionsSlotState?: object;
}

export function PatientBannerActionsMenu({
  patientUuid,
  actionsSlotName,
  isDeceased,
  additionalActionsSlotState,
}: PatientBannerActionsMenuProps) {
  const patientActions = useConnectedExtensions(actionsSlotName);
  const patientActionsSlotState = useMemo(
    () => ({ patientUuid, ...additionalActionsSlotState }),
    [patientUuid, additionalActionsSlotState],
  );

  return (
    <>
      {patientActions.length > 0 ? (
        <div className={styles.overflowMenuContainer}>
          <CustomOverflowMenu
            deceased={isDeceased}
            menuTitle={
              <>
                <span className={styles.actionsButtonText}>
                  {translateFrom('@openmrs/esm-patient-banner-app', 'actions', 'Actions')}
                </span>{' '}
                <OverflowMenuVertical size={16} style={{ marginLeft: '0.5rem', fill: '#78A9FF' }} />
              </>
            }
          >
            <ExtensionSlot
              name="patient-actions-slot"
              key="patient-actions-slot"
              state={patientActionsSlotState}
            />
          </CustomOverflowMenu>
        </div>
      ) : null}
    </>
  );
}
