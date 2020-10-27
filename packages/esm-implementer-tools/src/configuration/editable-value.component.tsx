import React, { useState, useEffect, useRef } from "react";
import { debounce, isEqual } from "lodash";
import { setTemporaryConfigValue } from "@openmrs/esm-config";
import styles from "./editable-value.styles.css";
import ValueEditor from "./value-editor";
import { useGlobalState } from "../global-state";
import {
  fetchConceptByUuid,
  performConceptSearch,
} from "./concept-search.resource";

interface EditableValueProps {
  path: string[];
  value: string | number | Array<any> | null;
}

export default function EditableValue({ path, value }: EditableValueProps) {
  const [valueString, setValueString] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [configPathBeingEdited, setConfigPathBeingEdited] = useGlobalState(
    "configPathBeingEdited"
  );
  const activeConfigPath = useRef<HTMLButtonElement>(null);
  const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(false);
  const [activeConceptUuid, setActiveConceptUuid] = useState<any>("");
  const [conceptName, setConceptName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchTimeoutInMs = 300;

  const closeEditor = () => {
    setEditing(false);
    setError(null);
  };

  const focusOnConfigPathBeingEdited = () => {
    if (activeConfigPath && activeConfigPath.current) {
      setEditing(true);
      activeConfigPath.current.focus();
    }
  };

  const toggleSearchPanel = () => {
    setIsSearchPanelOpen(!isSearchPanelOpen);
  };

  const handleSearchTermChange = debounce((searchTerm) => {
    setSearchTerm(searchTerm);
  }, searchTimeoutInMs);

  const handleUuidChange = (conceptUuid) => {
    setTemporaryConfigValue(path, conceptUuid);
    setActiveConceptUuid(conceptUuid);
    resetSearch();
    toggleSearchPanel();
  };

  const resetSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
  };

  useEffect(() => {
    if (isEqual(configPathBeingEdited, path)) {
      focusOnConfigPathBeingEdited();
    }
  }, [configPathBeingEdited]);

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
    <>
      <div style={{ display: "flex" }}>
        {editing ? (
          <ValueEditor
            valueString={valueString ?? JSON.stringify(value)}
            handleClose={closeEditor}
            handleSave={(val) => {
              try {
                const result = JSON.parse(val);
                setTemporaryConfigValue(path, result);
                setValueString(val);
                closeEditor();
              } catch (e) {
                console.warn(e);
                setError("That's not formatted quite right. Try again.");
              }
            }}
          />
        ) : (
          <button
            className={styles.secretButton}
            onClick={() => setEditing(true)}
            ref={activeConfigPath}
          >
            {activeConceptUuid
              ? `"${activeConceptUuid}"`
              : valueString ?? JSON.stringify(value)}
          </button>
        )}
        {error && <div className={styles.error}>{error}</div>}
        {value && typeof value === "string" && path[1]?.match(/concepts/) && (
          <button
            style={{
              backgroundColor: "#edf2f7",
              borderRadius: "9999px",
              color: "#1a202c",
              padding: "0.05rem 0.5rem",
              margin: "0.5rem",
              height: "1rem",
            }}
            onClick={() => {
              setActiveConceptUuid(valueString ?? value);
              toggleSearchPanel();
              resetSearch();
            }}
          >
            {isSearchPanelOpen ? `${conceptName}` : "C"}
          </button>
        )}
      </div>
      <div style={{ display: "flex", flex: "100%", flexFlow: "columnWrap" }}>
        {isSearchPanelOpen && (
          <div className={styles.autocomplete}>
            <input
              type="text"
              autoComplete="off"
              autoCapitalize="off"
              aria-autocomplete="list"
              role="combobox"
              aria-label="Look up concept by name"
              aria-controls={`searchbox-${path.join(".")}`}
              aria-expanded={searchResults.length > 0}
              placeholder="Look up concept by name"
              autoFocus
              onChange={($event) => {
                handleSearchTermChange($event.target.value);
              }}
            />
            <div id={`searchbox-${path.join(".")}`}>
              <ul role="listbox">
                {!!searchResults.length &&
                  searchResults.map((concept: any) => (
                    <li
                      key={concept.uuid}
                      role="option"
                      style={{ padding: "5px" }}
                      onClick={() => {
                        handleUuidChange(concept.uuid);
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
        )}
      </div>
    </>
  );
}
