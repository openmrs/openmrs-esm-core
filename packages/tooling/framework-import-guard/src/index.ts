/**
 * A webpack/rspack plugin that fails a build which reaches into the framework's internals.
 *
 * `@openmrs/esm-framework` is a facade over a set of sibling packages (`@openmrs/esm-state`,
 * `@openmrs/esm-styleguide`, `@openmrs/esm-api`, ...) and only the facade is a Module Federation
 * share key. Federation matches shares against the literal import request, so importing a sibling
 * by name never becomes a consume-share: it statically links that package into the app. Where the
 * package carries module-level state — `esm-state`'s store registry, the extension registry, the
 * config store — the app then runs against its own copy of state the framework treats as a
 * singleton. Nothing fails loudly; the app simply stops sharing stores with everything else on the
 * page.
 *
 * The one legitimate exception is SCSS reaching into `@openmrs/esm-styleguide` for rules and
 * variables, which is a stylesheet-level dependency and carries no runtime state.
 */

interface StatsModuleReason {
  moduleName?: string | null;
  userRequest?: string | null;
}

interface StatsModule {
  name?: string | null;
  reasons?: Array<StatsModuleReason>;
}

interface Compilation {
  errors: Array<Error>;
  warnings: Array<Error>;
  getStats(): { toJson(options: Record<string, boolean>): { modules?: Array<StatsModule> } };
}

interface Compiler {
  /** The directory the build runs in, i.e. the root of the app being built. */
  context: string;
  hooks: {
    afterEmit: {
      tap(name: string, callback: (compilation: Compilation) => void): void;
    };
  };
}

export interface FrameworkImportGuardOptions {
  /**
   * Packages that may be imported directly. Anything else belonging to the framework is an error.
   */
  allowedPackages?: Array<string>;
  /**
   * The framework packages to guard. Only needed where they cannot be discovered from the
   * framework's own manifest, such as an installation that hides transitive dependencies.
   */
  frameworkPackages?: Array<string>;
}

const pluginName = 'FrameworkImportGuardPlugin';

/**
 * Matches a module belonging to a framework package. Covers an ordinary `node_modules/@openmrs/...`
 * install, pnpm's `node_modules/.pnpm/@openmrs+esm-state@.../node_modules/@openmrs/...` layout, and
 * the workspace paths (`../../framework/esm-styleguide/...`) used when the framework is built from
 * source alongside the app.
 */
const frameworkModulePattern = /(?:node_modules[\\/]@openmrs[\\/]|[\\/]framework[\\/])esm-[a-z-]+[\\/]/;

const stylesheetPattern = /\.(?:s[ac]ss|css)\b/;

/** Module Federation's own wrappers; what they reach is the share or the fallback behind it. */
function isFederationModule(name: string) {
  return name.startsWith('consume shared module') || name.startsWith('provide shared module');
}

const frameworkManifest = '@openmrs/esm-framework/package.json';

/**
 * The framework's siblings, read from the framework's own dependencies so that a package added
 * upstream is covered without a change here.
 *
 * Resolution starts from the directory being built rather than from this package. That is the copy
 * of `@openmrs/esm-framework` whose internals the app could reach into, and in a single-app repo
 * this plugin arrives as a transitive dependency of `openmrs`, from where the framework is not
 * guaranteed to resolve at all. Resolution from this package is the fallback, for a monorepo whose
 * apps have no local copy of the framework.
 */
function getFrameworkPackages(context: string): Array<string> {
  const locations = [() => require.resolve(frameworkManifest, { paths: [context] }), () => require.resolve(frameworkManifest)];

  for (const locate of locations) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { dependencies } = require(locate());
      const siblings = Object.keys(dependencies ?? {}).filter((dependency) => dependency.startsWith('@openmrs/'));

      if (siblings.length > 0) {
        return siblings;
      }
    } catch {
      // Try the next location.
    }
  }

  return [];
}

function packageOf(request: string, packages: Array<string>) {
  return packages.find((pkg) => request === pkg || request.startsWith(`${pkg}/`));
}

export class FrameworkImportGuardPlugin {
  private readonly allowedPackages: Array<string>;
  private readonly frameworkPackages: Array<string> | undefined;

  constructor({
    allowedPackages = ['@openmrs/esm-framework'],
    frameworkPackages,
  }: FrameworkImportGuardOptions = {}) {
    this.allowedPackages = allowedPackages;
    this.frameworkPackages = frameworkPackages;
  }

  apply(compiler: Compiler) {
    compiler.hooks.afterEmit.tap(pluginName, (compilation) => {
      const known = this.frameworkPackages ?? getFrameworkPackages(compiler.context);
      const guarded = known.filter((pkg) => !this.allowedPackages.includes(pkg));

      if (guarded.length === 0) {
        compilation.warnings.push(
          new Error(
            `${pluginName} could not read the dependencies of @openmrs/esm-framework, so imports of ` +
              'framework packages were not checked. Pass `frameworkPackages` to check them anyway.',
          ),
        );
        return;
      }

      const { modules = [] } = compilation.getStats().toJson({ all: false, modules: true, reasons: true });
      const offenders = new Map<string, Set<string>>();

      for (const module of modules) {
        const moduleName = module.name ?? '';

        if (isFederationModule(moduleName)) {
          continue;
        }

        for (const reason of module.reasons ?? []) {
          const request = reason.userRequest ?? '';
          const issuer = reason.moduleName ?? '';
          const pkg = packageOf(request, guarded);

          if (!pkg) {
            continue;
          }

          // Imports between framework packages are the framework's own business.
          if (isFederationModule(issuer) || frameworkModulePattern.test(issuer)) {
            continue;
          }

          // SCSS pulls rules and variables straight out of the styleguide. That is a stylesheet
          // dependency with no runtime state behind it, so it is allowed.
          if (
            pkg === '@openmrs/esm-styleguide' &&
            (stylesheetPattern.test(issuer) || stylesheetPattern.test(moduleName) || stylesheetPattern.test(request))
          ) {
            continue;
          }

          const requests = offenders.get(issuer) ?? new Set<string>();
          requests.add(request);
          offenders.set(issuer, requests);
        }
      }

      if (offenders.size === 0) {
        return;
      }

      const detail = Array.from(offenders, ([issuer, requests]) => `  ${issuer} imports ${[...requests].join(', ')}`);
      compilation.errors.push(
        new Error(
          `${pluginName}: these imports reach into the internals of @openmrs/esm-framework, which bundles a ` +
            "private copy of that package rather than sharing the app shell's. Import from " +
            "'@openmrs/esm-framework' instead:\n" +
            detail.join('\n'),
        ),
      );
    });
  }
}

export default FrameworkImportGuardPlugin;
