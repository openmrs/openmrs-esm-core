import React, { useEffect } from "react";
import { MissingBackendModules } from "./openmrs-backend-dependencies";
import style from "./backend-dependencies-style.css";
import {
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  Grid,
  Row,
} from "carbon-components-react";

export const BackendModule: React.FC<BackendModulesProps> = ({
  modulesWithMissingBackendModules,
  modulesWithWrongBackendModulesVersion,
  setHasAlert,
}) => {
  useEffect(() => {
    if (
      modulesWithMissingBackendModules.length ||
      modulesWithWrongBackendModulesVersion.length
    ) {
      setHasAlert(true);
    }
  }, [modulesWithMissingBackendModules, modulesWithWrongBackendModulesVersion]);

  const getRows = (esms: Array<MissingBackendModules>) => {
    let counter = 0;
    let rows: Array<RowProps> = [];
    esms
      .filter((esm) => esm.backendModules.length > 0)
      .forEach((esm) => {
        rows.push({
          id: counter.toString(),
          name: esm.moduleName,
          isFrontendModule: true,
        });
        const unresolvedBackendDeps = esm.backendModules.map((m) => {
          counter++;
          return {
            id: counter.toString(),
            name: m.uuid,
            installedVersion: m.version,
            requiredVersion: m.requiredVersion,
          };
        }) as Array<RowProps>;
        rows = rows.concat(unresolvedBackendDeps);
        counter++;
      });
    return rows;
  };

  const missingModulesTableProps: TableProps = {
    headers: [
      {
        key: "name",
        header: "Module Name",
      },
      {
        key: "installedVersion",
        header: "Installed Version",
      },
    ],
    rows: getRows(modulesWithMissingBackendModules),
    title: "Missing openmrs backend modules",
  };

  const modulesWithWrongVersionsTableProps: TableProps = {
    headers: [
      {
        key: "name",
        header: "Module Name",
      },
      {
        key: "installedVersion",
        header: "Installed Version",
      },
      {
        key: "requiredVersion",
        header: "Required Version",
      },
    ],
    rows: getRows(modulesWithWrongBackendModulesVersion),
    title: "Modules with wrong versions installed",
  };

  const containsEsmTitle = (row) => {
    let counter = 0;
    row.cells.forEach((cell) => {
      if (cell.value) {
        counter++;
      }
    });
    return counter == 1;
  };

  const carbonTable = (props: TableProps) => {
    return (
      <DataTable rows={props.rows} headers={props.headers}>
        {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
          <TableContainer title={props.title}>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow {...getRowProps({ row })}>
                    {row.cells.map((cell) => {
                      return containsEsmTitle(row) && cell.value ? (
                        <TableCell key={cell.id}>
                          <strong>{cell.value}</strong>
                        </TableCell>
                      ) : (
                        <TableCell key={cell.id}>{cell.value}</TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
    );
  };

  return (
    <div className={style.panel}>
      <div className={style.tableWrapper}>
        {carbonTable(missingModulesTableProps)}
      </div>
      <div className={style.tableWrapper}>
        {carbonTable(modulesWithWrongVersionsTableProps)}
      </div>
    </div>
  );
};

type BackendModulesProps = {
  setHasAlert(value: boolean): void;
  modulesWithMissingBackendModules: Array<MissingBackendModules>;
  modulesWithWrongBackendModulesVersion: Array<MissingBackendModules>;
};

interface TableProps {
  rows: Array<RowProps>;
  headers: Array<{ key: string; header: string }>;
  title?: string;
}

interface RowProps {
  id: string;
  requiredVersion?: string;
  installedVersion?: string;
  name: string;
  isSelected?: boolean;
  isFrontendModule?: boolean;
}
