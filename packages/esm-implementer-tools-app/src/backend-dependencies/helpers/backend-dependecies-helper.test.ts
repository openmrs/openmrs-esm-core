import { parseUnresolvedDeps } from "./backend-dependecies-helper";

describe("parseUnresolvedDeps", () => {
  it("should merge and parse missing and mismatched deps into unresolved frontend deps", () => {
    const modulesWithMissingDeps = [
      {
        moduleName: "openmrs-esm-patient-registration",
        backendModules: [
          {
            uuid: "fhir",
            version: "^1.4.2",
          },
        ],
      },
    ];
    const modulesWithVersionMismatchedDeps = [
      {
        moduleName: "openmrs-esm-home",
        backendModules: [
          {
            uuid: "appui",
            version: "1.4.2",
            requiredVersion: "1.10.0",
          },
        ],
      },
    ];
    expect(
      parseUnresolvedDeps(
        modulesWithVersionMismatchedDeps,
        modulesWithMissingDeps
      )
    ).toEqual([
      {
        name: "openmrs-esm-home",
        unresolvedDeps: [
          {
            name: "appui",
            installedVersion: "1.4.2",
            requiredVersion: "1.10.0",
            type: "version-mismatch",
          },
        ],
      },
      {
        name: "openmrs-esm-patient-registration",
        unresolvedDeps: [
          {
            name: "fhir",
            requiredVersion: "^1.4.2",
            type: "missing",
          },
        ],
      },
    ]);
  });

  it("should merge the backend deps of similar esms", () => {
    const modulesWithMissingDeps = [
      {
        moduleName: "openmrs-esm-login-app",
        backendModules: [
          {
            uuid: "fhir",
            version: "^1.4.2",
          },
        ],
      },
    ];
    const modulesWithVersionMismatchedDeps = [
      {
        moduleName: "openmrs-esm-home",
        backendModules: [
          {
            uuid: "appui",
            version: "1.4.2",
            requiredVersion: "1.10.0",
          },
        ],
      },
      {
        moduleName: "openmrs-esm-login-app",
        backendModules: [
          {
            uuid: "webservice.rest",
            version: "2.2",
            requiredVersion: "2.24.0",
          },
        ],
      },
    ];
    expect(
      parseUnresolvedDeps(
        modulesWithVersionMismatchedDeps,
        modulesWithMissingDeps
      )
    ).toEqual([
      {
        name: "openmrs-esm-home",
        unresolvedDeps: [
          {
            name: "appui",
            installedVersion: "1.4.2",
            requiredVersion: "1.10.0",
            type: "version-mismatch",
          },
        ],
      },
      {
        name: "openmrs-esm-login-app",
        unresolvedDeps: [
          {
            name: "fhir",
            requiredVersion: "^1.4.2",
            type: "missing",
          },
          {
            name: "webservice.rest",
            installedVersion: "2.2",
            requiredVersion: "2.24.0",
            type: "version-mismatch",
          },
        ],
      },
    ]);
  });
});
