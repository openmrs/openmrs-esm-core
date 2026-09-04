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

interface Compilation {
  errors: Array<Error>;
  warnings: Array<Error>;
}

/** The subset of a resolution we need: what was asked for, and which file asked for it. */
interface ResolveData {
  request?: string;
  contextInfo?: { issuer?: string };
}

interface Tap<T> {
  tap(name: string, callback: (value: T) => void): void;
}

interface Compiler {
  /** The directory the build runs in, i.e. the root of the app being built. */
  context: string;
  hooks: {
    normalModuleFactory: Tap<{ hooks: { afterResolve: Tap<ResolveData> } }>;
    thisCompilation: Tap<Compilation>;
    afterEmit: Tap<Compilation>;
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
  const locations = [
    () => require.resolve(frameworkManifest, { paths: [context] }),
    () => require.resolve(frameworkManifest),
  ];

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
  private readonly configuredPackages: Array<string> | undefined;

  /**
   * Offending imports found in the compilation currently running, keyed by the file that made them.
   * Reset for each compilation so a watch rebuild does not inherit the previous run's findings.
   */
  private offenders = new Map<string, Set<string>>();

  constructor({ allowedPackages = ['@openmrs/esm-framework'], frameworkPackages }: FrameworkImportGuardOptions = {}) {
    this.allowedPackages = allowedPackages;
    this.configuredPackages = frameworkPackages;
  }

  apply(compiler: Compiler) {
    // Imports are collected as they resolve rather than read back out of the finished module graph.
    // By the time a build is sealed, `optimization.concatenateModules` has merged scope-hoisted
    // modules into single stats entries whose nested modules carry no reasons at all, so a direct
    // import of a framework package leaves no trace there — production builds would pass whatever
    // they import. A resolution has not been optimised yet, and it names both the literal request
    // and the file that made it.
    compiler.hooks.normalModuleFactory.tap(pluginName, (factory) => {
      factory.hooks.afterResolve.tap(pluginName, (resolveData) => {
        this.record(compiler.context, resolveData);
      });
    });

    compiler.hooks.thisCompilation.tap(pluginName, () => {
      this.offenders = new Map();
    });

    compiler.hooks.afterEmit.tap(pluginName, (compilation) => {
      this.report(compiler.context, compilation);
    });
  }

  private guardedPackages(context: string) {
    const known = this.configuredPackages ?? getFrameworkPackages(context);
    return known.filter((pkg) => !this.allowedPackages.includes(pkg));
  }

  private record(context: string, { request = '', contextInfo }: ResolveData) {
    const issuer = contextInfo?.issuer ?? '';
    const pkg = packageOf(request, this.guardedPackages(context));

    if (!pkg || !issuer) {
      return;
    }

    // Imports between framework packages are the framework's own business, as is anything Module
    // Federation pulls in to build a share or the fallback behind it.
    if (frameworkModulePattern.test(issuer) || isFederationModule(issuer)) {
      return;
    }

    // Stylesheets pull rules and variables straight out of the styleguide. That is a stylesheet
    // dependency with no runtime state behind it, so it is allowed.
    if (pkg === '@openmrs/esm-styleguide' && stylesheetPattern.test(issuer)) {
      return;
    }

    const relative = issuer.startsWith(context) ? `.${issuer.slice(context.length)}` : issuer;
    const requests = this.offenders.get(relative) ?? new Set<string>();
    requests.add(request);
    this.offenders.set(relative, requests);
  }

  private report(context: string, compilation: Compilation) {
    if (this.guardedPackages(context).length === 0) {
      compilation.warnings.push(
        new Error(
          `${pluginName} could not read the dependencies of @openmrs/esm-framework, so imports of ` +
            'framework packages were not checked. Pass `frameworkPackages` to check them anyway.',
        ),
      );
      return;
    }

    if (this.offenders.size === 0) {
      return;
    }

    const detail = Array.from(
      this.offenders,
      ([issuer, requests]) => `  ${issuer} imports ${[...requests].join(', ')}`,
    );
    compilation.errors.push(
      new Error(
        `${pluginName}: these imports reach into the internals of @openmrs/esm-framework, which bundles a ` +
          "private copy of that package rather than sharing the app shell's. Import from " +
          "'@openmrs/esm-framework' instead:\n" +
          detail.join('\n'),
      ),
    );
  }
}

export default FrameworkImportGuardPlugin;
