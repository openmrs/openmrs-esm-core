import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import uniqueId from 'lodash-es/uniqueId';
import {
  InlineLoading,
  InlineNotification,
  Search,
  StructuredListCell,
  StructuredListRow,
  StructuredListWrapper,
} from '@carbon/react';
import { getCoreTranslation, useDebounce } from '@openmrs/esm-framework';
import type { Concept } from './concept-search.resource';
import { useConceptLookup } from './concept-search.resource';
import styles from './uuid-search.scss';

interface ConceptSearchBoxProps {
  setConcept: (concept: Concept) => void;
  value: string;
}

export function ConceptSearchBox({ setConcept, value }: ConceptSearchBoxProps) {
  const { t } = useTranslation();
  const id = useMemo(() => uniqueId(), []);

  const [conceptToLookup, setConceptToLookup] = useState('');
  const [selectedConcept, setSelectedConcept] = useState<string>(value);

  const debouncedQuery = useDebounce(conceptToLookup.trim());
  const { concepts, error, isSearchingConcepts } = useConceptLookup(debouncedQuery);

  const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConceptToLookup(event.target.value);
  };

  const handleConceptUuidChange = (concept: Concept) => {
    setSelectedConcept(concept.uuid);
    setConcept(concept);
    setConceptToLookup('');
  };

  const inputId = `concept-search-input-${id}`;
  const listId = `concept-search-list-${id}`;

  const showResultsList = !!(debouncedQuery && concepts && concepts.length > 0);

  // Log fetch errors in development only — excludes test and production envs
  useEffect(() => {
    if (error && process.env.NODE_ENV === 'development') {
      console.error('[ConceptSearchBox] Failed to fetch concepts:', error);
    }
  }, [error]);

  let content: React.ReactNode = null;

  if (debouncedQuery) {
    if (isSearchingConcepts) {
      content = <InlineLoading className={styles.loader} description={`${t('searching', 'Searching')}...`} />;
    } else if (error) {
      content = (
        <InlineNotification
          kind="error"
          title={getCoreTranslation('error', 'Error')}
          subtitle={t('somethingWentWrong', 'Something went wrong')}
          lowContrast
        />
      );
    } else if (showResultsList) {
      content = (
        <StructuredListWrapper
          selection
          role="listbox"
          aria-label={t('searchResults', 'Search results')}
          id={listId}
          className={styles.listbox}
        >
          {concepts.map((concept: Concept) => (
            <StructuredListRow
              key={concept.uuid}
              role="option"
              aria-label={concept.display}
              aria-selected={concept.uuid === selectedConcept}
              tabIndex={0}
              onClick={() => handleConceptUuidChange(concept)}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleConceptUuidChange(concept);
                }
              }}
            >
              <StructuredListCell className={styles.smallListCell}>{concept.display}</StructuredListCell>
            </StructuredListRow>
          ))}
        </StructuredListWrapper>
      );
    } else {
      content = (
        <InlineNotification
          kind="info"
          title={getCoreTranslation('noResultsToDisplay')}
          subtitle={t('noConceptsFoundText', 'No matching concepts found')}
          lowContrast
        />
      );
    }
  }

  return (
    <div>
      {selectedConcept && <p className={styles.activeUuid}>{selectedConcept}</p>}

      <div className={styles.autocomplete}>
        <Search
          id={inputId}
          labelText=""
          type="text"
          size="sm"
          autoComplete="off"
          autoCapitalize="off"
          role="searchbox"
          aria-label={t('searchConceptHelperText', 'Search concepts')}
          {...(showResultsList ? { 'aria-controls': listId } : {})}
          placeholder={t('searchConceptHelperText', 'Search concepts')}
          value={conceptToLookup}
          onChange={handleSearchTermChange}
        />

        {content}
      </div>
    </div>
  );
}
