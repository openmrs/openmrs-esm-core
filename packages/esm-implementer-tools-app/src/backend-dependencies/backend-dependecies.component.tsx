import React, { Fragment, useEffect, useState } from "react";
import {
  checkModules,
  MissingBackendModules,
} from "./openmrs-backend-dependencies";
import style from "./backend-dependencies-style.css";

export default function BackendModule(props: BackendModulesProps) {
  const [
    modulesWithMissingBackendModules,
    setModulesWithMissingBackendModules,
  ] = useState<Array<MissingBackendModules>>([]);
  const [
    modulesWithWrongBackendModulesVersion,
    setModulesWithWrongBackendModulesVersion,
  ] = useState<Array<MissingBackendModules>>([]);

  useEffect(() => {
    if (
      modulesWithMissingBackendModules.length ||
      modulesWithWrongBackendModulesVersion.length
    ) {
      props.setHasAlert(true);
    }
  }, [modulesWithMissingBackendModules, modulesWithWrongBackendModulesVersion]);

  useEffect(() => {
    const modules = window.installedModules
      .filter((module) => module[1].backendDependencies)
      .map((module) => ({
        backendDependencies: module[1].backendDependencies,
        moduleName: module[0],
      }));
    checkModules(modules).then(
      ({
        modulesWithMissingBackendModules,
        modulesWithWrongBackendModulesVersion,
      }) => {
        setModulesWithMissingBackendModules(modulesWithMissingBackendModules);
        setModulesWithWrongBackendModulesVersion(
          modulesWithWrongBackendModulesVersion
        );
      }
    );
  }, []);

  return (
    <div className={style.panel}>
      <div className={style}>
        {modulesWithMissingBackendModules.length > 0 && (
          <div>
            <h4>Missing openmrs backend modules</h4>
            <table className={style.backendtable}>
              <tbody>
                {Object.keys(modulesWithMissingBackendModules).map((key) => {
                  return (
                    <Fragment key={key}>
                      {modulesWithMissingBackendModules[key].backendModules
                        .length > 0 && (
                        <>
                          <tr>
                            <td colSpan={3}>
                              <b>
                                {
                                  modulesWithMissingBackendModules[key]
                                    .moduleName
                                }
                              </b>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <b>Module Name</b>
                            </td>
                            <td>
                              <b>Version</b>
                            </td>
                          </tr>
                          {modulesWithMissingBackendModules[
                            key
                          ].backendModules.map((module: any) => {
                            return (
                              <tr key={module.uuid}>
                                <td>{module.uuid}</td>
                                <td>{module.version}</td>
                              </tr>
                            );
                          })}
                        </>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {modulesWithWrongBackendModulesVersion.length > 0 && (
          <div>
            <h4>Modules with wrong versions installed</h4>
            <table className={style.backendtable}>
              <tbody>
                {Object.keys(modulesWithWrongBackendModulesVersion).map(
                  (key) => {
                    return (
                      <Fragment key={key}>
                        {modulesWithWrongBackendModulesVersion[key]
                          .backendModules.length > 0 && (
                          <>
                            <tr>
                              <td colSpan={3}>
                                <b>
                                  {
                                    modulesWithWrongBackendModulesVersion[key]
                                      .moduleName
                                  }
                                </b>
                              </td>
                            </tr>
                            <tr>
                              <td>Module Name</td>
                              <td>Installed Version</td>
                              <td>Required Version</td>
                            </tr>
                            {modulesWithWrongBackendModulesVersion[
                              key
                            ].backendModules.map((module: any) => {
                              return (
                                <tr key={module.uuid}>
                                  <td>{module.uuid}</td>
                                  <td>{module.version}</td>
                                  <td>{module.requiredVersion}</td>
                                </tr>
                              );
                            })}
                          </>
                        )}
                      </Fragment>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

type BackendModulesProps = {
  setHasAlert(value: boolean): void;
};
