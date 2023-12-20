import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import uniqueId from 'lodash-es/uniqueId';
import {
  InlineLoading,
  Search,
  StructuredListCell,
  StructuredListRow,
  StructuredListWrapper,
  Tile,
} from '@carbon/react';
import type { Concept } from './concept-search.resource';
import { useConceptLookup } from './concept-search.resource';
import styles from './uuid-search.scss';

interface ConceptSearchBoxProps {
  setConcept: (concept) => void;
  value: string;
}

export function ConceptSearchBox({ setConcept, value }: ConceptSearchBoxProps) {
  const { t } = useTranslation();
  const id = useMemo(() => uniqueId(), []);
  const [conceptToLookup, setConceptToLookup] = useState('');
  const [selectedConcept, setSelectedConcept] = useState<string>(value);
  const { concepts, isSearchingConcepts } = useConceptLookup(conceptToLookup);

  const handleSearchTermChange = (event) => {
    setConceptToLookup(event.target.value);
  };

  const handleConceptUuidChange = (concept) => {
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
          role="combobox"
          aria-label={t('searchConceptHelperText', 'Search concepts')}
          aria-controls={`searchbox-${id}`}
          aria-expanded={concepts.length > 0}
          placeholder={t('searchConceptHelperText', 'Search concepts')}
          onChange={handleSearchTermChange}
        />
        {(() => {
          if (!conceptToLookup) return null;
          if (isSearchingConcepts)
            return <InlineLoading className={styles.loader} description={t('searching', 'Searching') + '...'} />;
          if (concepts && concepts.length && !isSearchingConcepts) {
            return (
              <StructuredListWrapper selection id={`searchbox-${id}`} className={styles.listbox}>
                {concepts.map((concept: Concept) => (
                  <StructuredListRow key={concept.uuid} role="option" aria-selected="true">
                    <StructuredListCell
                      onClick={() => {
                        handleConceptUuidChange(concept);
                      }}
                      className={styles.smallListCell}
                    >
                      {concept.display}
                    </StructuredListCell>
                  </StructuredListRow>
                ))}
              </StructuredListWrapper>
            );
          }
          return (
            <Tile className={styles.emptyResults}>
              <span>{t('noConceptsFoundText', 'No matching concepts found')}</span>
            </Tile>
          );
        })()}
      </div>
    </div>
  );
}
