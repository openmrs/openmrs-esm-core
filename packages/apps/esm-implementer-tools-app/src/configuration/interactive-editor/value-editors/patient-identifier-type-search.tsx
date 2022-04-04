import React, { useState, useEffect, useMemo } from "react";
import debounce from "lodash-es/debounce";
import uniqueId from "lodash-es/uniqueId";
import { usePatientIdentifierTypes } from "./patient-identifier-type.resource";
import styles from "./uuid-search.scss";
import { useTranslation } from "react-i18next";
import {
  Search,
  StructuredListCell,
  StructuredListRow,
  StructuredListWrapper,
} from "carbon-components-react";

interface PatientIdentifierTypeSearchBoxProps {
  value: string;
  setPatientIdentifierTypeUuid: (patientIdentifierType) => void;
}

export function PatientIdentifierTypeSearchBox({
  setPatientIdentifierTypeUuid,
  value,
}: PatientIdentifierTypeSearchBoxProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: patientIdentifierTypes, isLoading } =
    usePatientIdentifierTypes();
  const [activePatientIdentifierTypeUuid, setActivePatientIdentifierTypeUuid] =
    useState<any>(value);
  const { t } = useTranslation();
  const searchTimeoutInMs = 300;

  const id = useMemo(() => uniqueId(), []);

  const handleUuidChange = (patientIdentifierType) => {
    setActivePatientIdentifierTypeUuid(patientIdentifierType.uuid);
    setPatientIdentifierTypeUuid(patientIdentifierType.uuid);
    setSearchTerm("");
  };

  const handleSearchTermChange = debounce((searchTerm) => {
    setSearchTerm(searchTerm);
  }, searchTimeoutInMs);

  const filteredResults = useMemo(() => {
    if (!isLoading && searchTerm && searchTerm !== "") {
      return patientIdentifierTypes?.filter((type) =>
        type.display.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      return undefined;
    }
  }, [isLoading, searchTerm, patientIdentifierTypes]);

  return (
    <div>
      {activePatientIdentifierTypeUuid && (
        <p className={styles.activeUuid}>{activePatientIdentifierTypeUuid}</p>
      )}
      <div className={styles.autocomplete}>
        <Search
          id={`search-input-${id}`}
          labelText=""
          type="text"
          size="sm"
          placeholder={
            !isLoading
              ? t(
                  "searchPersonAttributeHelperText",
                  "Person attribute type name"
                )
              : t("loading", "Loading")
          }
          onChange={(event) => {
            handleSearchTermChange(event.target.value);
          }}
          disabled={isLoading}
        />
        {searchTerm ? (
          filteredResults?.length ? (
            <StructuredListWrapper
              selection
              className={styles.listbox}
              id={`searchbox-${id}`}
            >
              {filteredResults?.map((patientIdentifierType: any) => (
                <StructuredListRow
                  key={patientIdentifierType.uuid}
                  role="option"
                  onClick={() => {
                    handleUuidChange(patientIdentifierType);
                  }}
                  aria-selected="true"
                >
                  <StructuredListCell className={styles.smallListCell}>
                    {patientIdentifierType.display}
                  </StructuredListCell>
                </StructuredListRow>
              ))}
            </StructuredListWrapper>
          ) : (
            <p className={styles.bodyShort01}>
              {t("noPersonAttributeFoundText", "No matching results found")}
            </p>
          )
        ) : null}
      </div>
    </div>
  );
}
