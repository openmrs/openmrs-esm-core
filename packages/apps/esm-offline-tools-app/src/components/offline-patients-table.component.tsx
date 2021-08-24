import {
  DataTable,
  DataTableProps,
  DataTableSkeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableContainerProps,
  TableHead,
  TableHeader,
  TableRow,
} from "carbon-components-react";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useOfflinePatientDataStore } from "../hooks/offline-patient-data-hooks";

export interface OfflinePatientsTableProps {
  isInteractive: boolean;
}

const OfflinePatientsTable: React.FC<OfflinePatientsTableProps> = ({
  isInteractive,
}) => {
  const store = useOfflinePatientDataStore();
  const patientUuids = useMemo(
    () => Object.keys(store.offlinePatientDataSyncState),
    [store]
  );
  const { t } = useTranslation();
  const { isFetching, data } = usePatientsQuery(patientUuids);
  const headers = [
    {
      key: "name",
      header: t("patientsTableHeaderName", "Name"),
    },
    {
      key: "lastUpdated",
      header: t("patientsTableHeaderLastUpdated", "Last updated"),
    },
  ];
  const rows = isFetching
    ? []
    : Object.entries(store.offlinePatientDataSyncState).map(
        ([patientUuid, syncState]) => ({
          id: patientUuid,
          name: "<PATIENT NAME>",
          lastUpdated: syncState.timestamp?.toLocaleDateString(),
        })
      );

  if (isFetching) {
    return <DataTableSkeleton />;
  }

  return (
    <>
      <DataTable rows={rows} headers={headers}>
        {({
          rows,
          headers,
          getTableProps,
          getHeaderProps,
          getRowProps,
          getTableContainerProps,
        }) => (
          <TableContainer
            title={t("patientsTableTitle", "Offline patients")}
            {...getTableContainerProps()}
          >
            <Table {...getTableProps()} isSortable useZebraStyles>
              <TableHead>
                <TableRow>
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
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
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

export default OfflinePatientsTable;
