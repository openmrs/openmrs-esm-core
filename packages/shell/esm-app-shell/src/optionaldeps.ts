import {
  type FeatureFlagDefinition,
  openmrsFetch,
  registerFeatureFlag,
  setFeatureFlag,
  restBaseUrl,
} from '@openmrs/esm-framework/src/internal';
import { satisfies } from 'semver';

export function setupOptionalDependencies() {
  const optionalDependencyFlags = window.installedModules.reduce<
    Map<string, { version: string; feature: FeatureFlagDefinition }>
  >((curr, module) => {
    if (module[1]?.optionalBackendDependencies) {
      Object.entries(module[1].optionalBackendDependencies).forEach((optionalDependency) => {
        const optionalDependencyDescriptor = optionalDependency[1];
        if (typeof optionalDependencyDescriptor !== 'string') {
          if (
            typeof optionalDependencyDescriptor.feature === 'object' &&
            optionalDependencyDescriptor.feature &&
            optionalDependencyDescriptor.feature.flagName?.length > 0 &&
            optionalDependencyDescriptor.feature.label?.length > 0 &&
            optionalDependencyDescriptor.feature.description?.length > 0
          ) {
            curr.set(optionalDependency[0], {
              version: optionalDependencyDescriptor.version,
              feature: optionalDependencyDescriptor.feature,
            });
          } else {
            console.warn(
              `Feature flag descriptor for ${module[0]} does not match expected type. Feature flags must define a 'flagName', 'label', and 'description'`,
            );
          }
        }
      });
    }

    return curr;
  }, new Map());

  if (optionalDependencyFlags.size > 0) {
    openmrsFetch<{ results: { uuid: string; version: string }[] }>(`${restBaseUrl}/module?v=custom:(uuid,version)`)
      .then((response) => {
        (response.data.results ?? []).forEach((backendModule) => {
          if (optionalDependencyFlags.has(backendModule.uuid)) {
            const optionalDependency = optionalDependencyFlags.get(backendModule.uuid);
            if (
              optionalDependency &&
              satisfies(backendModule.version, optionalDependency.version, { includePrerelease: true })
            ) {
              registerFeatureFlag(
                optionalDependency.feature.flagName,
                optionalDependency.feature.label,
                optionalDependency.feature.description,
              );

              setFeatureFlag(optionalDependency.feature.flagName, true);
            }
          }
        });
      })
      .catch(() => {}); // swallow any issues fetching
  }
}
