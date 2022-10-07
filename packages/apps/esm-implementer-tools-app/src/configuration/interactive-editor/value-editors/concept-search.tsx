import React, { useState, useEffect, useMemo } from "react";
import debounce from "lodash-es/debounce";
import uniqueId from "lodash-es/uniqueId";
import {
  fetchConceptByUuid,
  performConceptSearch,
} from "./concept-search.resource";
import styles from "./uuid-search.scss";
import {
  Search,
  StructuredListCell,
  StructuredListRow,
  StructuredListWrapper,
} from "@carbon/react";
import { useTranslation } from "react-i18next";

interface ConceptSearchBoxProps {
  value: string;
  setConcept: (concept) => void;
}

export function ConceptSearchBox({ setConcept, value }: ConceptSearchBoxProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [activeConceptUuid, setActiveConceptUuid] = useState<any>(value);
  const searchTimeoutInMs = 300;
  const { t } = useTranslation();
  const id = useMemo(() => uniqueId(), []);

  const handleUuidChange = (concept) => {
    setActiveConceptUuid(concept.uuid);
    resetSearch();
    setConcept(concept);
  };

  const resetSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleSearchTermChange = debounce((searchTerm) => {
    setSearchTerm(searchTerm);
  }, searchTimeoutInMs);

  useEffect(() => {
    const ac = new AbortController();

    if (searchTerm && searchTerm.length >= 2) {
      performConceptSearch(searchTerm).then(({ data: { results } }) => {
        setSearchResults(results.slice(0, 9));
      });
    } else {
      setSearchResults([]);
    }
    return () => ac.abort();
  }, [searchTerm]);

  return (
    <div>
      {activeConceptUuid && (
        <p className={styles.activeUuid}>{activeConceptUuid}</p>
      )}
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
          aria-label={t("searchConceptHelperText", "Concept Name")}
          aria-controls={`searchbox-${id}`}
          aria-expanded={searchResults.length > 0}
          placeholder={t("searchConceptHelperText", "Concept Name")}
          onChange={($event) => {
            handleSearchTermChange($event.target.value);
          }}
        />
        {!!searchResults.length && (
          <StructuredListWrapper
            selection
            id={`searchbox-${id}`}
            className={styles.listbox}
          >
            {searchResults.map((concept: any) => (
              <StructuredListRow
                key={concept.uuid}
                role="option"
                aria-selected="true"
              >
                <StructuredListCell
                  onClick={() => {
                    handleUuidChange(concept);
                  }}
                  className={styles.smallListCell}
                >
                  {concept.display}
                </StructuredListCell>
              </StructuredListRow>
            ))}
          </StructuredListWrapper>
        )}
        {searchTerm && searchResults && !searchResults.length && (
          <p className={styles.bodyShort01}>
            {t("noConceptsFoundText", "No matching results found")}
          </p>
        )}
      </div>
    </div>
  );
}
