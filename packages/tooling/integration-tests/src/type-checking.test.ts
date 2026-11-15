// The shared webpack config type-checks an app as part of its build, with fork-ts-checker-webpack-plugin.
// `build-fixture.ts` strips that plugin, since the other tests are about bundling, so these build the
// `type-checked-app` fixture with it left on: a type error has to fail a production build, the config's
// TS2786 exclusion has to hold, and a watching build has to survive `poll: true`, which fork-ts-checker 9
// hands Chokidar 4 as undefined polling intervals.
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import ts from 'typescript';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { fixtureRootOf } from './build-fixture';

const root = fixtureRootOf('type-checked-app');
const indexPath = join(root, 'src', 'index.ts');
const outDirs: string[] = [];
const addedFiles: string[] = [];
let originalCwd: string;

// The whole file runs from inside the fixture: the config resolves the app from `process.cwd()`, and a
// watching compiler keeps using it after `compiler.watch` returns.
beforeAll(() => {
  originalCwd = process.cwd();
  process.chdir(root);
});

afterEach(() => {
  for (const file of addedFiles.splice(0)) {
    rmSync(file, { force: true });
  }
});

afterAll(() => {
  process.chdir(originalCwd);
  for (const dir of outDirs) {
    rmSync(dir, { recursive: true, force: true });
  }
  // Module Federation generates its entry module inside the fixture rather than in `output.path`.
  rmSync(join(root, 'node_modules', '.federation'), { recursive: true, force: true });
});

/** Writes a file into the fixture's `src` for the current test only. */
function addSource(name: string, source: string) {
  const file = join(root, 'src', name);
  writeFileSync(file, source);
  addedFiles.push(file);
}

/** The codes TypeScript itself reports for the fixture, independently of the build. */
function typeScriptErrorCodes() {
  const parsed = ts.getParsedCommandLineOfConfigFile(
    join(root, 'tsconfig.json'),
    {},
    { ...ts.sys, onUnRecoverableConfigFileDiagnostic: () => {} },
  );
  if (!parsed) {
    throw new Error(`Could not parse ${join(root, 'tsconfig.json')}`);
  }

  const program = ts.createProgram(parsed.fileNames, parsed.options);
  return ts.getPreEmitDiagnostics(program).map((diagnostic) => diagnostic.code);
}

async function createCompiler(mode: 'production' | 'development') {
  // From source, not `dist`, so this can't pass against a stale build.
  const { default: createConfig } = await import('@openmrs/webpack-config/src/index');
  const config = createConfig({}, { mode }) as Record<string, any>;

  const outDir = mkdtempSync(join(tmpdir(), 'openmrs-type-checked-build-'));
  outDirs.push(outDir);
  config.output.path = outDir;

  const { default: webpack } = await import('webpack');
  return (webpack as unknown as (options: unknown) => any)(config);
}

async function buildForProduction() {
  const compiler = await createCompiler('production');
  const stats = await new Promise<any>((res, rej) => {
    compiler.run((err: unknown, result: any) => (err ? rej(err) : res(result)));
  });
  // Unclosed compilers keep the checker's worker alive, which surfaces as a vitest hang.
  await new Promise<void>((res) => compiler.close(() => res()));

  return { hasErrors: stats.hasErrors() as boolean, errors: stats.toString({ all: false, errors: true }) as string };
}

describe('a production build with the type checker', () => {
  it('passes when the app type-checks', async () => {
    const { hasErrors, errors } = await buildForProduction();

    expect(errors).toBe('');
    expect(hasErrors).toBe(false);
  });

  it('fails on a type error, naming it', async () => {
    addSource('mistyped.ts', "export const count: number = 'one';\n");

    const { hasErrors, errors } = await buildForProduction();

    expect(hasErrors).toBe(true);
    expect(errors).toContain('TS2322');
  });

  it('lets TS2786 through, since the shared config excludes it', async () => {
    addSource(
      'not-a-component.tsx',
      "import React from 'react';\n\nconst NotAComponent = () => ({ notJsx: true });\n\nexport const element = <NotAComponent />;\n",
    );
    // Without this, a passing build would also be what a checker that never ran looks like.
    expect(typeScriptErrorCodes()).toEqual([2786]);

    const { hasErrors, errors } = await buildForProduction();

    expect(errors).toBe('');
    expect(hasErrors).toBe(false);
  });
});

describe('a watching development build with the type checker', () => {
  it('starts with `poll: true` and rebuilds after a file changes', async () => {
    const compiler = await createCompiler('development');
    const original = readFileSync(indexPath, 'utf8');
    let watching: { close: (callback: () => void) => void } | undefined;
    let onCrash: ((error: unknown) => void) | undefined;

    try {
      const results = await new Promise<Array<boolean>>((res, rej) => {
        // The checker's Chokidar watchers start outside anything this test awaits, so a watcher that fails to
        // start surfaces as an unhandled rejection rather than through the watch callback.
        onCrash = rej;
        process.on('uncaughtException', onCrash);
        process.on('unhandledRejection', onCrash);

        const hadErrors: Array<boolean> = [];
        watching = compiler.watch({ poll: true, aggregateTimeout: 50 }, (err: unknown, stats: any) => {
          if (err) {
            rej(err);
            return;
          }

          hadErrors.push(stats.hasErrors());
          if (hadErrors.length === 1) {
            writeFileSync(indexPath, `${original}// Edited by type-checking.test.ts to trigger a rebuild.\n`);
          } else {
            res(hadErrors);
          }
        });
      });

      expect(results).toEqual([false, false]);
    } finally {
      if (onCrash) {
        process.off('uncaughtException', onCrash);
        process.off('unhandledRejection', onCrash);
      }
      writeFileSync(indexPath, original);
      await new Promise<void>((res) => (watching ? watching.close(() => res()) : res()));
      await new Promise<void>((res) => compiler.close(() => res()));
    }
  }, 60_000);
});
