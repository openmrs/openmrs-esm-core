import React, { useMemo, useState } from "react";
import {
  Button,
  DataTable,
  DataTableCustomRenderProps,
  DataTableSkeleton,
  DenormalizedRow,
  FilterRowsData,
  Layer,
  Search,
  SearchSkeleton,
  SkeletonText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableSelectAll,
  TableSelectRow,
} from "@carbon/react";
import { Renew } from "@carbon/react/icons";
import {
  age,
  isDesktop,
  showModal,
  deleteSynchronizationItem,
  getFullSynchronizationItems,
  removeDynamicOfflineData,
  syncDynamicOfflineData,
  getDynamicOfflineDataEntries,
  DynamicOfflineDataSyncState,
  useLayoutType,
} from "@openmrs/esm-framework";
import { useTranslation } from "react-i18next";
import capitalize from "lodash-es/capitalize";
import EmptyState from "./empty-state.component";
import LastUpdatedTableCell from "./last-updated-table-cell.component";
import PatientNameTableCell from "./patient-name-table-cell.component";
import {
  useOfflinePatientsWithEntries,
  useOfflineRegisteredPatients,
} from "../hooks/offline-patient-data-hooks";
import styles from "./offline-patient-table.scss";

export interface OfflinePatientTableProps {
  isInteractive: boolean;
  showHeader: boolean;
}

const OfflinePatientTable: React.FC<OfflinePatientTableProps> = ({
  isInteractive,
  showHeader,
}) => {
  const { t } = useTranslation();
  const layout = useLayoutType();
  const offlinePatientsSwr = useOfflinePatientsWithEntries();
  const offlineRegisteredPatientsSwr = useOfflineRegisteredPatients();
  const toolbarItemSize = isDesktop(layout) ? "sm" : undefined;
  const [syncingPatientUuids, setSyncingPatientUuids] = useState<Array<string>>(
    []
  );
  const headers = useOfflinePatientTableHeaders();
  const rows = useOfflinePatientTableRows(syncingPatientUuids);

  const handleUpdateSelectedPatientsClick = async (
    selectedRows: ReadonlyArray<DenormalizedRow>
  ) => {
    const selectedPatientUuids = selectedRows.map((row) => row.id);
    setSyncingPatientUuids(selectedPatientUuids);
    await syncSelectedOfflinePatients(selectedPatientUuids).finally(() =>
      setSyncingPatientUuids([])
    );

    offlinePatientsSwr.mutate();
    offlineRegisteredPatientsSwr.mutate();
  };

  const handleRemovePatientsFromOfflineListClick = async (
    selectedRows: ReadonlyArray<DenormalizedRow>
  ) => {
    const closeModal = showModal("offline-tools-confirmation-modal", {
      title: t(
        "offlinePatientsTableDeleteConfirmationModalTitle",
        "Remove offline patients"
      ),
      children: t(
        "offlinePatientsTableDeleteConfirmationModalContent",
        "Are you sure that you want to remove all selected patients from the offline list? Their charts will no longer be available in offline mode and any newly registered patient will be permanently deleted."
      ),
      confirmText: t(
        "offlinePatientsTableDeleteConfirmationModalConfirm",
        "Remove patients"
      ),
      cancelText: t(
        "offlinePatientsTableDeleteConfirmationModalCancel",
        "Cancel"
      ),
      closeModal: () => closeModal(),
      onConfirm: async () => {
        await removeSelectedOfflinePatients(selectedRows.map((row) => row.id));
        offlinePatientsSwr.mutate();
        offlineRegisteredPatientsSwr.mutate();
      },
    });
  };

  if (
    offlinePatientsSwr.isValidating ||
    offlineRegisteredPatientsSwr.isValidating
  ) {
    return <TableSkeleton showHeader={showHeader} />;
  }

  if (
    offlinePatientsSwr?.data?.length === 0 ||
    offlineRegisteredPatientsSwr?.data?.length === 0
  ) {
    return (
      <EmptyState
        displayText={t("offlinePatients_lower", "offline patients")}
        headerTitle={t("offlinePatients", "Offline patients")}
      />
    );
  }

  return (
    <>
      <DataTable rows={rows} headers={headers} filterRows={filterTableRows}>
        {({
          rows,
          headers,
          getTableProps,
          getHeaderProps,
          getRowProps,
          getTableContainerProps,
          getSelectionProps,
          onInputChange,
          selectedRows,
        }: DataTableCustomRenderProps) => (
          <TableContainer
            className={styles.tableContainer}
            {...getTableContainerProps()}
          >
            <div className={styles.tableHeaderContainer}>
              {showHeader && (
                <h4 className={styles.tableHeader}>
                  {t("offlinePatientsTableTitle", "Offline patients")}
                </h4>
              )}
              {selectedRows.length === 0 && (
                <Layer>
                  <Search
                    className={styles.tableSearch}
                    labelText={t(
                      "offlinePatientsTableSearchLabel",
                      "Search this list"
                    )}
                    placeholder={t(
                      "offlinePatientsTableSearchPlaceholder",
                      "Search this list"
                    )}
                    size={toolbarItemSize}
                    onChange={onInputChange}
                  />
                </Layer>
              )}
              {selectedRows.length > 0 && (
                <>
                  <Button
                    className={styles.tableSecondaryAction}
                    kind="ghost"
                    size={toolbarItemSize}
                    renderIcon={(props) => <Renew size={32} {...props} />}
                    onClick={() =>
                      handleUpdateSelectedPatientsClick(selectedRows)
                    }
                  >
                    {selectedRows.length === 1
                      ? t("offlinePatientsTableUpdatePatient", "Update patient")
                      : t(
                          "offlinePatientsTableUpdatePatients",
                          "Update patients"
                        )}
                  </Button>
                  <Button
                    className={styles.tablePrimaryAction}
                    kind="danger"
                    size={toolbarItemSize}
                    onClick={() =>
                      handleRemovePatientsFromOfflineListClick(selectedRows)
                    }
                  >
                    {t(
                      "offlinePatientsTableRemoveFromOfflineList",
                      "Remove from list"
                    )}
                  </Button>
                </>
              )}
            </div>
            <Table {...getTableProps()} useZebraStyles>
              <TableHead>
                <TableRow>
                  {isInteractive && <TableSelectAll {...getSelectionProps()} />}
                  {headers.map((header) => (
                    <TableHeader {...getHeaderProps({ header })} isSortable>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow {...getRowProps({ row })}>
                    {isInteractive && (
                      <TableSelectRow {...getSelectionProps({ row })} />
                    )}
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>
                        {cell.value?.value ?? cell.value}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
    </>
  );
};

const TableSkeleton: React.FC<{ showHeader: boolean }> = ({ showHeader }) => {
  return (
    <TableContainer className={styles.tableContainer}>
      <div className={styles.tableHeaderContainer}>
        {showHeader && (
          <SkeletonText heading width="20%" className={styles.tableHeader} />
        )}
        <SearchSkeleton className={styles.tableSearch} />
      </div>
      <DataTableSkeleton showToolbar={false} showHeader={false} />
    </TableContainer>
  );
};

function filterTableRows({
  rowIds,
  headers,
  cellsById,
  inputValue,
  // @ts-ignore `getCellId` is not in the types, but present in Carbon.
  getCellId,
}: FilterRowsData) {
  return rowIds.filter((rowId) =>
    headers.some(({ key }) => {
      const cellId = getCellId(rowId, key);
      const value = cellsById[cellId].value;
      const filterableValue =
        value?.filterableValue?.toString() ?? value?.toString() ?? "";
      return filterableValue
        .replace(/\s/g, "")
        .toLowerCase()
        .includes(inputValue.replace(/\s/g, "").toLowerCase());
    })
  );
}

function useOfflinePatientTableHeaders() {
  const { t } = useTranslation();
  return useMemo(
    () => [
      {
        key: "name",
        header: t("offlinePatientsTableHeaderName", "Name"),
      },
      {
        key: "lastUpdated",
        header: t("offlinePatientsTableHeaderLastUpdated", "Last updated"),
      },
      {
        key: "gender",
        header: t("offlinePatientsTableHeaderGender", "Gender"),
      },
      {
        key: "age",
        header: t("offlinePatientsTableHeaderAge", "Age"),
      },
    ],
    [t]
  );
}

function useOfflinePatientTableRows(syncingPatientUuids: Array<string>) {
  const offlinePatientsSwr = useOfflinePatientsWithEntries();
  const offlineRegisteredPatientsSwr = useOfflineRegisteredPatients();

  return useMemo(() => {
    const result = [];
    const mapPatientToRow = (
      patient: fhir.Patient,
      isNewlyRegistered: boolean,
      lastSyncState?: DynamicOfflineDataSyncState
    ) => ({
      id: patient.id,
      name: {
        value: (
          <PatientNameTableCell
            key={patient.id}
            patient={patient}
            isNewlyRegistered={isNewlyRegistered}
          />
        ),
        filterableValue: JSON.stringify(patient.name),
      },
      lastUpdated: isNewlyRegistered ? (
        "--"
      ) : (
        <LastUpdatedTableCell
          key={patient.id}
          patientUuid={patient.id}
          isSyncing={syncingPatientUuids.includes(patient.id)}
          lastSyncState={lastSyncState}
        />
      ),
      gender: capitalize(patient.gender),
      age: patient.birthDate ? age(patient.birthDate) : "",
    });

    for (const patient of offlineRegisteredPatientsSwr.data ?? []) {
      result.push(mapPatientToRow(patient, true));
    }

    for (const { patient, entry } of offlinePatientsSwr.data ?? []) {
      result.push(mapPatientToRow(patient, false, entry.syncState));
    }

    return result;
  }, [
    syncingPatientUuids,
    offlinePatientsSwr.data,
    offlineRegisteredPatientsSwr.data,
  ]);
}

async function syncSelectedOfflinePatients(
  selectedPatientUuids: Array<string>
) {
  const offlinePatientEntries = await getDynamicOfflineDataEntries("patient");
  const syncablePatientUuids = offlinePatientEntries.map(
    (entry) => entry.identifier
  );
  const offlinePatientUuidsToSync = selectedPatientUuids.filter((id) =>
    syncablePatientUuids.includes(id)
  );

  return await Promise.all(
    offlinePatientUuidsToSync.map((patientUuid) =>
      syncDynamicOfflineData("patient", patientUuid)
    )
  );
}

async function removeSelectedOfflinePatients(
  selectedPatientUuids: Array<string>
) {
  const offlinePatientEntries = await getDynamicOfflineDataEntries("patient");
  const offlineRegisteredPatients = await getFullSynchronizationItems<{
    fhirPatient: fhir.Patient;
  }>("patient-registration");
  const offlinePatientUuidsToBeDeleted = selectedPatientUuids.filter((id) =>
    offlinePatientEntries.some((entry) => entry.identifier === id)
  );
  const offlineRegisteredPatientUuidsToBeDeleted = selectedPatientUuids.filter(
    (id) => !offlinePatientUuidsToBeDeleted.includes(id)
  );

  const promises = [
    ...offlinePatientUuidsToBeDeleted.map((patientUuid) =>
      removeDynamicOfflineData("patient", patientUuid)
    ),
    ...offlineRegisteredPatientUuidsToBeDeleted.map(async (patientUuid) => {
      const offlineRegisteredPatient = offlineRegisteredPatients.find(
        (syncItem) => syncItem.content.fhirPatient.id === patientUuid
      );

      if (offlineRegisteredPatient) {
        await deleteSynchronizationItem(offlineRegisteredPatient.id);
      }
    }),
  ];

  await Promise.all(promises);
}

export default OfflinePatientTable;
