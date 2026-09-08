// Frontend RFC 0033: production builds of frontend modules emit CSS as real `.css` assets instead of
// embedding it in JavaScript, development keeps `style-loader`, and a module may not restyle the page as
// a whole. The shared configs' unit tests can only show what the config object says; these build the
// `styled-app` and `global-css-app` fixtures with each bundler and inspect what actually lands on disk.
import { afterAll, describe, expect, it } from 'vitest';
import { buildFixtureApp, cleanUpFixtureBuilds } from './build-fixture';

const bundlers = ['rspack', 'webpack'] as const;

/** A declaration written into `styled-app`'s stylesheet, in the shape minification leaves it. */
const declarationPattern = /letter-spacing:\s*3px/;

/** css-loader's `localIdentName`, as the shared configs set it: `${ident}__[name]__[local]___[hash]`. */
const scopedClassPattern = /__styles-module__panel___/;

afterAll(() => {
  cleanUpFixtureBuilds();
});

describe.each(bundlers)('a production build with %s', (bundler) => {
  it('emits the stylesheet as a `.css` asset', async () => {
    const { stylesheets } = await buildFixtureApp(bundler, 'production', 'styled-app');
    const css = Object.values(stylesheets).join('');

    expect(Object.keys(stylesheets).length).toBeGreaterThan(0);
    expect(css).toMatch(declarationPattern);
    expect(css).toMatch(scopedClassPattern);
  });

  it('leaves the stylesheet out of the JavaScript', async () => {
    const { scripts } = await buildFixtureApp(bundler, 'production', 'styled-app');

    // The class name still appears in JS — that is the CSS Modules mapping the component reads. What
    // must not appear is the rule itself, which is the payload RFC 0033 moves off the JavaScript path.
    expect(Object.values(scripts).join('')).not.toMatch(declarationPattern);
  });

  it('keeps a Carbon override that is anchored to the app’s own class', async () => {
    const { stylesheets } = await buildFixtureApp(bundler, 'production', 'styled-app');

    // Scoped on the left, verbatim Carbon on the right: the supported way to make a visual fix.
    expect(Object.values(stylesheets).join('')).toMatch(/__styles-module__panel___[\w-]+ \.cds--btn/);
  });

  it('emits no stylesheet for the entry chunk, which nothing loads', async () => {
    const { stylesheets } = await buildFixtureApp(bundler, 'production', 'styled-app');

    // The app shell loads the Module Federation container, never a `main` chunk, so a `main.css` would
    // be bytes no browser fetches. The configs set `entry: {}` to stop one being created at all.
    expect(Object.keys(stylesheets)).not.toContain('main.css');
    expect(Object.keys(stylesheets).map((name) => name.replace(/\.css$/, '.js'))).not.toContain('main.js');
  });
});

describe.each(bundlers)('a development build with %s', (bundler) => {
  it('emits no `.css` assets, inlining the stylesheet instead', async () => {
    const { stylesheets, scripts } = await buildFixtureApp(bundler, 'development', 'styled-app');

    expect(Object.keys(stylesheets)).toEqual([]);
    expect(Object.values(scripts).join('')).toMatch(declarationPattern);
  });
});

describe.each(bundlers)('the Carbon CSS guard under %s', (bundler) => {
  it('fails the build, naming both kinds of offending selector', async () => {
    const build = buildFixtureApp(bundler, 'production', 'global-css-app');

    await expect(build).rejects.toThrow(/global CSS rule\(s\)/);
    // Both cases the guard distinguishes, from one build: a bare Carbon class and an anchorless selector.
    await expect(build).rejects.toThrow(/\.cds--btn/);
    await expect(build).rejects.toThrow(/\bbody\b/);
  });

  it('does not fail a development build, where there is no emitted CSS to check', async () => {
    await expect(buildFixtureApp(bundler, 'development', 'global-css-app')).resolves.toBeDefined();
  });
});
