// The Carbon CSS guard fails a module's production build when its emitted stylesheets restyle the page
// as a whole (RFC 0033). It reads minified CSS with a hand-rolled scanner, and it is a hard build error
// for every module in the ecosystem, so a false positive is as costly as a miss.
import { describe, expect, it } from 'vitest';
import { buildGlobalCarbonRuleError, findGlobalCarbonRules } from './index';

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
});
