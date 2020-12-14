import React, { Fragment, useEffect, useState } from "react";
import { MissingBackendModules } from "./openmrs-backend-dependencies";
import style from "./backend-dependencies-style.css";
import { find } from "lodash-es";
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

export const ModuleDiagnostics: React.FC<ModuleDiagnosticsProps> = ({
  modulesWithMissingBackendModules,
  modulesWithWrongBackendModulesVersion,
  setHasAlert,
}) => {
  const [unresolvedDeps, setUnresolvedDeps] = useState<Array<FrontendModule>>(
    []
  );
  let counter: number = 0;

  useEffect(() => {
    if (
      modulesWithMissingBackendModules.length ||
      modulesWithWrongBackendModulesVersion.length
    ) {
      let similarEsms: Array<MissingBackendModules> = [];
      setUnresolvedDeps(
        modulesWithWrongBackendModulesVersion.map((m) => {
          const similarEsm = find(modulesWithMissingBackendModules, {
            moduleName: m.moduleName,
          });
          let leavesForSimilarEsm: Array<UnresolvedBackendDependency> = [];
          if (similarEsm) {
            leavesForSimilarEsm = similarEsm.backendModules.map(
              (m) =>
                ({
                  name: m.uuid,
                  requiredVersion: m.version,
                  type: "missing",
                } as UnresolvedBackendDependency)
            );
            similarEsms.push(similarEsm);
          }
          const leaves = m.backendModules.map(
            (m) =>
              ({
                name: m.uuid,
                installedVersion: m.version,
                requiredVersion: m.requiredVersion,
                type: "version-mismatch",
              } as UnresolvedBackendDependency)
          );
          return {
            name: m.moduleName,
            unresolvedDeps: [...leaves, ...leavesForSimilarEsm],
          };
        })
      );
      modulesWithMissingBackendModules.forEach((m) => {
        if (!similarEsms.includes(m)) {
          const leaves = m.backendModules.map(
            (m) =>
              ({
                name: m.uuid,
                requiredVersion: m.version,
                type: "missing",
              } as UnresolvedBackendDependency)
          );
          unresolvedDeps.push({
            name: m.moduleName,
            unresolvedDeps: [...leaves],
          });
        }
      });
      setHasAlert(true);
    }
  }, [modulesWithMissingBackendModules, modulesWithWrongBackendModulesVersion]);

  const nextId = () => {
    counter++;
    return counter.toString();
  };

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
                  {unresolvedDeps.map((esm, key) => (
                    <Fragment key={key}>
                      <TableRow key={nextId()}>
                        <TableCell key={nextId()}>
                          <strong>{esm.name}</strong>
                        </TableCell>
                        <TableCell key={nextId()}>{undefined}</TableCell>
                        <TableCell key={nextId()}>{undefined}</TableCell>
                      </TableRow>
                      {esm.unresolvedDeps.map((dep) => (
                        <TableRow key={nextId()}>
                          <TableCell key={nextId()}>{dep.name}</TableCell>
                          {dep.type === "missing" ? (
                            <TableCell key={nextId()}>
                              <span style={{ color: "red" }}>Missing</span>
                            </TableCell>
                          ) : (
                            <TableCell key={nextId()}>
                              {dep.installedVersion}
                            </TableCell>
                          )}
                          <TableCell key={nextId()}>
                            {dep.requiredVersion}
                          </TableCell>
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

type ModuleDiagnosticsProps = {
  setHasAlert(value: boolean): void;
  modulesWithMissingBackendModules: Array<MissingBackendModules>;
  modulesWithWrongBackendModulesVersion: Array<MissingBackendModules>;
};

interface FrontendModule {
  name: string;
  unresolvedDeps: Array<UnresolvedBackendDependency>;
}

type DeficiencyType = "missing" | "version-mismatch";

interface UnresolvedBackendDependency {
  name: string;
  requiredVersion?: string;
  installedVersion?: string;
  type: DeficiencyType;
}
