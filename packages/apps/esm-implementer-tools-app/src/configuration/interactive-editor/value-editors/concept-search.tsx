import React, { useState, useMemo } from 'react';
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
  const { concepts, error, isSearchingConcepts } = useConceptLookup(conceptToLookup);

  const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConceptToLookup(event.target.value);
  };

  const handleConceptUuidChange = (concept: Concept) => {
    setSelectedConcept(concept.uuid);
    setConcept(concept);
    setConceptToLookup('');
  };

  return (
    <div>
      {selectedConcept && <p className={styles.activeUuid}>{selectedConcept}</p>}

      <div className={styles.autocomplete}>
        <Search
          id={`searchbox-${id}`}
          labelText=""
          type="text"
          size="sm"
          autoComplete="off"
          autoCapitalize="off"
          aria-autocomplete="list"
          aria-label={t('searchConceptHelperText', 'Search concepts')}
          aria-controls={`searchbox-${id}`}
          aria-expanded={concepts?.length > 0}
          placeholder={t('searchConceptHelperText', 'Search concepts')}
          onChange={handleSearchTermChange}
        />

        {(() => {
          // No input → show nothing
          if (!conceptToLookup?.trim()) return null;

          // Loading state
          if (isSearchingConcepts) {
            return (
              <InlineLoading
                className={styles.loader}
                description={t('searchingConcepts', 'Searching concepts') + '...'}
              />
            );
          }

          // Error state
          if (error && !isSearchingConcepts) {
            return (
              <InlineNotification
                kind="error"
                title={t('error', 'Error')}
                subtitle={error?.message || t('somethingWentWrong', 'Something went wrong')}
                lowContrast
              />
            );
          }

          // Results found
          if (concepts?.length > 0) {
            return (
              <StructuredListWrapper selection id={`searchbox-${id}`} className={styles.listbox}>
                {concepts.map((concept: Concept) => (
                  <StructuredListRow key={concept.uuid} role="option" aria-selected="true">
                    <StructuredListCell
                      onClick={() => handleConceptUuidChange(concept)}
                      className={styles.smallListCell}
                    >
                      {concept.display}
                    </StructuredListCell>
                  </StructuredListRow>
                ))}
              </StructuredListWrapper>
            );
          }

          // Empty state
          return (
            <InlineNotification
              kind="info"
              title={t('noResultsFound', 'No results found')}
              subtitle={t(
                'noConceptsFoundText',
                `No results found for "${conceptToLookup.trim()}"`
              )}
              lowContrast
            />
          );
        })()}
      </div>
    </div>
  );
}
