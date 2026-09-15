// The app shell is the one bundle every O3 page loads, and it configures its own browser targets rather
// than going through `@openmrs/rspack-config`, so the checks over there don't cover it. These pin that
// it compiles and generates its runtime for the browsers frontend RFC 0003 names, rather than falling
// back to swc's ES5 default or rspack's conservative `web` runtime.
import { resolve } from 'node:path';
import browserslist from 'browserslist';
import { describe, expect, it } from 'vitest';

const shellRoot = resolve(__dirname, '..');

// eslint-disable-next-line @typescript-eslint/no-require-imports
const openmrsQueries: string[] = require('browserslist-config-openmrs');

/**
 * The app shell's rspack config, as a production build produces it.
 *
 * Loaded from `shellRoot` because the config resolves paths and the styleguide stylesheet relative to
 * its own directory.
 */
let shellConfig: Record<string, any> | undefined;

async function loadShellConfig() {
  if (shellConfig) {
    return shellConfig;
  }

  const originalCwd = process.cwd();
  process.chdir(shellRoot);

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    shellConfig = require('../rspack.config.js')({}, { mode: 'production' }) as Record<string, any>;
    return shellConfig;
  } finally {
    process.chdir(originalCwd);
  }
}

describe('the app shell build', () => {
  it('compiles its sources for the browsers RFC 0003 supports', async () => {
    const config = await loadShellConfig();
    const rule = config.module.rules.find((candidate: { test?: RegExp }) => candidate.test?.test?.('index.ts'));
    const options = Array.isArray(rule.use) ? rule.use[0].options : rule.options ?? rule.use?.options;

    // Queries, not resolved versions: swc resolves them with a Rust port of browserslist whose bundled
    // browser data is older than this repo's.
    expect(options.env.targets).toEqual(openmrsQueries);

    // swc rejects the two together, so a `jsc.target` creeping in would break the build outright.
    expect(options.jsc?.target).toBeUndefined();
  });

  it('generates its runtime for those browsers too', async () => {
    const config = await loadShellConfig();
    expect(config.target).toEqual(['web', `browserslist:${openmrsQueries.join(', ')}`]);

    const { default: rspack } = await import('@rspack/core');
    const compiler = (rspack as unknown as (options: unknown) => any)({
      context: shellRoot,
      target: config.target,
    });
    const { environment } = compiler.options.output;
    await new Promise<void>((res) => compiler.close(() => res()));

    // What a bare `web` target leaves off, and the reason the target is set at all.
    expect(environment.dynamicImport).toBe(true);
    expect(environment.globalThis).toBe(true);
    expect(environment.arrowFunction).toBe(true);
  });

  it('targets the same browsers the shared module configs do', async () => {
    // The app shell reads the policy package directly while the shared configs resolve a module's own
    // browserslist config first. Nothing forces those to agree, so this is what catches them drifting.
    const config = await loadShellConfig();
    const rule = config.module.rules.find((candidate: { test?: RegExp }) => candidate.test?.test?.('index.ts'));
    const options = Array.isArray(rule.use) ? rule.use[0].options : rule.options ?? rule.use?.options;

    expect(browserslist(options.env.targets)).toEqual(
      browserslist(['extends browserslist-config-openmrs'], { path: shellRoot }),
    );
  });
});
