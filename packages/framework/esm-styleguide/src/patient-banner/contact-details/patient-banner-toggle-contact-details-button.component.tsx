/** @module @category UI */
import React, { type MouseEvent } from 'react';
import { Button } from '@carbon/react';
import { ChevronDown, ChevronUp } from '@carbon/react/icons';
import { getCoreTranslation } from '@openmrs/esm-translations';

export interface PatientBannerToggleContactDetailsButtonProps {
  /** Whether the contact details are currently being displayed */
  showContactDetails: boolean;
  /** Function called when this button is clicked. */
  toggleContactDetails: (e: MouseEvent) => void;
  /** Passed through to the Carbon Button component */
  className?: string;
}

export function PatientBannerToggleContactDetailsButton({
  showContactDetails,
  toggleContactDetails,
  className,
}: PatientBannerToggleContactDetailsButtonProps) {
  return (
    <Button
      className={className}
      kind="ghost"
      renderIcon={showContactDetails ? ChevronUp : ChevronDown}
      iconDescription="Toggle contact details"
      onClick={toggleContactDetails}
    >
      {showContactDetails
        ? getCoreTranslation('hideDetails', 'Hide details')
        : getCoreTranslation('showDetails', 'Show details')}
    </Button>
  );
}
