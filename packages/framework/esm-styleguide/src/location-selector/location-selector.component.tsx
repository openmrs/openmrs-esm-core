import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ComboBox } from '@carbon/react';
import { useLocationByUuid, useLocations } from '../location-picker/location-picker.resource';
import styles from './location-selector.module.scss';

interface LocationSelectorProps {
  selectedLocationUuid?: string;
  defaultLocationUuid?: string;
  locationTag?: string;
  locationsPerRequest?: number;
  onChange: (locationUuid?: string) => void;
  Locationlabel: string;
  comBoxLabel: string;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedLocationUuid,
  defaultLocationUuid,
  locationTag,
  locationsPerRequest = 50,
  onChange,
  Locationlabel,
  comBoxLabel,
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState<string>('');

  let defaultLocation = useLocationByUuid(defaultLocationUuid).location;

  const { locations: fetchedLocations } = useLocations(locationTag, locationsPerRequest, searchTerm);

  const locations = useMemo(() => {
    if (defaultLocation && !searchTerm) {
      return [defaultLocation, ...fetchedLocations?.filter(({ resource }) => resource.id !== defaultLocationUuid)];
    }
    return fetchedLocations;
  }, [defaultLocation, fetchedLocations]);

  const handleSearch = (searchString) => {
    setSearchTerm(searchString);
  };

  const items = useMemo(() => {
    const filtered = locations.map((loc) => ({
      id: loc.resource.id,
      name: loc.resource.name,
    }));
    return filtered;
  }, [locations, searchTerm]);

  return (
    <section data-testid="combo">
      <div className={styles.sectionTitle}>{Locationlabel}</div>
      <div>
        <ComboBox
          aria-label={comBoxLabel}
          id="location"
          invalidText={'Required'}
          items={items}
          itemToString={(item) => item?.name || ''}
          selectedItem={items.find((item) => item.id === selectedLocationUuid)}
          onChange={({ selectedItem }) => onChange(selectedItem?.id)}
          onInputChange={(searchTerm) => handleSearch(searchTerm)}
          titleText={comBoxLabel}
        />
      </div>
    </section>
  );
};
