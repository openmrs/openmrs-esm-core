import React, { useState, useEffect, useMemo } from "react";
import { debounce, uniqueId } from "lodash";
import {
  fetchConceptByUuid,
  performConceptSearch,
} from "./concept-search.resource";
import styles from "./concept-search.styles.css";

interface ConceptSearchBoxProps {
  setConcept: (concept) => void;
}

export function ConceptSearchBox({ setConcept }: ConceptSearchBoxProps) {
  const [conceptName, setConceptName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [activeConceptUuid, setActiveConceptUuid] = useState<any>("");
  const searchTimeoutInMs = 300;

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
    if (activeConceptUuid) {
      const conceptString = activeConceptUuid;

      fetchConceptByUuid(conceptString).then(({ data }) => {
        setConceptName(data.name.display);
      });
    }
  }, [activeConceptUuid]);

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
    <div className={styles.autocomplete}>
      <input
        type="text"
        autoComplete="off"
        autoCapitalize="off"
        aria-autocomplete="list"
        role="combobox"
        aria-label="Look up concept by name"
        aria-controls={`searchbox-${id}`}
        aria-expanded={searchResults.length > 0}
        placeholder="Look up concept by name"
        autoFocus
        onChange={($event) => {
          handleSearchTermChange($event.target.value);
        }}
      />
      <div id={`searchbox-${id}`}>
        <ul role="listbox">
          {!!searchResults.length &&
            searchResults.map((concept: any) => (
              <li
                key={concept.uuid}
                role="option"
                style={{ padding: "5px" }}
                onClick={() => {
                  handleUuidChange(concept);
                }}
                aria-selected="true"
              >
                {concept.display}
              </li>
            ))}
          {searchTerm && searchResults && !searchResults.length && (
            <li>No matching results found.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
