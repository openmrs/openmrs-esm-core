// The Carbon CSS guard fails a module's production build when its emitted stylesheets restyle the page
// as a whole (RFC 0033). It reads minified CSS with a hand-rolled scanner, and it is a hard build error
// for every module in the ecosystem, so a false positive is as costly as a miss.
import { describe, expect, it } from 'vitest';
import { buildGlobalCarbonRuleError, CarbonCssGuardPlugin, findGlobalCarbonRules } from './index';

// A module's own classes always reach the emitted CSS in this shape, since both configs set
// `localIdentName` to `${ident}__[name]__[local]___[hash:base64:5]`.
const scoped = '.-esm-login__login__inputGroup___VWJgx';

const cases: Array<{ label: string; css: string; expected: Array<string> }> = [
  // Nesting: the scoping class sits on the parent, so the inner selector reads bare but is not global.
  // Sass flattens this away, but a module can ship a plain `.css` file that uses native nesting.
  { label: 'nested override, declarations first', css: `${scoped}{color:red;.cds--btn{color:blue}}`, expected: [] },
  { label: 'nested override, no declarations', css: `${scoped}{.cds--btn{color:blue}}`, expected: [] },
  { label: 'nested override using &', css: `${scoped}{color:red;& .cds--btn{color:blue}}`, expected: [] },
  { label: 'nested override after url(#id)', css: `${scoped}{fill:url(#g);.cds--btn{color:red}}`, expected: [] },
  { label: 'nested reset inside an override', css: `${scoped}{color:red;div{margin:0}}`, expected: [] },

  // At-rules scope nothing, so a global rule inside one is still global.
  { label: 'global inside @media', css: '@media (min-width:1px){.cds--btn{color:red}}', expected: ['.cds--btn'] },
  { label: 'global inside @supports', css: '@supports (a:b){.cds--btn{color:red}}', expected: ['.cds--btn'] },
  { label: 'global inside @layer', css: '@layer overrides{.cds--btn{color:red}}', expected: ['.cds--btn'] },
  {
    label: 'scoped override inside @media',
    css: `@media (min-width:1px){${scoped} .cds--btn{color:red}}`,
    expected: [],
  },

  // Carbon-anchored selectors.
  { label: 'bare Carbon class', css: '.cds--btn{color:red}', expected: ['.cds--btn'] },
  {
    label: 'Carbon-only descendant chain',
    css: '.cds--modal .cds--btn--primary{color:red}',
    expected: ['.cds--modal .cds--btn--primary'],
  },
  {
    label: ':not() narrows but does not scope',
    css: '.cds--btn:not(.myLocal___a1){color:red}',
    expected: ['.cds--btn:not(.myLocal___a1)'],
  },
  { label: 'module-scoped Carbon override', css: `${scoped} .cds--btn{color:red}`, expected: [] },
  { label: 'id-scoped Carbon override', css: '#myAppRoot .cds--btn{color:red}', expected: [] },
  {
    label: 'a non-Carbon class anchors the override',
    css: '.omrs-breakpoint-gt-tablet .cds--side-nav__link{color:red}',
    expected: [],
  },
  {
    label: 'css-loader-scoped Carbon classes are inert, not global',
    css: '.-esm-login__datepicker-module__cds--layout--size-xs___rHkV0{block-size:1rem}',
    expected: [],
  },

  // Selectors with nothing to anchor them, such as Carbon's reset.
  { label: 'element-selector reset', css: 'html,body,div{margin:0}', expected: ['html', 'body', 'div'] },
  { label: 'universal reset', css: '*{box-sizing:border-box}', expected: ['*'] },
  { label: 'attribute-only selector', css: '[dir=rtl]{text-align:right}', expected: ['[dir=rtl]'] },
  { label: ':root carries custom properties', css: ':root{--omrs-x:1}', expected: [] },

  // `:is()`/`:where()` hold selector lists, so one anchored branch must not cover for an unanchored one.
  // Lightning CSS also lowers native nesting into `:is()`, so these turn up in output as well as source.
  {
    label: ':is() with one page-wide branch',
    css: `:is(.cds--btn,${scoped}){color:red}`,
    expected: [`:is(.cds--btn,${scoped})`],
  },
  {
    label: ':where() with one page-wide branch',
    css: `:where(.cds--btn,${scoped}){color:red}`,
    expected: [`:where(.cds--btn,${scoped})`],
  },
  {
    label: ':is() with an anchorless branch',
    css: `:is(body,${scoped}){margin:0}`,
    expected: [`:is(body,${scoped})`],
  },
  {
    label: ':is() of Carbon classes only',
    css: ':is(.cds--btn,.cds--tag){color:red}',
    expected: [':is(.cds--btn,.cds--tag)'],
  },
  { label: ':is() with every branch anchored', css: `${scoped} :is(.a___a1,.b___b2){color:red}`, expected: [] },
  {
    label: ':is() of pseudo-classes anchors nothing away',
    css: `${scoped}:is(:hover,:focus){color:red}`,
    expected: [],
  },
  { label: 'a scoped :is() of Carbon classes', css: `${scoped} :is(.cds--btn,.cds--tag){color:red}`, expected: [] },

  // `@scope` confines its contents to a subtree, so rules inside it are local however they read.
  { label: '@scope makes a bare Carbon rule local', css: `@scope (${scoped}){.cds--btn{color:red}}`, expected: [] },
  { label: '@scope with a limit', css: `@scope (${scoped}) to (.inner___b2){img{border:0}}`, expected: [] },
  { label: '@scope makes a bare element rule local', css: `@scope (${scoped}){p{margin:0}}`, expected: [] },
  {
    label: 'a rule after a @scope block is judged normally',
    css: `@scope (${scoped}){p{margin:0}}body{margin:0}`,
    expected: ['body'],
  },

  // Extension wrappers are the framework's markup, so an app has no class of its own to hang on them.
  // A named extension or slot is as specific as a class; a valueless one matches every extension there is.
  {
    label: 'a named extension wrapper anchors the rule',
    css: "[data-extension-id='sticky-notes-button']:empty{display:none}",
    expected: [],
  },
  {
    label: 'a named extension wrapper anchors a Carbon override',
    css: "[data-extension-slot-name='my-slot'] .cds--btn{min-width:7rem}",
    expected: [],
  },
  {
    label: 'quotes stripped by minification still anchor',
    css: '[data-extension-id=clinical-views-summary]{display:block}',
    expected: [],
  },
  {
    label: 'a valueless extension attribute anchors nothing',
    css: '[data-extension-id]{display:block}',
    expected: ['[data-extension-id]'],
  },
  {
    label: 'a non-extension attribute still anchors nothing',
    css: 'html[dir=rtl] .cds--side-nav{margin:0}',
    expected: ['html[dir=rtl] .cds--side-nav'],
  },
  { label: ':host carries custom properties', css: ':host{--omrs-x:1}', expected: [] },

  // Keyframe steps read like element selectors but select nothing.
  {
    label: 'keyframe steps',
    css: '@keyframes spin{from{opacity:0}50%{opacity:.5}to{transform:rotate(1turn)}}',
    expected: [],
  },
  {
    label: 'vendor-prefixed keyframe steps',
    css: '@-webkit-keyframes spin{to{opacity:1}}',
    expected: [],
  },

  // Lexical hazards in minified output.
  {
    label: 'braces and semicolons inside a string',
    css: `${scoped}{content:"}{;"}.cds--btn{color:red}`,
    expected: ['.cds--btn'],
  },
  { label: 'statement at-rule', css: '@import url(x);.cds--btn{color:red}', expected: ['.cds--btn'] },
  { label: 'comment between rules', css: '/* }{ .cds--x */.cds--btn{color:red}', expected: ['.cds--btn'] },
  { label: '@font-face declarations', css: '@font-face{font-family:x;src:url(y)}', expected: [] },
  { label: 'empty stylesheet', css: '', expected: [] },
];

describe('the Carbon CSS guard', () => {
  it.each(cases)('reports $label', ({ css, expected }) => {
    expect(findGlobalCarbonRules(css)).toEqual(expected);
  });

  // Without this, a change that makes the scanner return nothing at all would leave every case above
  // passing on the empty expectations, and the guard would become a silent no-op.
  it('still fires on the case the guard exists for', () => {
    const wholesaleCarbon = Array.from({ length: 50 }, (_, i) => `.cds--component-${i}{color:red}`).join('');

    expect(findGlobalCarbonRules(wholesaleCarbon)).toHaveLength(50);
  });

  // The two ways to fail this guard have unrelated causes, so the advice can't be one-size-fits-all.
  describe('the error it raises', () => {
    const carbonAdvice = /`@use`s `@carbon\/styles`/;
    const anchorlessAdvice = /no class or id of their own/;

    it('explains Carbon imports when the offending selectors name Carbon classes', () => {
      const message = buildGlobalCarbonRuleError('app', new Map([['a.css', ['.cds--btn']]])).message;

      expect(message).toMatch(carbonAdvice);
      expect(message).not.toMatch(anchorlessAdvice);
    });

    it('explains scoping when the offending selectors have no anchor of their own', () => {
      const message = buildGlobalCarbonRuleError('app', new Map([['a.css', ['body']]])).message;

      expect(message).toMatch(anchorlessAdvice);
      expect(message).not.toMatch(carbonAdvice);
    });

    it('explains both when both occur', () => {
      const message = buildGlobalCarbonRuleError('app', new Map([['a.css', ['.cds--btn', 'body']]])).message;

      expect(message).toMatch(carbonAdvice);
      expect(message).toMatch(anchorlessAdvice);
    });
  });

  // The scanner is covered above; this is the wiring around it. The integration tests exercise the same
  // path against today's bundlers, so what's worth unit-testing here is what they can't reach: the asset
  // filter, and the refusal to register against a compiler exposing neither bundler's namespace.
  describe('the plugin', () => {
    function fakeCompiler(namespace: 'rspack' | 'webpack' | 'neither', assets: Record<string, string>) {
      const compilation = {
        errors: [] as Array<Error>,
        hooks: {
          processAssets: {
            tap: (_options: unknown, callback: (a: Record<string, { source(): string }>) => void) =>
              callback(Object.fromEntries(Object.entries(assets).map(([name, css]) => [name, { source: () => css }]))),
          },
        },
      };
      const bundler = { Compilation: { PROCESS_ASSETS_STAGE_REPORT: 5000 } };

      return {
        compilation,
        compiler: {
          ...(namespace === 'neither' ? {} : { [namespace]: bundler }),
          hooks: { compilation: { tap: (_name: string, cb: (c: typeof compilation) => void) => cb(compilation) } },
        },
      };
    }

    it.each(['rspack', 'webpack'] as const)('reports offences found in a %s build', (namespace) => {
      const { compiler, compilation } = fakeCompiler(namespace, { 'a.css': '.cds--btn{color:red}' });

      new CarbonCssGuardPlugin('@openmrs/esm-x-app').apply(compiler as never);

      expect(compilation.errors).toHaveLength(1);
      expect(compilation.errors[0].message).toContain('.cds--btn');
      expect(compilation.errors[0].message).toContain('@openmrs/esm-x-app');
    });

    it('reads stylesheets only, not the JavaScript or source maps that carry the same text', () => {
      const { compiler, compilation } = fakeCompiler('rspack', {
        'a.js': '.cds--btn{color:red}',
        'a.css.map': '.cds--btn{color:red}',
      });

      new CarbonCssGuardPlugin('app').apply(compiler as never);

      expect(compilation.errors).toEqual([]);
    });

    it('stays quiet when nothing is global', () => {
      const { compiler, compilation } = fakeCompiler('rspack', { 'a.css': `${scoped} .cds--btn{color:red}` });

      new CarbonCssGuardPlugin('app').apply(compiler as never);

      expect(compilation.errors).toEqual([]);
    });

    it('refuses to register against a compiler exposing neither bundler, rather than checking nothing', () => {
      const { compiler } = fakeCompiler('neither', { 'a.css': '.cds--btn{color:red}' });

      expect(() => new CarbonCssGuardPlugin('app').apply(compiler as never)).toThrow(/neither `rspack` nor `webpack`/);
    });
  });
});
