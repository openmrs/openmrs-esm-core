import { describe, it, expect } from 'vitest';
import { extractVariableNames } from './extractor';

describe('OpenMRS Expression Extractor', () => {
  it('returns an empty list for expression lacking variables', () => {
    expect(extractVariableNames('1 + 1')).toEqual([]);
  });

  it('supports basic variables', () => {
    expect(extractVariableNames('1 + a')).toEqual(['a']);
  });

  it('extracts both variables from binary operators', () => {
    expect(extractVariableNames('a ?? b')).toEqual(['a', 'b']);
  });

  it('supports functions', () => {
    expect(extractVariableNames('a(b)')).toEqual(['a', 'b']);
  });

  it('supports built-in functions', () => {
    expect(extractVariableNames('a.includes("v")')).toEqual(['a']);
    expect(extractVariableNames('"value".includes(a)')).toEqual(['a']);
    expect(extractVariableNames('(3.14159).toPrecision(a)')).toEqual(['a']);
  });

  it('supports string templates', () => {
    expect(extractVariableNames('`${a.b}`')).toEqual(['a']);
  });

  it('supports RegExp', () => {
    expect(extractVariableNames('/.*/.test(a)')).toEqual(['a']);
  });

  it('supports global objects', () => {
    expect(extractVariableNames('Math.min(a, b, c)')).toEqual(['a', 'b', 'c']);
    expect(extractVariableNames('isNaN(a)')).toEqual(['a']);
  });

  it('supports arrow functions inside expressions', () => {
    expect(extractVariableNames('[1, 2, 3].find(v => v === a)')).toEqual(['a']);
  });

  it('supports real-world use-cases', () => {
    expect(extractVariableNames('!isEmpty(array)')).toEqual(['isEmpty', 'array']);

    expect(
      extractVariableNames(
        "includes(referredToPreventionServices, '88cdde2b-753b-48ac-a51a-ae5e1ab24846') && !includes(referredToPreventionServices, '1691AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')",
      ),
    ).toEqual(['includes', 'referredToPreventionServices']);

    expect(
      extractVariableNames(
        "(no_interest === 'b631d160-8d40-4cf7-92cd-67f628c889e8' ? 1 : no_interest === '234259ec-5368-4488-8482-4f261cc76714' ? 2 : no_interest === '8ff1f85c-4f04-4f5b-936a-5aa9320cb66e' ? 3 : 0) + (depressed === 'b631d160-8d40-4cf7-92cd-67f628c889e8' ? 1 : depressed === '234259ec-5368-4488-8482-4f261cc76714' ? 2 :  depressed==='8ff1f85c-4f04-4f5b-936a-5aa9320cb66e' ? 3 : 0) + (bad_sleep === 'b631d160-8d40-4cf7-92cd-67f628c889e8' ? 1 : bad_sleep === '234259ec-5368-4488-8482-4f261cc76714' ? 2 : bad_sleep === '8ff1f85c-4f04-4f5b-936a-5aa9320cb66e' ? 3 : 0) + (feeling_tired === 'b631d160-8d40-4cf7-92cd-67f628c889e8' ? 1 : feeling_tired === '234259ec-5368-4488-8482-4f261cc76714' ? 2 : feeling_tired === '8ff1f85c-4f04-4f5b-936a-5aa9320cb66e' ? 3 : 0) +(poor_appetite === 'b631d160-8d40-4cf7-92cd-67f628c889e8' ? 1 : poor_appetite === '234259ec-5368-4488-8482-4f261cc76714' ? 2 : poor_appetite === '8ff1f85c-4f04-4f5b-936a-5aa9320cb66e' ? 3 : 0) + (troubled === 'b631d160-8d40-4cf7-92cd-67f628c889e8' ? 1 : troubled === '234259ec-5368-4488-8482-4f261cc76714' ? 2 : troubled === '8ff1f85c-4f04-4f5b-936a-5aa9320cb66e' ? 3 : 0) + (feeling_bad === 'b631d160-8d40-4cf7-92cd-67f628c889e8' ? 1 : feeling_bad === '234259ec-5368-4488-8482-4f261cc76714' ? 2 : feeling_bad === '8ff1f85c-4f04-4f5b-936a-5aa9320cb66e' ? 3 : 0) + (speaking_slowly === 'b631d160-8d40-4cf7-92cd-67f628c889e8' ? 1 : speaking_slowly === '234259ec-5368-4488-8482-4f261cc76714' ? 2 : speaking_slowly === '8ff1f85c-4f04-4f5b-936a-5aa9320cb66e' ? 3 : 0) + (better_dead === 'b631d160-8d40-4cf7-92cd-67f628c889e8' ? 1 : better_dead === '234259ec-5368-4488-8482-4f261cc76714' ? 2 : better_dead === '8ff1f85c-4f04-4f5b-936a-5aa9320cb66e' ? 3 : 0)",
      ),
    ).toEqual([
      'no_interest',
      'depressed',
      'bad_sleep',
      'feeling_tired',
      'poor_appetite',
      'troubled',
      'feeling_bad',
      'speaking_slowly',
      'better_dead',
    ]);
  });
});
