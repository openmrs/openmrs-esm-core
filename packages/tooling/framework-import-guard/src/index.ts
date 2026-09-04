/**
 * A webpack/rspack plugin that fails a build which reaches into the framework's internals.
 *
 * `@openmrs/esm-framework` is a facade over a set of sibling packages (`@openmrs/esm-state`,
 * `@openmrs/esm-styleguide`, `@openmrs/esm-api`, ...). Module Federation matches shares against the
 * literal import request, and it does so before the resolver runs — so no amount of aliasing turns
 * an import of a sibling into a consume-share. Importing a sibling by name statically links it into
 * the app instead, and where that package carries module-level state — `esm-state`'s store
 * registry, the extension registry, the config store — the app then runs against its own copy of
 * state the framework treats as a singleton. Nothing fails loudly; the app simply stops sharing
 * with everything else on the page. Converting that into a build failure is the whole job.
 *
 * Two exceptions are legitimate. A sibling the app lists in its own `peerDependencies` really is a
 * share key, because the bundler config builds the Module Federation `shared` map out of them. And
 * a stylesheet may pull rules and variables out of `@openmrs/esm-styleguide`, which carries no
 * runtime state.
 *
 * Because "found nothing" and "checked nothing" must not look alike, every path that leaves the
 * guard unable to answer reports an error rather than passing quietly.
 */
import { realpathSync } from 'node:fs';
import { resolve } from 'node:path';

interface Compilation {
  errors: Array<Error>;
  warnings: Array<Error>;
}

/**
 * The subset of a resolution we need: what was asked for, and which file asked for it. Both fields
 * are required in webpack and in rspack, and declaring them so is what makes a bundler that stops
 * supplying them a compile error at the packages that construct this plugin rather than a guard
 * that silently sees nothing.
 */
interface ResolveData {
  request: string;
  contextInfo: { issuer: string };
}

interface Tap<T> {
  tap(name: string, callback: (value: T) => void): void;
}

interface Compiler {
  /** The directory the build runs in, i.e. the root of the app being built. */
  context: string;
  hooks: {
    normalModuleFactory: Tap<{ hooks: { afterResolve: Tap<ResolveData> } }>;
    thisCompilation: Tap<unknown>;
    afterCompile: Tap<Compilation>;
  };
}

export interface FrameworkImportGuardOptions {
  /**
   * Framework packages that may be imported directly, on top of the ones the app peer-depends on.
   * Defaults to the `@openmrs/esm-framework` facade, which is always allowed.
   */
  allowedPackages?: ReadonlyArray<string>;
  /**
   * The framework packages to guard, for an installation where they cannot be discovered from the
   * framework's own manifest. Passing this suppresses discovery, so an empty array disables the
   * guard deliberately and silently; omit it to have discovery failure reported as an error.
   */
  frameworkPackages?: ReadonlyArray<string>;
}

const pluginName = 'FrameworkImportGuardPlugin';
const frameworkManifest = '@openmrs/esm-framework/package.json';
const facade = '@openmrs/esm-framework';

/** Anchored, so that a source file such as `theme.css.ts` does not inherit the styleguide exemption. */
const stylesheetPattern = /\.(?:s[ac]ss|css)(?:\?.*)?$/;

/** Module Federation's own wrappers; what they reach is the share or the fallback behind it. */
function isFederationModule(name: string) {
  return name.startsWith('consume shared module') || name.startsWith('provide shared module');
}

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
function discoverFrameworkPackages(context: string): Array<string> {
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

/** Whatever the app peer-depends on ends up in the Module Federation `shared` map. */
function discoverSharedPeers(context: string): Array<string> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { peerDependencies } = require(resolve(context, 'package.json'));
    return Object.keys(peerDependencies ?? {});
  } catch {
    return [];
  }
}

function packageOf(request: string, packages: ReadonlyArray<string>) {
  return packages.find((pkg) => request === pkg || request.startsWith(`${pkg}/`));
}

/**
 * The prefixes an issuer may carry for the directory being built, so offending files are named
 * relative to the project. A bundler reports resolved, symlink-free paths, which need not share a
 * prefix with the context it was given — a project reached through a symlink, or anywhere under
 * macOS's `/tmp`, differ. Without the resolved form the message falls back to absolute paths.
 */
function projectRoots(context: string): Array<string> {
  const roots = [context.replace(/\\/g, '/')];

  try {
    const real = realpathSync.native(context).replace(/\\/g, '/');

    if (!roots.includes(real)) {
      roots.push(real);
    }
  } catch {
    // The context need not exist on disk.
  }

  return roots;
}

/**
 * Whether a file belongs to one of the framework's own packages, which are free to import each
 * other. Matched against the known package names rather than a name shape, so that a package that
 * merely looks like part of the framework — `@openmrs/esm-patient-common-lib`, an app consumed as a
 * library — is still held to the rule; those are bundled into the app and duplicate state exactly
 * as an app's own import would.
 */
function isFrameworkInternal(issuer: string, known: ReadonlyArray<string>) {
  return known.some((pkg) => {
    const unscoped = pkg.slice(pkg.indexOf('/') + 1);
    return issuer.includes(`/node_modules/${pkg}/`) || issuer.includes(`/framework/${unscoped}/`);
  });
}

export class FrameworkImportGuardPlugin {
  private readonly allowedPackages: ReadonlyArray<string>;
  private readonly configuredPackages: ReadonlyArray<string> | undefined;

  constructor({ allowedPackages = [facade], frameworkPackages }: FrameworkImportGuardOptions = {}) {
    // Copied because both are read again on every resolution behind a memo, and a caller mutating
    // the array it passed would otherwise change the answer partway through a build.
    this.allowedPackages = [...allowedPackages];
    this.configuredPackages = frameworkPackages && [...frameworkPackages];
  }

  apply(compiler: Compiler) {
    const { context } = compiler;
    const roots = projectRoots(context);

    /**
     * Findings live for as long as the compiler and are never retracted, keyed by the file that
     * made the import.
     *
     * A watch rebuild re-resolves only what changed, and `module.unsafeCache` — on by default in
     * development — serves modules under `node_modules` straight from cache without factorizing
     * them, which is where every framework package lives. So a rebuild sees neither the offending
     * import nor evidence that it is gone, and there is no signal here that distinguishes "fixed"
     * from "not looked at". Forgetting a finding therefore means the gate goes green with the
     * import still in the tree, which is the silent failure this plugin exists to remove. Holding
     * it instead costs a restart after a genuine fix, which the message says.
     */
    const offenders = new Map<string, Set<string>>();
    /** Which findings this compilation saw for itself, as opposed to inherited from an earlier one. */
    let confirmedThisCompilation = new Set<string>();
    let sawAnyResolution = false;
    let checkedCanary = false;
    let packages: ReturnType<FrameworkImportGuardPlugin['collectPackages']> | undefined;

    // Memoised: discovery reads manifests off disk and `record` runs for every resolved module.
    const collect = () => (packages ??= this.collectPackages(context));

    compiler.hooks.thisCompilation.tap(pluginName, () => {
      confirmedThisCompilation = new Set();
    });

    // Imports are collected as they resolve rather than read back out of the finished module graph.
    // Once a build is sealed, `optimization.concatenateModules` has folded scope-hoisted modules
    // into a single module whose parts report no reasons, so a direct import of a framework package
    // leaves no trace to find — production builds would pass whatever they imported.
    compiler.hooks.normalModuleFactory.tap(pluginName, (factory) => {
      factory.hooks.afterResolve.tap(pluginName, ({ request, contextInfo }) => {
        sawAnyResolution = true;
        this.record(roots, collect(), offenders, confirmedThisCompilation, request, contextInfo?.issuer ?? '');
      });
    });

    // Reported before anything is written. `afterEmit` is too late twice over: production sets
    // `optimization.emitOnErrors` to false, so a compilation that already has any other error skips
    // emitting and never reaches it, and on a clean run the offending bundle is on disk by then.
    compiler.hooks.afterCompile.tap(pluginName, (compilation) => {
      const canary = !checkedCanary && !sawAnyResolution;
      checkedCanary = true;
      this.report(collect(), offenders, confirmedThisCompilation, canary, compilation);
    });
  }

  private collectPackages(context: string) {
    const discovered = this.configuredPackages ?? discoverFrameworkPackages(context);
    const shared = new Set(discoverSharedPeers(context));
    const allowed = [facade, ...this.allowedPackages, ...discovered.filter((pkg) => shared.has(pkg))];

    return {
      /** False only when discovery was attempted and found nothing, which is a broken install. */
      known: this.configuredPackages !== undefined || discovered.length > 0,
      /** Every package belonging to the framework, whether guarded or allowed. */
      framework: [facade, ...discovered],
      guarded: discovered.filter((pkg) => !allowed.includes(pkg)),
    };
  }

  private record(
    roots: ReadonlyArray<string>,
    { guarded, framework }: ReturnType<FrameworkImportGuardPlugin['collectPackages']>,
    offenders: Map<string, Set<string>>,
    confirmedThisCompilation: Set<string>,
    request: string,
    issuer: string,
  ) {
    if (!issuer) {
      return;
    }

    const path = issuer.replace(/\\/g, '/');
    const root = roots.find((candidate) => path.startsWith(`${candidate}/`));
    const file = root ? `.${path.slice(root.length)}` : path;

    const pkg = packageOf(request ?? '', guarded);

    if (!pkg || isFrameworkInternal(path, framework) || isFederationModule(issuer)) {
      return;
    }

    if (pkg === '@openmrs/esm-styleguide' && stylesheetPattern.test(path)) {
      return;
    }

    const requests = offenders.get(file) ?? new Set<string>();
    requests.add(request);
    offenders.set(file, requests);
    confirmedThisCompilation.add(file);
  }

  private report(
    { known, guarded }: ReturnType<FrameworkImportGuardPlugin['collectPackages']>,
    offenders: Map<string, Set<string>>,
    confirmedThisCompilation: Set<string>,
    canary: boolean,
    compilation: Compilation,
  ) {
    if (!known) {
      compilation.errors.push(
        new Error(
          `${pluginName} could not read the dependencies of ${frameworkManifest}, so it cannot tell which ` +
            'imports are allowed. Install @openmrs/esm-framework where the build runs, or pass ' +
            '`frameworkPackages` to list the packages to guard.',
        ),
      );
      return;
    }

    if (guarded.length === 0) {
      return;
    }

    if (canary) {
      compilation.errors.push(
        new Error(
          `${pluginName} saw no module resolutions at all, so no import was checked. The bundler is not ` +
            'calling `normalModuleFactory.afterResolve` as this plugin expects.',
        ),
      );
      return;
    }

    if (offenders.size === 0) {
      return;
    }

    const detail = Array.from(offenders, ([file, requests]) => `  ${file} imports ${[...requests].join(', ')}`);
    const stale = Array.from(offenders.keys()).some((file) => !confirmedThisCompilation.has(file));

    compilation.errors.push(
      new Error(
        `${pluginName}: these imports reach into the internals of @openmrs/esm-framework. Importing one of its ` +
          "packages directly bundles a private copy of that package instead of sharing the app shell's, which " +
          `duplicates the state the framework holds in it. Import from '${facade}' instead:\n` +
          detail.join('\n') +
          (stale
            ? '\nSome of these were found in an earlier compilation of this build. Restart the build once they ' +
              'are fixed.'
            : ''),
      ),
    );
  }
}

export default FrameworkImportGuardPlugin;
