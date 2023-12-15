import React, { useState, useEffect, useMemo } from 'react';
import debounce from 'lodash-es/debounce';
import uniqueId from 'lodash-es/uniqueId';
import { performPersonAttributeTypeSearch } from './person-attribute-search.resource';
import styles from './uuid-search.scss';
import { useTranslation } from 'react-i18next';
import { Search, StructuredListCell, StructuredListRow, StructuredListWrapper } from '@carbon/react';

interface PersonAttributeTypeSearchBoxProps {
  value: string;
  setPersonAttributeUuid: (personAttributeType) => void;
}

export function PersonAttributeTypeSearchBox({ setPersonAttributeUuid, value }: PersonAttributeTypeSearchBoxProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activePersonAttributeUuid, setActivePersonAttributeUuid] = useState<any>(value);
  const { t } = useTranslation();
  const searchTimeoutInMs = 300;

  const id = useMemo(() => uniqueId(), []);

  const handleUuidChange = (personAttributeType) => {
    setActivePersonAttributeUuid(personAttributeType.uuid);
    resetSearch();
    setPersonAttributeUuid(personAttributeType.uuid);
  };

  const resetSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleSearchTermChange = debounce((searchTerm) => {
    setSearchTerm(searchTerm);
  }, searchTimeoutInMs);

  useEffect(() => {
    const ac = new AbortController();

    if (searchTerm && searchTerm.length >= 2) {
      performPersonAttributeTypeSearch(searchTerm).then(({ data: { results } }) => {
        setSearchResults(results.slice(0, 9));
      });
    } else {
      setSearchResults([]);
    }
    return () => ac.abort();
  }, [searchTerm]);

  return (
    <div>
      {activePersonAttributeUuid && <p className={styles.activeUuid}>{activePersonAttributeUuid}</p>}
      <div className={styles.autocomplete}>
        <Search
          id={`search-input-${id}`}
          labelText=""
          type="text"
          size="sm"
          autoComplete="off"
          autoCapitalize="off"
          aria-autocomplete="list"
          role="combobox"
          aria-label={t('searchPersonAttributeHelperText', 'Person attribute type name')}
          aria-controls={`searchbox-${id}`}
          aria-expanded={searchResults.length > 0}
          placeholder={t('searchPersonAttributeHelperText', 'Person attribute type name')}
          onChange={($event) => {
            handleSearchTermChange($event.target.value);
          }}
        />

        {!!searchResults.length && (
          <StructuredListWrapper selection className={styles.listbox} id={`searchbox-${id}`}>
            {searchResults.map((personAttributeType: any) => (
              <StructuredListRow
                key={personAttributeType.uuid}
                role="option"
                onClick={() => {
                  handleUuidChange(personAttributeType);
                }}
                aria-selected="true"
              >
                <StructuredListCell className={styles.smallListCell}>{personAttributeType.display}</StructuredListCell>
              </StructuredListRow>
            ))}
          </StructuredListWrapper>
        )}

        {searchTerm && searchResults && !searchResults.length && (
          <p className={styles.bodyShort01}>{t('noPersonAttributeFoundText', 'No matching results found')}</p>
        )}
      </div>
    </div>
  );
}
