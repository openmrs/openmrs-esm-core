import React, { Fragment, useMemo } from "react";
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
} from "@carbon/react";
import styles from "./frontend-modules.scss";
import type { FrontendModule } from "../types";

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
    <div className={styles.container}>
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
                  <Fragment key={esm.name}>
                    <TableRow>
                      <TableCell>
                        <span className={styles.moduleHeader}>{esm.name}</span>
                      </TableCell>
                      <TableCell>
                        {esm.version ?? t("unknownVersion", "unknown")}
                      </TableCell>
                    </TableRow>
                    {Boolean(esm.extensions) ? (
                      <TableRow key={`${esm.name}-extensions-header`}>
                        <TableCell>
                          <span className={styles.moduleComponentHeader}>
                            {t("extensions", "Extensions")}
                          </span>
                        </TableCell>
                        <TableCell />
                      </TableRow>
                    ) : null}
                    {(esm.extensions ?? []).map((extension, i) => (
                      <TableRow key={`${esm.name}-page-${i}`}>
                        <TableCell>{extension.name}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    ))}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
    </div>
  );
};
