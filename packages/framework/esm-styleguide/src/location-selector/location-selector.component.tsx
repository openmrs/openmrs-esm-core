import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ComboBox } from '@carbon/react';
import { useDebounce } from '@openmrs/esm-react-utils';
import { getCoreTranslation } from '@openmrs/esm-translations';

import { useLocationByUuid, useLocations } from '../location-picker/location-picker.resource';

interface Location {
  resource: { id: string; name: string };
}

interface LocationSelectorProps {
  selectedLocationUuid?: string;
  defaultLocationUuid?: string;
  locationTag?: string;
  locationsPerRequest?: number;
  onChange: (locationUuid?: string) => void;
  label?: string;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedLocationUuid,
  defaultLocationUuid,
  locationTag,
  locationsPerRequest = 50,
  onChange,
  label,
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [initialLocations, setInitialLocations] = useState<Location[]>([]);
  const debouncedSearchTerm = useDebounce(searchTerm);
  const { location: defaultLocation } = useLocationByUuid(defaultLocationUuid);
  const { locations: fetchedLocations = [] } = useLocations(locationTag, locationsPerRequest, debouncedSearchTerm);

  useEffect(() => {
    if (fetchedLocations.length > 0) {
      setInitialLocations(fetchedLocations);
    }
  }, [fetchedLocations]);

  const effectiveLocations = useMemo<Location[]>(() => {
    const baseLocations = fetchedLocations.length > 0 ? fetchedLocations : initialLocations;
    if (defaultLocation && !searchTerm) {
      return [defaultLocation, ...baseLocations.filter((loc) => loc.resource.id !== defaultLocationUuid)];
    }
    return baseLocations;
  }, [defaultLocation, defaultLocationUuid, fetchedLocations, initialLocations, searchTerm]);

  const items = useMemo(
    () =>
      effectiveLocations.map((loc) => ({
        id: loc.resource.id,
        label: loc.resource.name,
      })),
    [effectiveLocations],
  );

  return (
    <section data-testid="combo">
      <ComboBox
        aria-label={label}
        id="location"
        invalidText={getCoreTranslation('error','Required')}
        items={items}
        initialSelectedItem={items.find((i) => i.id === defaultLocationUuid)}
        selectedItem={items.find((i) => i.id === selectedLocationUuid)}
        itemToString={(item) => item?.label || ''}
        onChange={(evt) => onChange(evt.selectedItem?.id)}
        onInputChange={(value) => setSearchTerm(value)}
        titleText={label}
      />
    </section>
  );
};
