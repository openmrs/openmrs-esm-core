// Frontend RFC 0033: production builds of frontend modules emit CSS as real `.css` assets instead of
// embedding it in JavaScript, development keeps `style-loader`, and a module may not restyle the page as
// a whole. The shared configs' unit tests can only show what the config object says; these build the
// `styled-app` and `global-css-app` fixtures with each bundler and inspect what actually lands on disk.
import { afterAll, describe, expect, it } from 'vitest';
import { buildAppShell, buildFixtureApp, cleanUpFixtureBuilds } from './build-fixture';

const bundlers = ['rspack', 'webpack'] as const;

/** A declaration written into `styled-app`'s stylesheet, in the shape minification leaves it. */
const declarationPattern = /letter-spacing:\s*3px/;

/** css-loader's `localIdentName`, as the shared configs set it: `${ident}__[name]__[local]___[hash]`. */
const scopedClassPattern = /__styles-module__panel___/;

/** Every scoped class name in a script: the `${ident}__[name]__[local]___` prefix, then a five-character base64 hash. */
const scopedNamePattern = /[\w-]*__styles-module__[\w-]+___[A-Za-z0-9+/_-]{5}/g;

/** Every generated class's name as a selector writes it, up to the `{` or `,` that ends it. */
const generatedSelectorPattern = /__styles-module__generated-\d+___[^{,\s]+/g;

/** A generated class's whole name: a five-character hash, each character plain (a hash can hold `-` and `_`) or escaped exactly once. */
const wellEscapedGeneratedName = /^__styles-module__generated-\d+___(?:[A-Za-z0-9_-]|\\[+/=]){5}$/;

/** Two or more backslashes before a character a class-name hash can contain: a selector escaped twice. */
const doubleEscapedPattern = /\\{2,}[+/=]/;

/** One escaped `+`, `/` or `=`: what a correctly escaped selector contains. */
const escapedOncePattern = /\\[+/=]/;

/** How a class name has to appear in a selector: one backslash before each `+`, `/` and `=`. */
const escapeOnce = (name: string) => name.replace(/[+/=]/g, '\\$&');

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

  it('emits no entry chunk at all, since nothing would load one', async () => {
    const { stylesheets, scripts } = await buildFixtureApp(bundler, 'production', 'styled-app');

    // The app shell loads the Module Federation container, never a `main` chunk, so a `main.js` and its
    // `main.css` would be bytes no browser fetches. The configs set `entry: {}` to stop one existing.
    expect(Object.keys(scripts)).not.toContain('main.js');
    expect(Object.keys(stylesheets)).not.toContain('main.css');
  });

  it('escapes each scoped class name once, so every class has a rule that matches it', async () => {
    const { stylesheets, scripts } = await buildFixtureApp(bundler, 'production', 'styled-app');
    const css = Object.values(stylesheets).join('');
    const classNames = new Set(Object.values(scripts).join('').match(scopedNamePattern) ?? []);

    // A class name with a `+` or `/` in its hash has to be escaped in a selector. Escaped twice, the selector
    // no longer matches the class on the element, so the rule is there but never applies (O3-6250).
    expect(css).not.toMatch(doubleEscapedPattern);
    // Without an escaped character in the output, the checks here could not fail.
    expect(css).toMatch(escapedOncePattern);

    // The class the component reads from the JavaScript mapping must appear in a selector, escaped once.
    expect(classNames.size).toBeGreaterThan(0);
    for (const name of classNames) {
      expect(css).toContain(`.${escapeOnce(name)}`);
    }

    // The generated classes are not read by the component, so the JavaScript doesn't carry them. Each one
    // still has to be in the stylesheet with its hash escaped once. The list of misses names any selector
    // that isn't, so a failure shows what was emitted.
    const generated = css.match(generatedSelectorPattern) ?? [];
    expect(generated).toHaveLength(60);
    expect(generated.filter((name) => !wellEscapedGeneratedName.test(name))).toEqual([]);
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

describe('the double-escape check', () => {
  it('flags a selector escaped three times and accepts one escaped once', () => {
    expect('.TFy3QQKLSWulq2c\\\\\\+xKH0hg\\\\\\=\\\\\\=').toMatch(doubleEscapedPattern);
    expect('.TFy3QQKLSWulq2c\\+xKH0hg\\=\\=').not.toMatch(doubleEscapedPattern);
    expect(escapeOnce('a+b/c==')).toBe('a\\+b\\/c\\=\\=');
  });
});

describe('the app shell build', () => {
  it('emits no selector that is escaped twice', async () => {
    const { stylesheets } = await buildAppShell();

    expect(Object.keys(stylesheets).length).toBeGreaterThan(0);
    for (const [file, css] of Object.entries(stylesheets)) {
      expect(css, file).not.toMatch(doubleEscapedPattern);
    }
  }, 180_000);
});
