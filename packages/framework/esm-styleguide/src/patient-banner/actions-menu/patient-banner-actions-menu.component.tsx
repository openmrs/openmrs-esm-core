/** @module @category UI */
import React, { useMemo } from 'react';
import { OverflowMenuVertical } from '@carbon/react/icons';
import { ExtensionSlot, useExtensionSlot } from '@openmrs/esm-react-utils';
import { getCoreTranslation } from '@openmrs/esm-translations';
import { CustomOverflowMenu } from '../../custom-overflow-menu/custom-overflow-menu.component';
import styles from './patient-banner-actions-menu.module.scss';

export interface PatientBannerActionsMenuProps {
  patient: fhir.Patient;
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
  patient,
  patientUuid,
  actionsSlotName,
  isDeceased,
  additionalActionsSlotState,
}: PatientBannerActionsMenuProps) {
  const { extensions: patientActions } = useExtensionSlot(actionsSlotName);
  const patientActionsSlotState = useMemo(
    () => ({ patientUuid, patient, ...additionalActionsSlotState }),
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
                <span className={styles.actionsButtonText}>{getCoreTranslation('actions', 'Actions')}</span>{' '}
                <OverflowMenuVertical size={16} style={{ marginLeft: '0.5rem', fill: '#78A9FF' }} />
              </>
            }
          >
            <ExtensionSlot name="patient-actions-slot" key="patient-actions-slot" state={patientActionsSlotState} />
          </CustomOverflowMenu>
        </div>
      ) : null}
    </>
  );
}
