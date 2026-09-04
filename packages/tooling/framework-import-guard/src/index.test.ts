import { mkdtempSync, writeFileSync } from 'node:fs';
import Module from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { FrameworkImportGuardPlugin } from './index';

/** A real directory, so package discovery resolves the way it does in a build. */
const context = process.cwd();
const appModule = `${context}/src/index.ts`;
const styleguide = '@openmrs/esm-styleguide';

/**
 * Drives the plugin through the hooks it taps, feeding it resolutions in the shape webpack and
 * rspack hand over: a literal request plus the file that made it. `compile()` starts a fresh
 * compilation on the same plugin instance, as a watch rebuild does.
 */
function hooks(options?: ConstructorParameters<typeof FrameworkImportGuardPlugin>[0]) {
  let afterResolve: ((data: { request: string; contextInfo: { issuer: string } }) => void) | undefined;
  let startCompilation: ((value: unknown) => void) | undefined;
  let afterCompile: ((compilation: { errors: Array<Error>; warnings: Array<Error> }) => void) | undefined;

  new FrameworkImportGuardPlugin(options).apply({
    context,
    hooks: {
      normalModuleFactory: {
        tap: (_name, callback) =>
          callback({ hooks: { afterResolve: { tap: (_inner, onResolve) => void (afterResolve = onResolve) } } }),
      },
      thisCompilation: { tap: (_name, callback) => void (startCompilation = callback) },
      afterCompile: { tap: (_name, callback) => void (afterCompile = callback) },
    },
  });

  return {
    /** Runs one compilation over the given imports and returns its diagnostics. */
    compile(imports: Array<{ issuer: string; request: string }>) {
      const compilation = { errors: [] as Array<Error>, warnings: [] as Array<Error> };
      startCompilation?.(undefined);

      for (const { issuer, request } of imports) {
        afterResolve?.({ request, contextInfo: { issuer } });
      }
      afterCompile?.(compilation);

      return compilation;
    },
  };
}

function run(
  imports: Array<{ issuer: string; request: string }>,
  options?: ConstructorParameters<typeof FrameworkImportGuardPlugin>[0],
) {
  return hooks(options).compile(imports);
}

describe('FrameworkImportGuardPlugin', () => {
  it('fails the build when application code imports a framework package directly', () => {
    const { errors } = run([{ issuer: appModule, request: '@openmrs/esm-state' }]);

    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain('./src/index.ts imports @openmrs/esm-state');
  });

  it('allows the facade and its subpaths even when the allow-list is emptied', () => {
    const { errors } = run(
      [
        { issuer: appModule, request: '@openmrs/esm-framework' },
        { issuer: appModule, request: '@openmrs/esm-framework/src/internal' },
      ],
      // The facade is allowed by construction, not by sitting in the default allow-list.
      { allowedPackages: [], frameworkPackages: ['@openmrs/esm-framework', '@openmrs/esm-state'] },
    );

    expect(errors).toHaveLength(0);
  });

  it('allows a package named in allowedPackages', () => {
    const { errors } = run([{ issuer: appModule, request: '@openmrs/esm-state' }], {
      allowedPackages: ['@openmrs/esm-state'],
    });

    expect(errors).toHaveLength(0);
  });

  it('allows the framework packages to import each other', () => {
    const { errors } = run([
      { issuer: `${context}/node_modules/@openmrs/esm-styleguide/dist/internal.js`, request: '@openmrs/esm-state' },
      { issuer: `${context}/packages/framework/esm-styleguide/src/index.ts`, request: '@openmrs/esm-state' },
    ]);

    expect(errors).toHaveLength(0);
  });

  it('holds a package that merely looks like part of the framework to the rule', () => {
    // These are bundled into the app, so a direct import duplicates state exactly as the app's own
    // would. This is the case that motivated the guard in the first place.
    const { errors } = run([
      { issuer: `${context}/node_modules/@openmrs/esm-patient-common-lib/dist/index.js`, request: styleguide },
      { issuer: `${context}/node_modules/@openmrs/esm-form-engine-lib/dist/index.js`, request: '@openmrs/esm-state' },
      { issuer: `${context}/src/framework/esm-helpers/thing.ts`, request: '@openmrs/esm-state' },
    ]);

    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain('esm-patient-common-lib');
    expect(errors[0].message).toContain('esm-form-engine-lib');
    expect(errors[0].message).toContain('./src/framework/esm-helpers/thing.ts');
  });

  it('ignores the module federation wrappers around a share and its fallback', () => {
    const { errors } = run([
      { issuer: 'consume shared module (default) @openmrs/esm-framework@10.x', request: '@openmrs/esm-state' },
      { issuer: 'provide shared module (default) @openmrs/esm-state@10.0.0', request: '@openmrs/esm-state' },
    ]);

    expect(errors).toHaveLength(0);
  });

  it('does not flag packages outside the framework', () => {
    const { errors } = run([{ issuer: appModule, request: '@openmrs/esm-patient-common-lib' }]);

    expect(errors).toHaveLength(0);
  });

  it('ignores a resolution with no issuer, such as an entry point', () => {
    const { errors } = run([{ issuer: '', request: '@openmrs/esm-state' }]);

    expect(errors).toHaveLength(0);
  });

  it('does not treat a near-miss package name as guarded', () => {
    const { errors } = run([
      { issuer: appModule, request: '@openmrs/esm-statement' },
      { issuer: appModule, request: '@openmrs/esm-state-machine' },
    ]);

    expect(errors).toHaveLength(0);
  });

  it('reports every offending import, grouped by the file that made it', () => {
    const { errors } = run([
      { issuer: appModule, request: '@openmrs/esm-state' },
      { issuer: appModule, request: '@openmrs/esm-state' },
      { issuer: `${context}/src/app.tsx`, request: styleguide },
    ]);

    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain('./src/index.ts imports @openmrs/esm-state');
    expect(errors[0].message).toContain(`./src/app.tsx imports ${styleguide}`);
  });

  describe('stylesheets', () => {
    it('lets a stylesheet pull rules out of the styleguide', () => {
      const { errors } = run([{ issuer: `${context}/src/root.styles.scss`, request: `${styleguide}/src/vars` }]);

      expect(errors).toHaveLength(0);
    });

    it('does not let a stylesheet import a sibling that is not the styleguide', () => {
      const { errors } = run([{ issuer: `${context}/src/root.styles.scss`, request: '@openmrs/esm-state' }]);

      expect(errors).toHaveLength(1);
    });

    it('does not extend the exemption to a source file whose name merely contains a stylesheet extension', () => {
      const { errors } = run([{ issuer: `${context}/src/theme.css.ts`, request: styleguide }]);

      expect(errors).toHaveLength(1);
    });

    it('still fails a non-stylesheet import of the styleguide', () => {
      const { errors } = run([{ issuer: appModule, request: styleguide }]);

      expect(errors).toHaveLength(1);
    });
  });

  describe('across compilations', () => {
    it('keeps reporting an import from a file that was not rebuilt', () => {
      // A watch rebuild only re-resolves what changed. Anything forgotten between compilations
      // turns the gate green with the import still in the tree.
      const harness = hooks();
      expect(harness.compile([{ issuer: appModule, request: '@openmrs/esm-state' }]).errors).toHaveLength(1);

      const rebuild = harness.compile([{ issuer: `${context}/src/unrelated.ts`, request: 'react' }]);

      expect(rebuild.errors).toHaveLength(1);
      expect(rebuild.errors[0].message).toContain('./src/index.ts imports @openmrs/esm-state');
      expect(rebuild.errors[0].message).toContain('earlier compilation');
    });

    it('holds a finding even once the offending file resolves cleanly again', () => {
      // `module.unsafeCache` serves node_modules straight from cache on a rebuild, so a
      // compilation that re-resolves the file's other imports is no evidence the framework import
      // is gone. Retracting on that basis is how the gate would go green with the import in place.
      const harness = hooks();
      expect(harness.compile([{ issuer: appModule, request: '@openmrs/esm-state' }]).errors).toHaveLength(1);

      const rebuild = harness.compile([{ issuer: appModule, request: './sibling' }]);

      expect(rebuild.errors).toHaveLength(1);
      expect(rebuild.errors[0].message).toContain('earlier compilation');
    });
  });

  describe('when it cannot check', () => {
    it('fails the build if the framework packages cannot be discovered', () => {
      // Discovery resolves the manifest from the app and then from this package, so an unreachable
      // manifest is the only way both locations fail — which is what a missing install looks like.
      const resolveFilename = Module['_resolveFilename'];

      Module['_resolveFilename'] = function (request: string, ...rest: Array<unknown>) {
        if (request === '@openmrs/esm-framework/package.json') {
          throw new Error('MODULE_NOT_FOUND');
        }

        return resolveFilename.call(this, request, ...rest);
      };

      try {
        const { errors, warnings } = run([{ issuer: appModule, request: '@openmrs/esm-state' }]);

        expect(warnings).toHaveLength(0);
        expect(errors).toHaveLength(1);
        expect(errors[0].message).toContain('could not read the dependencies');
      } finally {
        Module['_resolveFilename'] = resolveFilename;
      }
    });

    it('fails the build if it is never asked about a single resolution', () => {
      // A guard that tapped successfully but observed nothing has checked nothing, and must not be
      // mistaken for a clean build.
      const { errors } = hooks().compile([]);

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toContain('saw no module resolutions');
    });

    it('guards nothing, quietly, when explicitly configured with no packages', () => {
      const { errors, warnings } = run([{ issuer: appModule, request: '@openmrs/esm-state' }], {
        frameworkPackages: [],
      });

      expect(errors).toHaveLength(0);
      expect(warnings).toHaveLength(0);
    });

    it('checks the packages it is given when discovery is bypassed', () => {
      const { errors } = run([{ issuer: appModule, request: '@openmrs/esm-made-up' }], {
        frameworkPackages: ['@openmrs/esm-made-up'],
      });

      expect(errors).toHaveLength(1);
    });
  });

  describe('shared peers', () => {
    /** An app root whose manifest declares the given peers, since peers are read from the context. */
    function appWith(peerDependencies: Record<string, string>) {
      const root = mkdtempSync(join(tmpdir(), 'framework-import-guard-'));
      writeFileSync(join(root, 'package.json'), JSON.stringify({ name: 'an-app', peerDependencies }));
      return root;
    }

    function compileIn(root: string, request: string) {
      const compilation = { errors: [] as Array<Error>, warnings: [] as Array<Error> };
      let onResolve: ((data: { request: string; contextInfo: { issuer: string } }) => void) | undefined;
      let report: ((value: typeof compilation) => void) | undefined;

      new FrameworkImportGuardPlugin().apply({
        context: root,
        hooks: {
          normalModuleFactory: {
            tap: (_name, callback) =>
              callback({ hooks: { afterResolve: { tap: (_inner, tapped) => void (onResolve = tapped) } } }),
          },
          thisCompilation: { tap: () => {} },
          afterCompile: { tap: (_name, callback) => void (report = callback) },
        },
      });

      onResolve?.({ request, contextInfo: { issuer: `${root}/src/index.ts` } });
      report?.(compilation);

      return compilation;
    }

    it('allows a sibling the app peer-depends on, because that really is a share key', () => {
      // The bundler config builds the Module Federation `shared` map out of peerDependencies, so
      // such an import does dedupe onto the app shell's copy and is legitimate.
      const root = appWith({ '@openmrs/esm-framework': '10.x', '@openmrs/esm-state': '10.x' });

      expect(compileIn(root, '@openmrs/esm-state').errors).toHaveLength(0);
    });

    it('still guards a sibling the app does not peer-depend on', () => {
      const root = appWith({ '@openmrs/esm-framework': '10.x' });

      expect(compileIn(root, '@openmrs/esm-state').errors).toHaveLength(1);
    });
  });

  it('does not look the framework packages up again for every import', () => {
    // Discovery reads manifests off disk and `record` runs for every module in the build, so the
    // lookup has to be memoised. Counting after the first import rather than in total keeps this
    // independent of how many places discovery looks.
    const resolveFilename = Module['_resolveFilename'];
    let lookups = 0;

    Module['_resolveFilename'] = function (request: string, ...rest: Array<unknown>) {
      if (request === '@openmrs/esm-framework/package.json') {
        lookups++;
      }

      return resolveFilename.call(this, request, ...rest);
    };

    try {
      const harness = hooks();
      const imports = [{ issuer: appModule, request: '@openmrs/esm-state' }];
      harness.compile(imports);
      const afterFirstCompilation = lookups;

      for (let index = 0; index < 25; index++) {
        imports.push({ issuer: `${context}/src/module-${index}.ts`, request: '@openmrs/esm-state' });
      }
      harness.compile(imports);

      expect(afterFirstCompilation).toBeGreaterThan(0);
      expect(lookups).toBe(afterFirstCompilation);
    } finally {
      Module['_resolveFilename'] = resolveFilename;
    }
  });
});
