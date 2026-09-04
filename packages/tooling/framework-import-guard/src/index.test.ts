import { describe, expect, it } from 'vitest';
import { FrameworkImportGuardPlugin } from './index';

const context = '/app';
const appModule = `${context}/src/index.ts`;

/**
 * Drives the plugin through the hooks it taps, feeding it resolutions in the shape webpack and
 * rspack hand over: a literal request plus the file that made it.
 */
function run(
  imports: Array<{ issuer: string; request: string }>,
  options?: ConstructorParameters<typeof FrameworkImportGuardPlugin>[0],
) {
  const compilation = { errors: [] as Array<Error>, warnings: [] as Array<Error> };
  let afterResolve: ((data: { request: string; contextInfo: { issuer: string } }) => void) | undefined;
  let startCompilation: ((compilation: typeof compilation) => void) | undefined;
  let afterEmit: ((compilation: typeof compilation) => void) | undefined;

  new FrameworkImportGuardPlugin(options).apply({
    context,
    hooks: {
      normalModuleFactory: {
        tap: (_name, callback) =>
          callback({ hooks: { afterResolve: { tap: (_inner, onResolve) => void (afterResolve = onResolve) } } }),
      },
      thisCompilation: { tap: (_name, callback) => void (startCompilation = callback) },
      afterEmit: { tap: (_name, callback) => void (afterEmit = callback) },
    },
  });

  startCompilation?.(compilation);
  for (const { issuer, request } of imports) {
    afterResolve?.({ request, contextInfo: { issuer } });
  }
  afterEmit?.(compilation);

  return { ...compilation, replay: () => (startCompilation?.(compilation), afterEmit?.(compilation), compilation) };
}

describe('FrameworkImportGuardPlugin', () => {
  it('fails the build when application code imports a framework package directly', () => {
    const { errors } = run([{ issuer: appModule, request: '@openmrs/esm-state' }]);

    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain('./src/index.ts imports @openmrs/esm-state');
  });

  it('allows @openmrs/esm-framework itself, including its subpaths', () => {
    const { errors } = run([
      { issuer: appModule, request: '@openmrs/esm-framework' },
      { issuer: appModule, request: '@openmrs/esm-framework/src/internal' },
    ]);

    expect(errors).toHaveLength(0);
  });

  it('allows the framework packages to import each other', () => {
    const { errors } = run([
      {
        issuer: `${context}/node_modules/@openmrs/esm-styleguide/dist/internal.js`,
        request: '@openmrs/esm-state',
      },
    ]);

    expect(errors).toHaveLength(0);
  });

  it('allows a stylesheet to pull rules out of the styleguide', () => {
    const { errors } = run([
      { issuer: `${context}/src/root.styles.scss`, request: '@openmrs/esm-styleguide/src/vars' },
    ]);

    expect(errors).toHaveLength(0);
  });

  it('still fails a non-stylesheet import of the styleguide', () => {
    const { errors } = run([{ issuer: appModule, request: '@openmrs/esm-styleguide' }]);

    expect(errors).toHaveLength(1);
  });

  it('does not flag packages outside the framework', () => {
    const { errors } = run([{ issuer: appModule, request: '@openmrs/esm-patient-common-lib' }]);

    expect(errors).toHaveLength(0);
  });

  it('ignores a resolution with no issuer, such as an entry point', () => {
    const { errors } = run([{ issuer: '', request: '@openmrs/esm-state' }]);

    expect(errors).toHaveLength(0);
  });

  it('reports every offending import, grouped by the file that made it', () => {
    const { errors } = run([
      { issuer: appModule, request: '@openmrs/esm-state' },
      { issuer: appModule, request: '@openmrs/esm-state' },
      { issuer: `${context}/src/app.tsx`, request: '@openmrs/esm-styleguide' },
    ]);

    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain('./src/index.ts imports @openmrs/esm-state');
    expect(errors[0].message).toContain('./src/app.tsx imports @openmrs/esm-styleguide');
  });

  it('forgets the previous compilation, so a watch rebuild starts clean', () => {
    const result = run([{ issuer: appModule, request: '@openmrs/esm-state' }]);
    expect(result.errors).toHaveLength(1);

    result.errors.length = 0;
    expect(result.replay().errors).toHaveLength(0);
  });

  // A single-app repo installs the framework into its own `node_modules` rather than resolving it
  // through a workspace, and may nest it further depending on the package manager.
  describe('outside a monorepo', () => {
    it('fails the build on a direct import from a single-app repo', () => {
      const { errors } = run([
        { issuer: `${context}/src/dispensing.component.tsx`, request: '@openmrs/esm-styleguide' },
      ]);

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toContain('./src/dispensing.component.tsx imports @openmrs/esm-styleguide');
    });

    it("treats pnpm's nested layout as framework-internal", () => {
      const { errors } = run([
        {
          issuer: `${context}/node_modules/.pnpm/@openmrs+esm-styleguide@10.0.0/node_modules/@openmrs/esm-styleguide/dist/internal.js`,
          request: '@openmrs/esm-state',
        },
      ]);

      expect(errors).toHaveLength(0);
    });

    it('recognises framework packages behind Windows path separators', () => {
      const { errors } = run([
        {
          issuer: 'C:\\app\\node_modules\\@openmrs\\esm-api\\dist\\index.js',
          request: '@openmrs/esm-state',
        },
      ]);

      expect(errors).toHaveLength(0);
    });

    it('checks the packages it is given when the framework manifest cannot be found', () => {
      const { errors, warnings } = run([{ issuer: appModule, request: '@openmrs/esm-made-up' }], {
        frameworkPackages: ['@openmrs/esm-made-up'],
      });

      expect(warnings).toHaveLength(0);
      expect(errors).toHaveLength(1);
    });

    it('warns rather than passing silently when no framework packages are known', () => {
      const { errors, warnings } = run([{ issuer: appModule, request: '@openmrs/esm-state' }], {
        frameworkPackages: [],
      });

      expect(errors).toHaveLength(0);
      expect(warnings).toHaveLength(1);
      expect(warnings[0].message).toContain('could not read the dependencies');
    });
  });
});
