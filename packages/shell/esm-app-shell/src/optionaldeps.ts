import {
  type FeatureFlagDefinition,
  openmrsFetch,
  registerFeatureFlag,
  setFeatureFlag,
  getCurrentUser,
  restBaseUrl,
} from '@openmrs/esm-framework/src/internal';
import { satisfies } from 'semver';

export function registerOptionalDependencyHandler() {
  const subscription = getCurrentUser().subscribe((session) => {
    if (session.authenticated) {
      subscription?.unsubscribe();
      setupOptionalDependencies();
    }
  });

  return Promise.resolve();
}

function setupOptionalDependencies() {
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
    fetchAllBackendModules()
      .then((backendModules) => {
        backendModules.forEach((backendModule) => {
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

/**
 * Fetches all backend modules with pagination support.
 * The API returns paginated results with a 'next' field pointing to the next page.
 *
 * @returns Array of backend modules with their uuid and version
 */
async function fetchAllBackendModules(): Promise<Array<{ uuid: string; version: string }>> {
  const collected: Array<{ uuid: string; version: string }> = [];
  let nextUrl: string | null = `${restBaseUrl}/module?v=custom:(uuid,version)`;
  const MAX_PAGES = 50;
  let safetyCounter = 0;

  // Normalizes the next URL to handle relative and absolute URLs
  const resolveNext = (url?: string | null) => {
    if (!url) {
      return null;
    }
    // Already a full URL
    if (/^https?:\/\//i.test(url)) {
      return url;
    }
    // Absolute path
    if (url.startsWith('/')) {
      return url;
    }
    // Relative path - prepend restBaseUrl
    return `${restBaseUrl}/${url.replace(/^\/?/, '')}`;
  };

  while (nextUrl && safetyCounter < MAX_PAGES) {
    const { data } = await openmrsFetch<{
      results: Array<{ uuid: string; version: string }>;
      next?: string | null;
    }>(nextUrl, { method: 'GET' });

    const pageResults: Array<{ uuid: string; version: string }> = Array.isArray(data?.results) ? data.results : [];
    collected.push(...pageResults);

    nextUrl = resolveNext(data?.next ?? null);
    safetyCounter += 1;
  }

  if (nextUrl && safetyCounter >= MAX_PAGES) {
    console.warn(
      `Reached maximum page limit (${MAX_PAGES}) while fetching backend modules. There may be more data available at: ${nextUrl}`,
    );
  }

  return collected;
}
