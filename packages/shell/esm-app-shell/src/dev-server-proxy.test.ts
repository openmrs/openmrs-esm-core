// The dev server serves what it builds, proxies files it doesn't have to a real distribution, and falls
// back to the locally built `index.html` for everything else. That last split is the one worth pinning:
// misclassify a route as a file and the browser is quietly handed the upstream's shell instead of this one.
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const shellRoot = resolve(__dirname, '..');
const spaPath = '/openmrs/spa';

/** The directory `openmrs assemble` gives a frontend module, named for the package and its version. */
const moduleDir = 'openmrs-esm-home-app-11.1.1-pre.9638';

let proxy: Record<string, any> | undefined;

/**
 * The proxy entry the dev server is actually configured with.
 *
 * Loaded from `shellRoot` because the config resolves paths and the styleguide stylesheet relative to
 * its own directory.
 */
function loadProxy() {
  if (!proxy) {
    const originalCwd = process.cwd();
    process.chdir(shellRoot);

    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const config = require('../rspack.config.js')({}, { mode: 'development' }) as Record<string, any>;
      proxy = config.devServer.proxy[0];
    } finally {
      process.chdir(originalCwd);
    }
  }

  return proxy!;
}

describe('the dev server proxy', () => {
  it.each([
    ['a chunk', `${spaPath}/${moduleDir}/4610.js`],
    ['an extracted stylesheet', `${spaPath}/${moduleDir}/180.css`],
    ['a source map', `${spaPath}/${moduleDir}/180.css.map`],
    ['an image', `${spaPath}/${moduleDir}/9a3f2c1d.png`],
    ['a font', `${spaPath}/${moduleDir}/font.woff2`],
    ['translations', `${spaPath}/${moduleDir}/en.json`],
    ['a root-level asset', `${spaPath}/importmap.json`],
    ['the favicon', `${spaPath}/favicon.ico`],
    ['an asset with a cache-busting query', `${spaPath}/${moduleDir}/180.css?v=2`],
  ])('proxies %s', (_, path) => {
    expect(loadProxy().context(path)).toBe(true);
  });

  it.each([
    ['a page', `${spaPath}/81239898/patient-chart`],
    ['a patient chart', `${spaPath}/patient/2b0f0cba/chart`],
    ['the home page', `${spaPath}/home`],
    ['the SPA root', `${spaPath}/`],
    // `basename()` sees the query, so any dot in one used to make these look like files.
    ['a search whose query holds a dot', `${spaPath}/search?query=john.doe`],
    ['a page whose query holds a dot', `${spaPath}/81239898/patient-chart?tab=vitals.summary`],
  ])('leaves %s to the locally built index.html', (_, path) => {
    expect(loadProxy().context(path)).toBe(false);
  });

  it.each([
    ['the REST API', '/openmrs/ws/rest/v1/session'],
    ['the FHIR API', '/openmrs/ws/fhir2/R4/Patient?name=john'],
  ])('proxies %s', (_, path) => {
    expect(loadProxy().context(path)).toBe(true);
  });

  it.each([
    ['an empty path', ''],
    ['a path it does not own', '/other/thing.js'],
  ])('ignores %s', (_, path) => {
    expect(loadProxy().context(path)).toBe(false);
  });

  // A remote's assets sit under its own directory, so anything but a verbatim path 404s.
  it('proxies paths verbatim', () => {
    expect(loadProxy().pathRewrite).toBeUndefined();
  });
});
