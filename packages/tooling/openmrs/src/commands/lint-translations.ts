/* eslint-disable no-console */
import { readFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { glob } from 'glob';
import { parseSync } from '@swc/core';
import chalk from 'chalk';
import { logInfo } from '../utils';

export interface LintTranslationsArgs {
  root: string;
  check: Array<string>;
  strict: boolean;
  format: string;
}

export type Severity = 'error' | 'warning';

export interface TranslationFinding {
  /** Identifier of the check that produced this finding, e.g. `default-value-drift`. */
  check: string;
  severity: Severity;
  /** Name of the frontend module the finding belongs to. */
  module: string;
  key: string;
  message: string;
  /** Path relative to the repository root, when the finding comes from a call site. */
  file?: string;
  line?: number;
}

interface CheckDefinition {
  id: string;
  severity: Severity;
  description: string;
  /**
   * Checks that are off unless named explicitly via `--check`. Reserved for patterns with
   * legitimate uses, where flagging every occurrence would train people to ignore the linter.
   */
  optIn?: boolean;
}

export const checks: Array<CheckDefinition> = [
  {
    id: 'broken-plural-family',
    severity: 'error',
    description: 'Every form of a plural family holds the same text, so the count never changes the output.',
  },
  {
    id: 'count-without-plural-forms',
    severity: 'error',
    description: 'A key interpolates {{count}} but has no plural forms, so i18next cannot pluralize it.',
  },
  {
    id: 'plural-form-missing-count',
    severity: 'error',
    description: 'One form of a plural family omits the {{count}} the other forms interpolate.',
  },
  {
    id: 'default-value-drift',
    severity: 'error',
    description: 'The default value in a t() call says something different from the string that ships in en.json.',
  },
  {
    id: 'untrimmed-value',
    severity: 'error',
    description: 'A value has leading or trailing whitespace, which means it is concatenated with something else.',
  },
  {
    id: 'interpolated-default-value',
    severity: 'error',
    description:
      'A t() default is a template literal with something interpolated into it. i18next-parser cannot extract it, ' +
      'and because en.json wins at runtime the interpolated value never reaches the screen.',
  },
  {
    id: 'default-value-case-drift',
    severity: 'warning',
    description: 'The default value in a t() call differs from en.json only by capitalization.',
  },
  {
    id: 'conflicting-defaults',
    severity: 'warning',
    description: 'One key is called with two different default values in the same module.',
  },
  {
    id: 'case-only-duplicate',
    severity: 'warning',
    description: 'Several keys hold the same text differing only by capitalization.',
  },
  {
    id: 'case-transform-on-translation',
    severity: 'warning',
    description: 'toUpperCase() or toLowerCase() is applied to translated text, which is not locale-safe.',
  },
  {
    id: 'missing-default-value',
    severity: 'warning',
    description: 'A t() call has no default value, so there is nothing for i18next-parser to extract.',
  },
  {
    id: 'translated-dynamic-key',
    severity: 'warning',
    description:
      'A t() call takes a non-literal key. Intentional for implementer-supplied config, but broken for backend data.',
    optIn: true,
  },
];

const pluralSuffixes = ['zero', 'one', 'two', 'few', 'many', 'other'];
const pluralSuffixPattern = new RegExp(`_(${pluralSuffixes.join('|')})$`);

/**
 * SWC hands out spans from a counter that keeps climbing across every parse in the process, and a
 * module's span starts at its first token rather than at byte zero. Prefixing a sentinel statement
 * gives us a node whose position in the parsed text we know, so we can turn any span back into an
 * offset into the original source.
 */
const sentinel = '0;';

interface LiteralKeyCall {
  key: string;
  defaultValue?: string;
  /** Set only when the default is a template literal with interpolation, which cannot be extracted. */
  interpolatedDefault?: true;
  line: number;
  dynamicKey?: undefined;
}

interface DynamicKeyCall {
  dynamicKey: string;
  line: number;
  key?: undefined;
}

type TranslationCall = LiteralKeyCall | DynamicKeyCall;

interface CaseTransform {
  method: string;
  line: number;
}

function lineOf(source: string, offset: number) {
  let line = 1;

  for (let i = 0; i < offset && i < source.length; i++) {
    if (source[i] === '\n') {
      line++;
    }
  }

  return line;
}

function literalValue(node): string | undefined {
  if (!node) {
    return undefined;
  }

  if (node.type === 'StringLiteral') {
    return node.value;
  }

  // Template literals are used for a handful of defaults. Only take ones with nothing interpolated.
  if (node.type === 'TemplateLiteral' && node.expressions?.length === 0) {
    return node.quasis?.map((quasi) => quasi.cooked ?? quasi.raw).join('');
  }

  return undefined;
}

/**
 * Pulls every `t()` call out of a source file, along with the case transforms applied to them.
 *
 * This parses rather than pattern-matches on purpose. Translation keys are quoted strings sitting in
 * files full of apostrophes in JSX text, `//` inside URLs, and regular expressions containing
 * quotes, all of which defeat a regular expression. Parsing also drops commented-out `t()` calls,
 * which matter because modules keep blocks of them around purely as extraction hints.
 */
export function parseTranslationCalls(source: string): {
  calls: Array<TranslationCall>;
  transforms: Array<CaseTransform>;
} {
  const ast = parseSync(sentinel + source, { syntax: 'typescript', tsx: true, comments: false });
  const base = ast.body[0].span.start;
  const offsetOf = (span: { start: number }) => span.start - base - sentinel.length;

  const calls: Array<TranslationCall> = [];
  const transforms: Array<CaseTransform> = [];

  const isTranslationCall = (node) =>
    node?.type === 'CallExpression' && node.callee?.type === 'Identifier' && node.callee.value === 't';

  const walk = (node) => {
    if (!node || typeof node !== 'object') {
      return;
    }

    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }

    if (isTranslationCall(node)) {
      // Arguments are wrapped: { spread, expression }.
      const args = (node.arguments ?? []).map((argument) => argument?.expression);
      const line = lineOf(source, offsetOf(node.span));
      const key = literalValue(args[0]);

      if (key === undefined) {
        const dynamicKey = source
          .slice(offsetOf(args[0]?.span ?? node.span), offsetOf(node.span) + 80)
          .split(/[,)]/)[0];
        calls.push({ dynamicKey: dynamicKey.trim(), line });
      } else if (args[1]?.type === 'TemplateLiteral' && args[1].expressions?.length > 0) {
        calls.push({ key, interpolatedDefault: true, line });
      } else {
        calls.push({ key, defaultValue: literalValue(args[1]), line });
      }
    }

    // `t('refills', 'Refills').toUpperCase()`
    if (
      node.type === 'CallExpression' &&
      node.callee?.type === 'MemberExpression' &&
      (node.callee.property?.value === 'toUpperCase' || node.callee.property?.value === 'toLowerCase') &&
      isTranslationCall(node.callee.object)
    ) {
      transforms.push({ method: node.callee.property.value, line: lineOf(source, offsetOf(node.span)) });
    }

    for (const property of Object.keys(node)) {
      if (property !== 'span') {
        walk(node[property]);
      }
    }
  };

  walk(ast);

  return { calls, transforms };
}

/** Groups the plural keys of a catalog by the base key they belong to. */
export function pluralFamilies(catalog: Record<string, string>) {
  const families = new Map<string, Record<string, string>>();

  for (const [key, value] of Object.entries(catalog)) {
    const match = pluralSuffixPattern.exec(key);

    if (match) {
      const base = key.slice(0, match.index);
      families.set(base, { ...families.get(base), [match[1]]: value });
    }
  }

  return families;
}

/** Runs the catalog-only checks, which need nothing but `en.json` itself. */
export function inspectCatalog(module: string, catalog: Record<string, string>): Array<TranslationFinding> {
  const findings: Array<TranslationFinding> = [];

  for (const [base, forms] of pluralFamilies(catalog)) {
    const values = Object.values(forms);

    if (values.length > 1 && new Set(values).size === 1) {
      findings.push({
        check: 'broken-plural-family',
        severity: 'error',
        module,
        key: base,
        message: `all ${values.length} plural forms hold the same text ${JSON.stringify(
          values[0],
        )}, so every count renders it`,
      });
    }

    const withCount = Object.keys(forms).filter((form) => forms[form].includes('{{count}}'));
    const withoutCount = Object.keys(forms).filter((form) => !forms[form].includes('{{count}}'));

    if (withCount.length > 0 && withoutCount.length > 0) {
      findings.push({
        check: 'plural-form-missing-count',
        severity: 'error',
        module,
        key: base,
        message: `${withoutCount.map((form) => `_${form}`).join(', ')} omits the {{count}} that ${withCount
          .map((form) => `_${form}`)
          .join(', ')} interpolates`,
      });
    }
  }

  const byLowercasedValue = new Map<string, Array<string>>();

  for (const [key, value] of Object.entries(catalog)) {
    if (typeof value !== 'string') {
      continue;
    }

    if (value.includes('{{count}}') && !pluralSuffixPattern.test(key)) {
      findings.push({
        check: 'count-without-plural-forms',
        severity: 'error',
        module,
        key,
        message: `interpolates {{count}} but has no _one/_other forms, so i18next renders one phrasing for every count`,
      });
    }

    if (value !== value.trim()) {
      findings.push({
        check: 'untrimmed-value',
        severity: 'error',
        module,
        key,
        message: `has leading or trailing whitespace (${JSON.stringify(
          value,
        )}), which means it is glued onto another string`,
      });
    }

    if (value.trim() && !pluralSuffixPattern.test(key)) {
      const lowercased = value.trim().toLowerCase();
      byLowercasedValue.set(lowercased, [...(byLowercasedValue.get(lowercased) ?? []), key]);
    }
  }

  for (const keys of byLowercasedValue.values()) {
    if (keys.length > 1 && new Set(keys.map((key) => catalog[key])).size > 1) {
      findings.push({
        check: 'case-only-duplicate',
        severity: 'warning',
        module,
        key: keys[0],
        message: `duplicated with different capitalization across ${keys
          .map((key) => `${key}=${JSON.stringify(catalog[key])}`)
          .join(', ')}`,
      });
    }
  }

  return findings;
}

interface ModuleSources {
  module: string;
  catalog: Record<string, string>;
  files: Array<{ file: string; source: string }>;
}

/** Runs the checks that compare call sites against `en.json`. */
export function inspectSources({ module, catalog, files }: ModuleSources): Array<TranslationFinding> {
  const findings: Array<TranslationFinding> = [];
  const defaultsByKey = new Map<string, Set<string>>();

  for (const { file, source } of files) {
    let parsed: ReturnType<typeof parseTranslationCalls>;

    try {
      parsed = parseTranslationCalls(source);
    } catch {
      // A file we cannot parse is a problem for the compiler to report, not the translation linter.
      continue;
    }

    for (const call of parsed.calls) {
      if (call.dynamicKey !== undefined) {
        findings.push({
          check: 'translated-dynamic-key',
          severity: 'warning',
          module,
          key: call.dynamicKey,
          message: `key is not a literal, so it has no entry in en.json and t() returns it unchanged`,
          file,
          line: call.line,
        });
        continue;
      }

      if (call.interpolatedDefault) {
        findings.push({
          check: 'interpolated-default-value',
          severity: 'error',
          module,
          key: call.key,
          message:
            `default is a template literal with interpolation, so i18next-parser cannot extract it and the ` +
            `interpolated value is dropped in favour of whatever en.json holds` +
            `${typeof catalog[call.key] === 'string' ? ` (${JSON.stringify(catalog[call.key])})` : ''}` +
            `. Use an i18next placeholder and pass the value in the options instead.`,
          file,
          line: call.line,
        });
        continue;
      }

      if (call.defaultValue === undefined) {
        findings.push({
          check: 'missing-default-value',
          severity: 'warning',
          module,
          key: call.key,
          message: `called without a default value, so i18next-parser has nothing to extract`,
          file,
          line: call.line,
        });
        continue;
      }

      defaultsByKey.set(call.key, new Set([...(defaultsByKey.get(call.key) ?? []), call.defaultValue]));

      const shipped = catalog[call.key];

      if (typeof shipped === 'string' && shipped !== call.defaultValue) {
        const caseOnly = shipped.toLowerCase() === call.defaultValue.toLowerCase();
        findings.push({
          check: caseOnly ? 'default-value-case-drift' : 'default-value-drift',
          severity: caseOnly ? 'warning' : 'error',
          module,
          key: call.key,
          message: `code says ${JSON.stringify(call.defaultValue)} but en.json ships ${JSON.stringify(
            shipped,
          )}, and en.json is what renders`,
          file,
          line: call.line,
        });
      }
    }

    for (const transform of parsed.transforms) {
      findings.push({
        check: 'case-transform-on-translation',
        severity: 'warning',
        module,
        key: `.${transform.method}()`,
        message: `applied to translated text; casing rules differ by locale and this is a no-op for uncased scripts`,
        file,
        line: transform.line,
      });
    }
  }

  for (const [key, defaults] of defaultsByKey) {
    if (defaults.size > 1) {
      findings.push({
        check: 'conflicting-defaults',
        severity: 'warning',
        module,
        key,
        message: `called with ${defaults.size} different defaults: ${[...defaults]
          .map((value) => JSON.stringify(value))
          .join(', ')}`,
      });
    }
  }

  return findings;
}

async function readCatalog(file: string): Promise<Record<string, string>> {
  const contents = await readFile(file, 'utf8');
  const parsed = JSON.parse(contents);

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error(`${file} does not contain a translation object`);
  }

  return parsed;
}

async function moduleNameFor(moduleRoot: string, root: string) {
  try {
    const manifest = JSON.parse(await readFile(resolve(moduleRoot, 'package.json'), 'utf8'));

    if (typeof manifest.name === 'string' && manifest.name) {
      return manifest.name;
    }
  } catch {
    // Falls through to the directory name, which is good enough to identify the module.
  }

  return relative(root, moduleRoot) || '.';
}

function report(findings: Array<TranslationFinding>, root: string) {
  const byModule = new Map<string, Array<TranslationFinding>>();

  for (const finding of findings) {
    byModule.set(finding.module, [...(byModule.get(finding.module) ?? []), finding]);
  }

  const rank: Record<Severity, number> = { error: 0, warning: 1 };

  for (const module of [...byModule.keys()].sort()) {
    console.log(`\n${chalk.bold(module)}`);

    const sorted = [...(byModule.get(module) ?? [])].sort(
      (a, b) => rank[a.severity] - rank[b.severity] || a.check.localeCompare(b.check) || a.key.localeCompare(b.key),
    );

    for (const finding of sorted) {
      const label = finding.severity === 'error' ? chalk.red('error  ') : chalk.yellow('warning');
      const where = finding.file ? chalk.dim(` ${relative(root, finding.file)}:${finding.line}`) : '';
      console.log(`  ${label} ${chalk.cyan(finding.check)} ${chalk.bold(finding.key)}${where}`);
      console.log(`          ${finding.message}`);
    }
  }
}

export async function runLintTranslations(args: LintTranslationsArgs) {
  const root = resolve(args.root);
  const requested = args.check.filter(Boolean);
  const known = new Set(checks.map((check) => check.id));
  const unknown = requested.filter((id) => !known.has(id));

  if (unknown.length > 0) {
    throw new Error(
      `Unknown check(s): ${unknown.join(', ')}. Available checks: ${checks.map((check) => check.id).join(', ')}`,
    );
  }

  const enabled = new Set(
    requested.length > 0 ? requested : checks.filter((check) => !check.optIn).map((check) => check.id),
  );

  const catalogs = await glob('**/translations/en.json', {
    cwd: root,
    absolute: true,
    ignore: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.next/**'],
  });

  if (catalogs.length === 0) {
    throw new Error(`Found no translations/en.json anywhere under ${root}`);
  }

  const findings: Array<TranslationFinding> = [];

  for (const catalogFile of catalogs.sort()) {
    const moduleRoot = dirname(dirname(catalogFile));
    const module = await moduleNameFor(moduleRoot, root);
    const catalog = await readCatalog(catalogFile);

    const sourceFiles = await glob('src/**/*.{ts,tsx}', {
      cwd: moduleRoot,
      absolute: true,
      ignore: ['**/node_modules/**', '**/*.test.ts', '**/*.test.tsx', '**/*.d.ts', '**/__mocks__/**'],
    });

    const files = await Promise.all(
      sourceFiles.sort().map(async (file) => ({ file, source: await readFile(file, 'utf8') })),
    );

    findings.push(...inspectCatalog(module, catalog), ...inspectSources({ module, catalog, files }));
  }

  const relevant = findings.filter((finding) => enabled.has(finding.check));
  const errors = relevant.filter((finding) => finding.severity === 'error');
  const warnings = relevant.filter((finding) => finding.severity === 'warning');

  if (args.format === 'json') {
    console.log(JSON.stringify(relevant, null, 2));
  } else if (relevant.length === 0) {
    logInfo(`No translation problems found across ${catalogs.length} module(s).`);
  } else {
    report(relevant, root);
    console.log(
      `\n${chalk.bold(`${relevant.length} problem(s)`)} in ${catalogs.length} module(s): ` +
        `${chalk.red(`${errors.length} error(s)`)}, ${chalk.yellow(`${warnings.length} warning(s)`)}`,
    );
  }

  if (errors.length > 0) {
    throw new Error(`${errors.length} translation error(s). See the report above.`);
  }

  if (args.strict && warnings.length > 0) {
    throw new Error(`${warnings.length} translation warning(s), and --strict treats warnings as errors.`);
  }
}
