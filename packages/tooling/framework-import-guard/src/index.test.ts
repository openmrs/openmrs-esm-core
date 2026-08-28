import { describe, expect, it } from 'vitest';
import { FrameworkImportGuardPlugin } from './index';

interface Reason {
  moduleName: string;
  userRequest: string;
}

/**
 * Drives the plugin against a hand-built module graph. Real builds cover the common paths, but the
 * stylesheet exemption cannot be reached that way: sass resolves `@use '@openmrs/esm-styleguide/...'`
 * itself and inlines the result, so those imports never become module-graph edges.
 */
function run(
  modules: Array<{ name: string; reasons: Array<Reason> }>,
  options?: ConstructorParameters<typeof FrameworkImportGuardPlugin>[0],
) {
  const compilation = {
    errors: [] as Array<Error>,
    warnings: [] as Array<Error>,
    getStats: () => ({ toJson: () => ({ modules }) }),
  };

  let tapped: ((compilation: typeof compilation) => void) | undefined;
  new FrameworkImportGuardPlugin(options).apply({
    context: process.cwd(),
    hooks: { afterEmit: { tap: (_name, callback) => void (tapped = callback) } },
  });
  tapped?.(compilation);

  return compilation;
}

const styleguideModule = 'node_modules/@openmrs/esm-styleguide/dist/internal.js';
const stateModule = 'node_modules/@openmrs/esm-state/dist/index.js';

describe('FrameworkImportGuardPlugin', () => {
  it('fails the build when application code imports a framework package directly', () => {
    const { errors } = run([
      { name: stateModule, reasons: [{ moduleName: './src/index.ts', userRequest: '@openmrs/esm-state' }] },
    ]);

    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain('./src/index.ts imports @openmrs/esm-state');
  });

  it('allows @openmrs/esm-framework itself, including its subpaths', () => {
    const { errors } = run([
      {
        name: 'node_modules/@openmrs/esm-framework/dist/internal.js',
        reasons: [
          { moduleName: './src/index.ts', userRequest: '@openmrs/esm-framework' },
          { moduleName: './src/other.ts', userRequest: '@openmrs/esm-framework/src/internal' },
        ],
      },
    ]);

    expect(errors).toHaveLength(0);
  });

  it('allows the framework packages to import each other', () => {
    const { errors } = run([
      { name: stateModule, reasons: [{ moduleName: styleguideModule, userRequest: '@openmrs/esm-state' }] },
    ]);

    expect(errors).toHaveLength(0);
  });

  it('allows a stylesheet to pull rules out of the styleguide', () => {
    const { errors } = run([
      {
        name: 'node_modules/@openmrs/esm-styleguide/src/vars.scss',
        reasons: [{ moduleName: './src/root.styles.scss', userRequest: '@openmrs/esm-styleguide/src/vars' }],
      },
    ]);

    expect(errors).toHaveLength(0);
  });

  it('still fails a non-stylesheet import of the styleguide', () => {
    const { errors } = run([
      { name: styleguideModule, reasons: [{ moduleName: './src/index.ts', userRequest: '@openmrs/esm-styleguide' }] },
    ]);

    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain('@openmrs/esm-styleguide');
  });

  it('ignores the module federation wrappers around a share and its fallback', () => {
    const { errors } = run([
      {
        name: 'consume shared module (default) @openmrs/esm-framework@10.x',
        reasons: [{ moduleName: './src/index.ts', userRequest: '@openmrs/esm-state' }],
      },
      {
        name: stateModule,
        reasons: [
          {
            moduleName: 'provide shared module (default) @openmrs/esm-state@10.0.0',
            userRequest: '@openmrs/esm-state',
          },
        ],
      },
    ]);

    expect(errors).toHaveLength(0);
  });

  it('does not flag packages outside the framework', () => {
    const { errors } = run([
      {
        name: 'node_modules/@openmrs/esm-patient-common-lib/dist/index.js',
        reasons: [{ moduleName: './src/index.ts', userRequest: '@openmrs/esm-patient-common-lib' }],
      },
    ]);

    expect(errors).toHaveLength(0);
  });

  // A single-app repo installs the framework into its own `node_modules` rather than resolving it
  // through a workspace, and may nest it further depending on the package manager.
  describe('outside a monorepo', () => {
    it('fails the build on a direct import from a single-app repo', () => {
      const { errors } = run([
        {
          name: 'node_modules/@openmrs/esm-styleguide/dist/internal.js',
          reasons: [{ moduleName: './src/dispensing.component.tsx', userRequest: '@openmrs/esm-styleguide' }],
        },
      ]);

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toContain('./src/dispensing.component.tsx imports @openmrs/esm-styleguide');
    });

    it("treats pnpm's nested layout as framework-internal", () => {
      const { errors } = run([
        {
          name: stateModule,
          reasons: [
            {
              moduleName:
                'node_modules/.pnpm/@openmrs+esm-styleguide@10.0.0/node_modules/@openmrs/esm-styleguide/dist/internal.js',
              userRequest: '@openmrs/esm-state',
            },
          ],
        },
      ]);

      expect(errors).toHaveLength(0);
    });

    it('recognises framework packages behind Windows path separators', () => {
      const { errors } = run([
        {
          name: 'node_modules\\@openmrs\\esm-state\\dist\\index.js',
          reasons: [
            {
              moduleName: 'node_modules\\@openmrs\\esm-api\\dist\\index.js',
              userRequest: '@openmrs/esm-state',
            },
          ],
        },
      ]);

      expect(errors).toHaveLength(0);
    });

    it('checks the packages it is given when the framework manifest cannot be found', () => {
      const { errors, warnings } = run(
        [{ name: 'whatever', reasons: [{ moduleName: './src/index.ts', userRequest: '@openmrs/esm-made-up' }] }],
        { frameworkPackages: ['@openmrs/esm-made-up'] },
      );

      expect(warnings).toHaveLength(0);
      expect(errors).toHaveLength(1);
    });

    it('warns rather than passing silently when no framework packages are known', () => {
      const { errors, warnings } = run(
        [{ name: stateModule, reasons: [{ moduleName: './src/index.ts', userRequest: '@openmrs/esm-state' }] }],
        { frameworkPackages: [] },
      );

      expect(errors).toHaveLength(0);
      expect(warnings).toHaveLength(1);
      expect(warnings[0].message).toContain('could not read the dependencies');
    });
  });

  it('reports every offending import, grouped by the module that made it', () => {
    const { errors } = run([
      {
        name: stateModule,
        reasons: [
          { moduleName: './src/index.ts', userRequest: '@openmrs/esm-state' },
          { moduleName: './src/index.ts', userRequest: '@openmrs/esm-state' },
        ],
      },
      { name: styleguideModule, reasons: [{ moduleName: './src/app.tsx', userRequest: '@openmrs/esm-styleguide' }] },
    ]);

    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain('./src/index.ts imports @openmrs/esm-state');
    expect(errors[0].message).toContain('./src/app.tsx imports @openmrs/esm-styleguide');
  });
});
