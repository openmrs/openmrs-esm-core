import { describe, expect, it } from 'vitest';
import { checks, inspectCatalog, inspectSources, parseTranslationCalls, pluralFamilies } from './lint-translations';

function findingsFor(source: string, catalog: Record<string, string> = {}) {
  return inspectSources({ module: 'test-module', catalog, files: [{ file: '/repo/src/a.tsx', source }] });
}

describe('parseTranslationCalls', () => {
  it('finds a call and its default value', () => {
    const { calls } = parseTranslationCalls(`const a = t('addVitals', 'Add vitals');`);

    expect(calls).toEqual([{ key: 'addVitals', defaultValue: 'Add vitals', line: 1 }]);
  });

  it('ignores calls that are commented out, which modules keep around as extraction hints', () => {
    const { calls } = parseTranslationCalls(`
      // t('Routine', 'Routine')
      /* t('Stat', 'Stat') */
      const a = t('real', 'Real');
    `);

    expect(calls).toEqual([{ key: 'real', defaultValue: 'Real', line: 4 }]);
  });

  it('is not fooled by an apostrophe in JSX text', () => {
    const { calls } = parseTranslationCalls(`const a = <p>Don't forget {t('key', 'Default')}</p>;`);

    expect(calls).toEqual([{ key: 'key', defaultValue: 'Default', line: 1 }]);
  });

  it('is not fooled by // inside a string or by a regular expression holding quotes', () => {
    const { calls } = parseTranslationCalls(`
      const url = "https://example.com//x";
      const re = /['"]/;
      const a = t('key', 'Default');
    `);

    expect(calls).toEqual([{ key: 'key', defaultValue: 'Default', line: 4 }]);
  });

  it('reports accurate lines for two identical calls on separate lines', () => {
    const { calls } = parseTranslationCalls(`const a = t('k', 'D');\nconst b = t('k', 'D');`);

    expect(calls.map((call) => call.line)).toEqual([1, 2]);
  });

  it('reads a template literal default but not an interpolated one', () => {
    const { calls } = parseTranslationCalls(
      'const a = t("plain", `Plain text`);\nconst b = t("interpolated", `Hi ${name}`);',
    );

    expect(calls[0].defaultValue).toBe('Plain text');
    expect(calls[0].interpolatedDefault).toBeUndefined();
    expect(calls[1].defaultValue).toBeUndefined();
    expect(calls[1].interpolatedDefault).toBe(true);
  });

  it('flags a non-literal key', () => {
    const { calls } = parseTranslationCalls(`const a = t(allergy.reactionSeverity);`);

    expect(calls[0].dynamicKey).toBe('allergy.reactionSeverity');
  });

  it('does not treat getCoreTranslation as a t() call', () => {
    const { calls } = parseTranslationCalls(`const a = getCoreTranslation('error', 'Error');`);

    expect(calls).toEqual([]);
  });

  it('finds a case transform applied to translated text', () => {
    const { transforms } = parseTranslationCalls(`const a = t('refills', 'Refills').toUpperCase();`);

    expect(transforms).toEqual([{ method: 'toUpperCase', line: 1 }]);
  });

  it('leaves toUpperCase on an ordinary string alone', () => {
    const { transforms } = parseTranslationCalls(`const a = patient.name.toUpperCase();`);

    expect(transforms).toEqual([]);
  });
});

describe('pluralFamilies', () => {
  it('groups plural keys under their base key', () => {
    const families = pluralFamilies({
      flagCount_one: '{{count}} risk flag',
      flagCount_other: '{{count}} risk flags',
      unrelated: 'Unrelated',
    });

    expect([...families.keys()]).toEqual(['flagCount']);
    expect(families.get('flagCount')).toEqual({ one: '{{count}} risk flag', other: '{{count}} risk flags' });
  });
});

describe('inspectCatalog', () => {
  it('accepts a correct plural family', () => {
    const findings = inspectCatalog('m', {
      flagCount_one: '{{count}} risk flag',
      flagCount_other: '{{count}} risk flags',
    });

    expect(findings).toEqual([]);
  });

  it('warns, but does not error, when the forms of a plural family are identical', () => {
    const findings = inspectCatalog('m', {
      searchResults_one: '{{count}} results',
      searchResults_other: '{{count}} results',
    });

    expect(findings).toHaveLength(1);
    expect(findings[0].check).toBe('identical-plural-forms');
    expect(findings[0].key).toBe('searchResults');
    // Identical forms are legitimate for invariant nouns, so a human decides. See the fish case below.
    expect(findings[0].severity).toBe('warning');
  });

  it('does not error on an invariant noun whose forms are legitimately identical', () => {
    const findings = inspectCatalog('m', { fishCount_one: '{{count}} fish', fishCount_other: '{{count}} fish' });

    expect(findings.filter((finding) => finding.severity === 'error')).toEqual([]);
  });

  it('accepts forms that differ without repeating the count, since plural selection can change other words', () => {
    const findings = inspectCatalog('m', {
      sheep_one: 'This sheep is healthy',
      sheep_other: 'These sheep are healthy',
    });

    expect(findings).toEqual([]);
  });

  it('flags {{count}} with no plural forms', () => {
    const findings = inspectCatalog('m', { itemCount: '{{count}} items' });

    expect(findings.map((finding) => finding.check)).toEqual(['count-without-plural-forms']);
  });

  it('flags a plural form that drops the count the other form interpolates', () => {
    const findings = inspectCatalog('m', { itemCount_one: 'one item', itemCount_other: '{{count}} items' });

    expect(findings.map((finding) => finding.check)).toEqual(['plural-form-placeholder-mismatch']);
    expect(findings[0].key).toBe('itemCount_one');
    expect(findings[0].message).toContain('{{count}}');
  });

  it('flags a plural form that drops a non-count placeholder', () => {
    const findings = inspectCatalog('m', {
      shown_one: '{{count}} of {{total}} result',
      shown_other: '{{count}} results',
    });

    expect(findings.map((finding) => finding.check)).toEqual(['plural-form-placeholder-mismatch']);
    expect(findings[0].key).toBe('shown_other');
    expect(findings[0].message).toContain('{{total}}');
  });

  it('flags leading or trailing whitespace', () => {
    const findings = inspectCatalog('m', { daysAgo: ' days ago' });

    expect(findings.map((finding) => finding.check)).toEqual(['untrimmed-value']);
  });

  it('flags two keys holding the same text with different capitalization', () => {
    const findings = inspectCatalog('m', { visitType: 'Visit type', visitType_title: 'Visit Type' });

    expect(findings.map((finding) => finding.check)).toEqual(['case-only-duplicate']);
  });

  it('does not flag two keys that hold identical text, since one may be reused deliberately', () => {
    const findings = inspectCatalog('m', { visits: 'Visits', Visits: 'Visits' });

    expect(findings).toEqual([]);
  });
});

describe('inspectSources', () => {
  it('flags a default that disagrees with en.json on wording', () => {
    const findings = findingsFor(`t('notApplicable', 'Not applicable');`, { notApplicable: 'N/A' });

    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({
      check: 'default-value-drift',
      severity: 'error',
      key: 'notApplicable',
      line: 1,
    });
    expect(findings[0].message).toContain('en.json is what renders');
  });

  it('downgrades a drift that is only about capitalization', () => {
    const findings = findingsFor(`t('lotNumber', 'Lot Number');`, { lotNumber: 'Lot number' });

    expect(findings.map((finding) => [finding.check, finding.severity])).toEqual([
      ['default-value-case-drift', 'warning'],
    ]);
  });

  it('accepts a default that matches en.json', () => {
    expect(findingsFor(`t('addVitals', 'Add vitals');`, { addVitals: 'Add vitals' })).toEqual([]);
  });

  it('says nothing about a key that is absent from en.json', () => {
    expect(findingsFor(`t('brandNew', 'Brand new');`, {})).toEqual([]);
  });

  it('flags one key called with two different defaults', () => {
    const findings = findingsFor(`t('deleteEncounter', 'Delete');\nt('deleteEncounter', 'Delete encounter');`);

    expect(findings.map((finding) => finding.check)).toEqual(['conflicting-defaults']);
    expect(findings[0].message).toContain('"Delete"');
    expect(findings[0].message).toContain('"Delete encounter"');
  });

  it('flags a call with no default value', () => {
    const findings = findingsFor(`t('Routine');`);

    expect(findings.map((finding) => finding.check)).toEqual(['missing-default-value']);
  });

  it('flags an interpolated template default, which cannot be extracted and is dropped at runtime', () => {
    const findings = findingsFor('t("visitEnded", `${visitType} ended successfully`);', {
      visitEnded: 'Ended current visit successfully',
    });

    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({ check: 'interpolated-default-value', severity: 'error', key: 'visitEnded' });
    expect(findings[0].message).toContain('"Ended current visit successfully"');
  });

  it('does not confuse an interpolated default with a missing one', () => {
    const findings = findingsFor('t("k", `${x} y`);');

    expect(findings.map((finding) => finding.check)).toEqual(['interpolated-default-value']);
  });

  it('flags a case transform on translated text', () => {
    const findings = findingsFor(`t('refills', 'Refills').toUpperCase();`, { refills: 'Refills' });

    expect(findings.map((finding) => finding.check)).toEqual(['case-transform-on-translation']);
  });

  it('skips a file that does not parse rather than failing the run', () => {
    const findings = inspectSources({
      module: 'm',
      catalog: {},
      files: [{ file: '/repo/src/broken.tsx', source: 'const = = =;' }],
    });

    expect(findings).toEqual([]);
  });
});

describe('checks', () => {
  it('has unique ids', () => {
    expect(new Set(checks.map((check) => check.id)).size).toBe(checks.length);
  });

  it('keeps the dynamic key check opt-in, because config-driven keys are legitimate', () => {
    expect(checks.find((check) => check.id === 'translated-dynamic-key')?.optIn).toBe(true);
  });

  it('marks only unambiguous breakage as an error', () => {
    const errors = checks.filter((check) => check.severity === 'error').map((check) => check.id);

    expect(errors).toEqual([
      'plural-form-placeholder-mismatch',
      'count-without-plural-forms',
      'default-value-drift',
      'untrimmed-value',
      'interpolated-default-value',
    ]);
  });
});
