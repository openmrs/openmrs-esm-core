import React, { useEffect, useCallback } from "react";
import debounce from "lodash-es/debounce";
import isEmpty from "lodash-es/isEmpty";
import Link from "carbon-components-react/es/components/Link";
import PaginationNav from "carbon-components-react/es/components/PaginationNav";
import PatientSearchResults from "../patient-search-result/patient-search-result.component";
import EmptyDataIllustration from "./empty-data-illustration.component";
import { Tile } from "carbon-components-react/es/components/Tile";
import { useTranslation } from "react-i18next";
import { performPatientSearch } from "./patient-search.resource";
import styles from "./patient-search.scss";
import Search from "carbon-components-react/es/components/Search";
import { SearchedPatient } from "../../types";

interface PatientSearchProps {
  hidePanel?: () => void;
  showPatientSearch: boolean;
}

const PatientSearch: React.FC<PatientSearchProps> = ({
  hidePanel,
  showPatientSearch,
}) => {
  const customReprestation =
    "custom:(patientId,uuid,identifiers,display," +
    "patientIdentifier:(uuid,identifier)," +
    "person:(gender,age,birthdate,birthdateEstimated,personName,display)," +
    "attributes:(value,attributeType:(name)))";
  const searchTimeout = 300;
  const resultsPerPage = 5;

  const [searchTerm, setSearchTerm] = React.useState("");
  const [emptyResult, setEmptyResult] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState<
    Array<SearchedPatient>
  >([]);
  const [pagedResults, setPagedResults] = React.useState<
    Array<SearchedPatient>
  >([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(10);
  const searchInput = React.useRef<HTMLInputElement | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const ac = new AbortController();
    if (searchTerm) {
      performPatientSearch(searchTerm, customReprestation).then(({ data }) => {
        const results: Array<SearchedPatient> = data.results.map((res, i) => ({
          ...res,
          index: i + 1,
        }));

        const pagedResults = results.slice(0, resultsPerPage);
        setSearchResults(results);
        setPagedResults(pagedResults);
        setTotalPages(Math.ceil(results.length / resultsPerPage));

        if (isEmpty(data.results)) {
          setEmptyResult(true);
        } else {
          setEmptyResult(false);
        }
      });
    } else {
      setEmptyResult(false);
      setSearchResults([]);
      setPagedResults([]);
    }
    return () => ac.abort();
  }, [searchTerm, customReprestation]);

  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      hidePanel();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", escFunction, false);
    return () => window.removeEventListener("keydown", escFunction, false);
  }, [escFunction]);

  const handleChange = debounce((searchTerm) => {
    setSearchTerm(searchTerm);
  }, searchTimeout);

  const nextPage = () => {
    let upperBound = currentPage * resultsPerPage + resultsPerPage;
    const lowerBound = currentPage * resultsPerPage;
    if (upperBound > searchResults.length) {
      upperBound = searchResults.length;
    }
    const pageResults = searchResults.slice(lowerBound, upperBound);
    setPagedResults(pageResults);
    setCurrentPage(currentPage + 1);
  };

  const previousPage = () => {
    const lowerBound = currentPage * resultsPerPage - resultsPerPage * 2;
    const upperBound = currentPage * resultsPerPage - resultsPerPage;
    const pageResults = searchResults.slice(lowerBound, upperBound);
    setPagedResults(pageResults);
    setCurrentPage(currentPage - 1);
  };

  const handlePageChange = (page) => {
    if (page === 0 && currentPage === 0) {
      nextPage();
    } else if (page + 1 > currentPage) {
      nextPage();
    } else if (page + 1 < currentPage) {
      previousPage();
    }
  };

  return (
    <div
      className={
        showPatientSearch ? styles.patientSearch : styles.hidePatientSearch
      }
    >
      <Search
        className={styles.patientSearchInput}
        onChange={($event) => handleChange($event.target.value)}
        placeholder="Search for a patient"
        labelText=""
        ref={searchInput}
        autoFocus={true}
      />

      {!isEmpty(searchResults) && (
        <div className={styles.searchResults}>
          <p>
            <span className={styles.resultsText}>
              {t("found", "Found")} {searchResults.length}{" "}
              {t("patient", "patient")}{" "}
              {searchResults.length === 1 ? "chart" : "charts"}{" "}
              {t("containing", "containing")}
            </span>
          </p>
          <p className={styles.searchTerm}>"{searchTerm}"</p>
          <PatientSearchResults
            hidePanel={hidePanel}
            searchTerm={searchTerm}
            patients={pagedResults}
          />
          <div className={styles.pagination}>
            <PaginationNav
              itemsShown={resultsPerPage}
              totalItems={totalPages}
              onChange={handlePageChange}
            />
          </div>
        </div>
      )}
      {emptyResult && (
        <div className={styles.searchResults}>
          <p>
            <span className={styles.resultsText}>
              {t("searchResultsFor", "Search results for:")}
            </span>
          </p>
          <p className={styles.searchTerm}>"{searchTerm}"</p>
          <Tile style={{ textAlign: "center" }} onClick={hidePanel}>
            <EmptyDataIllustration />
            <p className={styles.emptyResultText}>
              {t(
                "noPatientChartsFoundMessage",
                "Sorry, no patient charts have been found"
              )}
            </p>
            <p className={styles.actionText}>
              <span>
                {t(
                  "trySearchWithPatientUniqueID",
                  "Try searching with the patient's unique ID number"
                )}
              </span>
              <br />
              <span>{t("orPatientName", "OR the patient's name(s)")}</span>
            </p>
            <Link>{t("searchAgain", "Search Again")}</Link>
          </Tile>
        </div>
      )}
    </div>
  );
};

export default PatientSearch;
