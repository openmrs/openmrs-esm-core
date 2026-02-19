// Calls the real SVG registration functions from the styleguide so that
// the icon and pictogram sprite sheets are populated in the DOM.
// This relies on svg-utils.ts creating the #omrs-svgs-container element
// and on svgo-loader returning SVG files as raw strings.
import { setupIcons } from '@openmrs/esm-styleguide/src/icons/icon-registration';
import { setupPictograms } from '@openmrs/esm-styleguide/src/pictograms/pictogram-registration';
import { setupEmptyCard } from '@openmrs/esm-styleguide/src/empty-card/empty-card-registration';

setupIcons();
setupPictograms();
setupEmptyCard();
