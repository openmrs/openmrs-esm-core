import React, { Fragment, useEffect, useState } from "react";
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
} from "carbon-components-react";
import {
  FrontendModule,
  ModuleDiagnosticsProps,
  parseUnresolvedDeps,
} from "./helpers/backend-dependecies-helper";

export const ModuleDiagnostics: React.FC<ModuleDiagnosticsProps> = ({
  modulesWithMissingBackendModules,
  modulesWithWrongBackendModulesVersion,
  setHasAlert,
}) => {
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
      header: "Installed Version",
    },
    {
      key: "requiredVersion",
      header: "Required Version",
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
                  {unresolvedDeps.map((esm, index) => (
                    <Fragment key={esm.name}>
                      <TableRow>
                        <TableCell>
                          <strong>{esm.name}</strong>
                        </TableCell>
                        <TableCell>{undefined}</TableCell>
                        <TableCell>{undefined}</TableCell>
                      </TableRow>
                      {esm.unresolvedDeps.map((dep) => (
                        <TableRow key={dep.name}>
                          <TableCell>{dep.name}</TableCell>
                          {dep.type === "missing" ? (
                            <TableCell>
                              <span style={{ color: "red" }}>Missing</span>
                            </TableCell>
                          ) : (
                            <TableCell>{dep.installedVersion}</TableCell>
                          )}
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
