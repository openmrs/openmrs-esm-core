import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  DataTable,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "carbon-components-react";

export interface FrontendModule {
  name: string;
  version?: string;
}

export interface FrontendModulesProps {
  frontendModules: Array<FrontendModule>;
}

export const FrontendModules: React.FC<FrontendModulesProps> = ({
  frontendModules,
}) => {
  const { t } = useTranslation();

  const headers = useMemo(
    () => [
      {
        key: "name",
        header: t("moduleName", "Module Name"),
      },
      {
        key: "installedVersion",
        header: t("installedVersion", "Installed Version"),
      },
    ],
    [t]
  );

  return (
    <div style={{ height: "50vh", overflowY: "auto" }}>
      <DataTable rows={[]} headers={headers}>
        {({ headers, getTableProps, getHeaderProps }) => (
          <TableContainer title="">
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
                {frontendModules.map((esm) => (
                  <TableRow key={esm.name}>
                    <TableCell>{esm.name}</TableCell>
                    <TableCell>
                      {esm.version ?? t("unknownVersion", "unknown")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
    </div>
  );
};
