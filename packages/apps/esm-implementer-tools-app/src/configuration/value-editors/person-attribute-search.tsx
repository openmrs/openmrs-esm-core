import React, { useState, useEffect, useMemo } from "react";
import debounce from "lodash-es/debounce";
import uniqueId from "lodash-es/uniqueId";
import { performPersonAttributeTypeSearch } from "./person-attribute-search.resource";
import styles from "./uuid-search.scss";
import { useTranslation } from "react-i18next";
import {
  Search,
  StructuredListBody,
  StructuredListCell,
  StructuredListRow,
  StructuredListWrapper,
} from "carbon-components-react";
import { ValueEditorField } from "./value-editor-field";
import { Type } from "@openmrs/esm-framework";
import { ConceptSearchBox } from "./concept-search";

interface PersonAttributeType {
  name: string;
  uuid: string;
  type: string;
  concept: any;
}
interface PersonAttributeTypeSearchBoxProps {
  value: PersonAttributeType;
  setPersonAttributeUuid: (personAttributeType) => void;
}

export function PersonAttributeTypeSearchBox({
  setPersonAttributeUuid,
  value,
}: PersonAttributeTypeSearchBoxProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [activePersonAttribute, setActivePersonAttribute] = useState<any>({
    name: value?.name,
    uuid: value?.uuid,
    type: value?.type ?? "coded",
    concept: value?.concept ?? "",
  });
  const { t } = useTranslation();
  const searchTimeoutInMs = 300;

  const id = useMemo(() => uniqueId(), []);

  const handleChange = (fieldName, value) => {
    setActivePersonAttribute((prevPersonAttribute) => ({
      ...prevPersonAttribute,
      [fieldName]: value,
    }));
    resetSearch();
  };

  useEffect(() => {
    setPersonAttributeUuid(activePersonAttribute);
  }, [activePersonAttribute]);

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
      performPersonAttributeTypeSearch(searchTerm).then(
        ({ data: { results } }) => {
          setSearchResults(results.slice(0, 9));
        }
      );
    } else {
      setSearchResults([]);
    }
    return () => ac.abort();
  }, [searchTerm]);

  return (
    <div>
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
          aria-label={t(
            "searchPersonAttributeHelperText",
            "Person attribute type name"
          )}
          aria-controls={`searchbox-${id}`}
          aria-expanded={searchResults.length > 0}
          placeholder={t(
            "searchPersonAttributeHelperText",
            "Person attribute type name"
          )}
          autoFocus
          onChange={($event) => {
            handleSearchTermChange($event.target.value);
          }}
        />

        {!!searchResults.length && (
          <StructuredListWrapper
            selection
            className={styles.listbox}
            id={`searchbox-${id}`}
          >
            {searchResults.map((personAttributeType: any) => (
              <StructuredListRow
                key={personAttributeType.uuid}
                role="option"
                onClick={() => {
                  handleChange("uuid", personAttributeType.uuid);
                  handleChange("name", personAttributeType.display);
                }}
                aria-selected="true"
              >
                <StructuredListCell className={styles.smallListCell}>
                  {personAttributeType.display}
                </StructuredListCell>
              </StructuredListRow>
            ))}
          </StructuredListWrapper>
        )}

        {searchTerm && searchResults && !searchResults.length && (
          <p className={styles.bodyShort01}>
            {t("noPersonAttributeFoundText", "No matching results found")}
          </p>
        )}
      </div>
      <div>
        <StructuredListWrapper>
          <StructuredListBody>
            {activePersonAttribute.name && (
              <StructuredListRow>
                <StructuredListCell>
                  {t("nameField", "name")}
                </StructuredListCell>
                <StructuredListCell>
                  {activePersonAttribute.name}
                </StructuredListCell>
              </StructuredListRow>
            )}
            {activePersonAttribute.uuid && (
              <StructuredListRow>
                <StructuredListCell>
                  {t("uuidField", "uuid")}
                </StructuredListCell>
                <StructuredListCell>
                  {activePersonAttribute.uuid}
                </StructuredListCell>
              </StructuredListRow>
            )}
            <StructuredListRow>
              <StructuredListCell>{t("typeField", "type")}</StructuredListCell>
              <StructuredListCell>
                <ValueEditorField
                  element={{
                    _value: activePersonAttribute.type,
                    _source: "",
                  }}
                  valueType={Type.String}
                  value={activePersonAttribute.type}
                  onChange={(type: string) => {
                    handleChange("type", type);
                  }}
                />
              </StructuredListCell>
            </StructuredListRow>
            <StructuredListRow>
              <StructuredListCell>
                {t("conceptField", "concept")}
              </StructuredListCell>
              <StructuredListCell>
                <ConceptSearchBox
                  value={activePersonAttribute.concept}
                  setConcept={(conceptUuid: string) =>
                    handleChange("concept", conceptUuid)
                  }
                />
              </StructuredListCell>
            </StructuredListRow>
          </StructuredListBody>
        </StructuredListWrapper>
      </div>
    </div>
  );
}
