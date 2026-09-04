/**
 * A webpack/rspack plugin that fails a build whose emitted CSS restyles the page as a whole rather
 * than the module's own markup.
 *
 * Carbon's stylesheet is delivered exactly once, by the app shell (frontend RFC 0033). What separates
 * a supported override from a page-wide one is the selector's anchor. `.myThing :global(.cds--btn)`
 * scopes the override to this module and is how a visual fix through Carbon's classes gets made; a
 * selector anchored on Carbon alone — `:global(.cds--btn)`, `[dir=rtl] :global(.cds--css-grid-column)`
 * — reaches every Carbon component on the page, including other modules'. A selector with no class or
 * id to anchor it at all, such as the `html, body, div { … }` of Carbon's reset, is broader still.
 *
 * These arrive by `@use`-ing `@carbon/styles`, one of its resets, or an individual component's
 * stylesheet, rather than just Carbon's tokens, mixins, and functions, which emit no CSS.
 *
 * The scanner reads emitted, minified CSS rather than source, because that is what actually ships and
 * because the many valid ways to import a Carbon token defeat checking imports at the source level.
 */

/** Selector-position class and id tokens, e.g. `.cds--btn`, `#main`, `.a\\:b`. */
const anchorPattern = /[.#](?:[-\w]|\\.)+/g;

/**
 * Only the unscoped form counts. The shared configs run every stylesheet through CSS Modules, so a
 * Carbon class reaches the page verbatim only when the module wrote it inside `:global`; anything else
 * is renamed to `.-esm-login__footer__cds--btn___1a2b3` and can no longer restyle the shell's Carbon.
 */
const carbonAnchorPattern = /^\.cds--/;

const carbonPrefix = '.cds--';

/**
 * Exempt from the anchorless rule. `:root` and `:host` carry custom properties, which add to the
 * cascade rather than restyling anything, and are how a module contributes its own design tokens.
 */
const anchorlessExemptPattern = /^:(?:root|host)\b/;

type BlockKind = 'style' | 'at-rule' | 'keyframes';

/**
 * The subset of a compilation this plugin needs. Declaring it structurally, rather than importing
 * either bundler's types, is what lets one implementation serve both — and makes a bundler that stops
 * supplying these a compile error here rather than a guard that silently sees nothing.
 */
interface Compilation {
  errors: Array<Error>;
  hooks: {
    processAssets: {
      tap(options: { name: string; stage: number }, callback: (assets: Record<string, Source>) => void): void;
    };
  };
}

interface Source {
  source(): string | Buffer;
}

interface Compiler {
  /** Both bundlers expose their own namespace here; rspack sets `webpack` too, for compatibility. */
  rspack?: { Compilation: { PROCESS_ASSETS_STAGE_REPORT: number } };
  webpack?: { Compilation: { PROCESS_ASSETS_STAGE_REPORT: number } };
  hooks: {
    compilation: { tap(name: string, callback: (compilation: Compilation) => void): void };
  };
}

/**
 * Blanks out comments and string literals so that braces, semicolons, and class-like text inside them
 * can't be mistaken for CSS syntax by the (deliberately hand-rolled) scanner below.
 */
function stripNoise(css: string): string {
  let out = '';
  let i = 0;

  while (i < css.length) {
    const char = css[i];

    if (char === '/' && css[i + 1] === '*') {
      const end = css.indexOf('*/', i + 2);
      i = end === -1 ? css.length : end + 2;
      out += ' ';
    } else if (char === '"' || char === "'") {
      i += 1;
      while (i < css.length && css[i] !== char) {
        i += css[i] === '\\' ? 2 : 1;
      }
      i += 1;
      out += '""';
    } else {
      out += char;
      i += 1;
    }
  }

  return out;
}

/** Splits a selector list on its top-level commas, leaving those nested in `:not(…)` & friends alone. */
function splitSelectorList(list: string): Array<string> {
  const selectors: Array<string> = [];
  let depth = 0;
  let start = 0;

  for (let i = 0; i < list.length; i++) {
    const char = list[i];

    if (char === '(' || char === '[') {
      depth += 1;
    } else if (char === ')' || char === ']') {
      depth -= 1;
    } else if (char === ',' && depth === 0) {
      selectors.push(list.slice(start, i));
      start = i + 1;
    }
  }

  selectors.push(list.slice(start));
  return selectors;
}

/**
 * Removes `:not(…)` groups. A class inside a negation narrows which elements the rule skips; it never
 * confines the rule to this module's markup, so `.cds--btn:not(.myThing)` is still a page-wide rule.
 */
function stripNegations(selector: string): string {
  let out = '';

  for (let i = 0; i < selector.length; i++) {
    if (!selector.startsWith(':not(', i)) {
      out += selector[i];
      continue;
    }

    let depth = 0;

    for (i += 4; i < selector.length; i++) {
      if (selector[i] === '(') {
        depth += 1;
      } else if (selector[i] === ')' && (depth -= 1) === 0) {
        break;
      }
    }
  }

  return out;
}

function classify(prelude: string): BlockKind {
  if (!prelude.startsWith('@')) {
    return 'style';
  }

  return /^@(?:-\w+-)?keyframes\b/.test(prelude) ? 'keyframes' : 'at-rule';
}

/** Whether this single (comma-free) selector restyles the page rather than the module's own markup. */
function isGlobal(selector: string): boolean {
  const trimmed = selector.trim();

  if (trimmed.length === 0) {
    return false;
  }

  const anchors = stripNegations(trimmed).match(anchorPattern) ?? [];

  return anchors.length > 0
    ? anchors.every((anchor) => carbonAnchorPattern.test(anchor))
    : !anchorlessExemptPattern.test(trimmed);
}

/**
 * Returns the distinct selectors in `css` that restyle the page rather than the module's own markup.
 *
 * Only rules that aren't nested inside another style rule are considered: native CSS nesting puts the
 * scoping class on the parent, so `.myThing { .cds--btn { … } }` is a correctly scoped override even
 * though the inner selector reads as a bare Carbon one. Rules nested in an at-rule — `@media`,
 * `@supports`, `@layer` — are considered, since those don't scope anything.
 *
 * @param css The contents of an emitted stylesheet
 */
export function findGlobalCarbonRules(css: string): Array<string> {
  const globals = new Set<string>();
  const blocks: Array<BlockKind> = [];
  let prelude = '';

  for (const char of stripNoise(css)) {
    if (char === '{') {
      const kind = classify(prelude.trim());

      if (kind === 'style' && !blocks.some((block) => block !== 'at-rule')) {
        for (const selector of splitSelectorList(prelude)) {
          if (isGlobal(selector)) {
            globals.add(selector.trim());
          }
        }
      }

      blocks.push(kind);
      prelude = '';
    } else if (char === '}') {
      blocks.pop();
      prelude = '';
    } else if (char === ';') {
      // A declaration, or a statement at-rule such as `@import`; neither introduces a selector.
      prelude = '';
    } else {
      prelude += char;
    }
  }

  return [...globals];
}

const pluginName = 'CarbonCssGuardPlugin';
const maxReportedSelectors = 10;

/**
 * Builds the failure reported to the developer.
 *
 * @param appName The module being built, named as it appears in its `package.json`
 * @param offences The offending selectors found, keyed by the asset each was found in
 */
export function buildGlobalCarbonRuleError(appName: string, offences: Map<string, Array<string>>): Error {
  const total = [...offences.values()].reduce((count, selectors) => count + selectors.length, 0);
  const detail = [...offences]
    .map(([asset, selectors]) => {
      const shown = selectors.slice(0, maxReportedSelectors).map((selector) => `    ${selector}`);
      const rest = selectors.length - shown.length;
      return [`  ${asset}`, ...shown, ...(rest > 0 ? [`    …and ${rest} more`] : [])].join('\n');
    })
    .join('\n');

  // The two cases have nothing to do with each other, and pointing someone who wrote `body { margin: 0 }`
  // at their Carbon imports sends them looking in the wrong place entirely.
  const selectors = [...offences.values()].flat();
  const remedy = [
    selectors.some((selector) => selector.includes(carbonPrefix))
      ? 'Selectors naming Carbon classes usually come from SCSS that `@use`s `@carbon/styles`, one of its ' +
        'resets, or an individual component stylesheet, instead of only its tokens, mixins, and functions, ' +
        "which emit no CSS. To override Carbon from this module, anchor the selector to one of the module's " +
        'own classes — `.myThing :global(.cds--btn)` rather than `:global(.cds--btn)`.'
      : undefined,
    selectors.some((selector) => !selector.includes(carbonPrefix))
      ? 'Selectors with no class or id of their own — element, universal, or attribute selectors — apply to ' +
        'the whole page, including other modules. Scope them to this module, e.g. `.myThing p` rather than ' +
        '`p`, or move them to the app shell if they really are meant to be global.'
      : undefined,
  ].filter(Boolean);

  return new Error(
    `${appName} emits ${total} global CSS rule(s). Carbon's CSS is delivered once, by the app shell, so ` +
      `frontend modules must not restyle the page as a whole.\n\n${detail}\n\n${remedy.join('\n\n')}`,
  );
}

/**
 * Fails the build if any emitted stylesheet restyles the page as a whole. Runs at the reporting stage,
 * late enough to see minified output, so it checks the CSS that actually ships.
 *
 * Only meaningful in a build that extracts CSS: under `style-loader` there are no `.css` assets to
 * read, so the shared configs add this in production only.
 */
export class CarbonCssGuardPlugin {
  /**
   * @param appName The module being built, named as it appears in its `package.json`
   */
  constructor(private readonly appName: string) {}

  apply(compiler: Compiler) {
    // Read off the compiler rather than imported, so this package needs a dependency on neither bundler.
    const stage = (compiler.rspack ?? compiler.webpack)?.Compilation?.PROCESS_ASSETS_STAGE_REPORT;

    if (stage === undefined) {
      throw new Error(
        `${pluginName} could not determine the asset-processing stage to run at: the compiler exposes ` +
          'neither `rspack` nor `webpack`. Refusing to register, rather than silently checking nothing.',
      );
    }

    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      compilation.hooks.processAssets.tap({ name: pluginName, stage }, (assets) => {
        const offences = new Map<string, Array<string>>();

        for (const [name, source] of Object.entries(assets)) {
          if (!name.endsWith('.css')) {
            continue;
          }

          const globals = findGlobalCarbonRules(source.source().toString());

          if (globals.length > 0) {
            offences.set(name, globals);
          }
        }

        if (offences.size > 0) {
          compilation.errors.push(buildGlobalCarbonRuleError(this.appName, offences));
        }
      });
    });
  }
}
