import React, { Fragment, useEffect, useState } from "react";
import style from "./backend-dependencies-style.css";
import DataTable, {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
} from "carbon-components-react/es/components/DataTable";
import {
  FrontendModule,
  ModuleDiagnosticsProps,
  parseUnresolvedDeps,
} from "./helpers/backend-dependecies-helper";
import { useTranslation } from "react-i18next";

export const ModuleDiagnostics: React.FC<ModuleDiagnosticsProps> = ({
  modulesWithMissingBackendModules,
  modulesWithWrongBackendModulesVersion,
  setHasAlert,
}) => {
  const { t } = useTranslation();
  const [unresolvedDeps, setUnresolvedDeps] = useState<Array<FrontendModule>>(
    []
  );

  useEffect(() => {
    if (
      !modulesWithMissingBackendModules.length &&
      !modulesWithWrongBackendModulesVersion.length
    )
      return;

    setUnresolvedDeps(
      parseUnresolvedDeps(
        modulesWithWrongBackendModulesVersion,
        modulesWithMissingBackendModules
      )
    );
    setHasAlert(true);
  }, [modulesWithMissingBackendModules, modulesWithWrongBackendModulesVersion]);

  const headers = [
    {
      key: "name",
      header: "Module Name",
    },
    {
      key: "installedVersion",
      header: t("installedVersion", "Installed Version"),
    },
    {
      key: "requiredVersion",
      header: t("requiredVersion", "Required Version"),
    },
  ];
  return (
    <div className={style.panel}>
      <div>
        <DataTable rows={[]} headers={headers}>
          {({ headers, getTableProps, getHeaderProps }) => (
            <TableContainer title={""}>
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
                  {unresolvedDeps.map((esm, i) => (
                    <Fragment key={`${esm.name}-${i}`}>
                      <TableRow>
                        <TableCell>
                          <strong>{esm.name}</strong>
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      {esm.unresolvedDeps.map((dep, j) => (
                        <TableRow key={`${dep.name}-${j}`}>
                          <TableCell>{dep.name}</TableCell>
                          <TableCell>
                            {dep.type === "missing" ? (
                              <span style={{ color: "red" }}>
                                {t("missing", "Missing")}
                              </span>
                            ) : (
                              dep.installedVersion
                            )}
                          </TableCell>
                          <TableCell>{dep.requiredVersion}</TableCell>
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
    </div>
  );
};
