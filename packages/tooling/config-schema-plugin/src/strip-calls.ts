import { parseSync } from '@swc/core';
import MagicString from 'magic-string';

/**
 * Rewrites a module's runtime schema declarations into assertions that the schema shipped in the
 * routes registry instead.
 *
 * `defineConfigSchema(moduleName, configSchema)` becomes `requireStaticConfigSchema(moduleName)`,
 * which drops the only reference to the schema object and lets the bundler shake the schema, its
 * descriptions and its validators out of the module entirely.
 *
 * Replaced rather than deleted, and keeping the first argument, for two different reasons. Deleting
 * outright would make a module whose registry entry is missing its schema fail silently and
 * completely. Keeping the argument means this never has to work out *which* module is being
 * configured: whatever the expression evaluates to at runtime is what gets checked, so the analysis
 * below only has to be safe, never complete.
 *
 * Nothing here is rewritten unless it is unambiguous. Anything else is left exactly as it was, and
 * goes on declaring its schema at runtime, where the config system ignores it in favour of the
 * registry's copy.
 */

/** The framework specifiers a module may import the schema functions from. */
const frameworkSpecifiers = ['@openmrs/esm-framework', '@openmrs/esm-framework/src/internal'];

const markers = {
  defineConfigSchema: 'requireStaticConfigSchema',
  defineExtensionConfigSchema: 'requireStaticExtensionConfigSchema',
} as const;

type StrippableName = keyof typeof markers;

export interface StripPlan {
  /** The module's own package name, the only one whose schema this may assume responsibility for. */
  moduleName: string;
  /** Whether extraction recorded a schema for the module itself. */
  hasModuleSchema: boolean;
  /** The extension names extraction recorded a schema for. */
  extensionNames: Array<string>;
}

export interface StripResult {
  code: string;
  map?: string;
  /** What was rewritten, for reporting. Empty when the source was left alone. */
  stripped: Array<string>;
}

export function stripSchemaCalls(source: string, fileName: string, plan: StripPlan): StripResult {
  // Parsed with a leading empty statement so that the program provably begins at offset 0 of what
  // was parsed. swc's offsets run from a counter that keeps climbing across parses in a process,
  // and a program's own span starts at its first *token*, so leading comments or blank lines would
  // otherwise throw every offset out by however much trivia the file happens to start with.
  const jsx = fileName.endsWith('.tsx') || fileName.endsWith('.jsx');
  const program = parseSync(
    ';' + source,
    /\.tsx?$/.test(fileName)
      ? { syntax: 'typescript', tsx: jsx, target: 'es2022' }
      : { syntax: 'ecmascript', jsx, target: 'es2022' },
  );

  const base = program.span.start + 1;
  const characterAt = byteOffsetMapper(source);
  const at = (span: { start: number; end: number }) => ({
    start: characterAt(span.start - base),
    end: characterAt(span.end - base),
  });

  const bindings = findFrameworkBindings(program);

  if (bindings.size === 0) {
    return { code: source, stripped: [] };
  }

  const references = countReferences(program, new Set(bindings.keys()));
  const calls = findCallStatements(program, bindings);

  // A binding used as anything other than the callee of a bare call statement may be passed
  // somewhere this cannot see, so nothing about it can be proven and none of its calls are touched.
  const usable = new Set(
    Array.from(bindings.keys()).filter(
      (local) => references.get(local) === calls.filter((call) => call.local === local).length,
    ),
  );

  const strippable = calls.filter((call) => usable.has(call.local) && isProvable(call, calls, plan));

  if (strippable.length === 0) {
    return { code: source, stripped: [] };
  }

  const edited = new MagicString(source);
  const needed = new Map<string, Set<StrippableName>>();

  for (const call of strippable) {
    const callee = at(call.callee);
    const argumentEnd = at(call.firstArgument).end;
    // The call expression's end is just past its closing parenthesis, so stopping one short of it
    // keeps the parenthesis and takes only the arguments in between.
    const closingParenthesis = at(call.callExpression).end - 1;

    edited.overwrite(callee.start, callee.end, localMarkerName(call.imported));
    // Everything after the first argument goes, which is what drops the reference to the schema.
    edited.remove(argumentEnd, closingParenthesis);

    if (!needed.has(call.source)) {
      needed.set(call.source, new Set());
    }

    needed.get(call.source)!.add(call.imported);
  }

  for (const [importSource, names] of needed) {
    const specifiers = Array.from(names, (name) => `${markers[name]} as ${localMarkerName(name)}`).join(', ');
    edited.prepend(`import { ${specifiers} } from ${JSON.stringify(importSource)};\n`);
  }

  return {
    code: edited.toString(),
    map: edited.generateMap({ source: fileName, includeContent: true, hires: true }).toString(),
    stripped: strippable.map((call) => call.description),
  };
}

/**
 * Builds a lookup from a UTF-8 byte offset into `source` to the string index of the same position.
 *
 * swc reports spans as byte offsets, while `MagicString` indexes the source in UTF-16 code units.
 * The two agree only for as long as the source is ASCII, so one accented character, curly
 * apostrophe or emoji anywhere ahead of a call is enough to shift every edit made after it, which
 * silently produces a syntactically broken module rather than throwing.
 *
 * A byte in the middle of a character maps to the index of the character containing it; no span
 * boundary lands there, since swc's spans are always character boundaries.
 */
function byteOffsetMapper(source: string): (byteOffset: number) => number {
  const byteLength = Buffer.byteLength(source, 'utf8');

  if (byteLength === source.length) {
    return (byteOffset) => byteOffset;
  }

  const characterAtByte = new Int32Array(byteLength + 1);
  let byte = 0;

  for (let index = 0; index < source.length; ) {
    // A lone surrogate has no encoding of its own and is written as the replacement character,
    // which is three bytes, so measuring the code point gives the right width for it too.
    const codePoint = source.codePointAt(index)!;
    const width = codePoint < 0x80 ? 1 : codePoint < 0x800 ? 2 : codePoint < 0x10000 ? 3 : 4;

    characterAtByte.fill(index, byte, byte + width);
    byte += width;
    index += codePoint > 0xffff ? 2 : 1;
  }

  characterAtByte[byteLength] = source.length;

  return (byteOffset) => characterAtByte[byteOffset] ?? source.length;
}

/**
 * The local name a marker is imported under.
 *
 * Deliberately not the marker's own name: a module is free to have something else called that, and
 * an import added here must not shadow it or collide with it.
 */
function localMarkerName(name: StrippableName): string {
  return `__openmrs_${markers[name]}`;
}

interface SchemaCall {
  /** The name the module imported, before any aliasing. */
  imported: StrippableName;
  /** The name it is referred to by in this file. */
  local: string;
  /** Which framework specifier it came from, so the marker is imported from the same place. */
  source: string;
  callee: Span;
  firstArgument: Span;
  /** The call itself, whose end is just past its closing parenthesis. */
  callExpression: Span;
  /** The extension name, when the first argument is a string literal. */
  literalName?: string;
  description: string;
}

interface Span {
  start: number;
  end: number;
}

function findFrameworkBindings(program: any): Map<string, { imported: StrippableName; source: string }> {
  const bindings = new Map<string, { imported: StrippableName; source: string }>();

  for (const item of program.body) {
    if (item.type !== 'ImportDeclaration' || !frameworkSpecifiers.includes(item.source.value)) {
      continue;
    }

    for (const specifier of item.specifiers) {
      if (specifier.type !== 'ImportSpecifier') {
        continue;
      }

      const imported = (specifier.imported?.value ?? specifier.local.value) as string;

      if (Object.hasOwn(markers, imported)) {
        bindings.set(specifier.local.value, { imported: imported as StrippableName, source: item.source.value });
      }
    }
  }

  return bindings;
}

/** Counts every mention of the given names anywhere in the program, callee positions included. */
function countReferences(node: unknown, names: Set<string>): Map<string, number> {
  const counts = new Map<string, number>();

  walk(node, (current: any) => {
    if (current.type === 'Identifier' && names.has(current.value)) {
      counts.set(current.value, (counts.get(current.value) ?? 0) + 1);
    }
  });

  // The import specifier itself is a mention that is not a use.
  for (const name of names) {
    counts.set(name, (counts.get(name) ?? 0) - 1);
  }

  return counts;
}

/** Finds the calls that are bare statements whose callee is one of the bindings and nothing else. */
function findCallStatements(program: unknown, bindings: Map<string, { imported: StrippableName; source: string }>) {
  const calls: Array<SchemaCall> = [];

  walk(program, (node: any) => {
    if (node.type !== 'ExpressionStatement' || node.expression?.type !== 'CallExpression') {
      return;
    }

    const call = node.expression;
    const binding = call.callee?.type === 'Identifier' ? bindings.get(call.callee.value) : undefined;

    if (!binding) {
      return;
    }

    const first = call.arguments?.[0];

    // A spread as the first argument hides what is being configured, so there is nothing to keep.
    if (!first || first.spread || !first.expression) {
      return;
    }

    const literalName = first.expression.type === 'StringLiteral' ? (first.expression.value as string) : undefined;

    calls.push({
      imported: binding.imported,
      local: call.callee.value,
      source: binding.source,
      callee: call.callee.span,
      firstArgument: first.expression.span,
      callExpression: call.span,
      literalName,
      description: `${binding.imported}(${literalName !== undefined ? `'${literalName}'` : '...'})`,
    });
  });

  return calls;
}

/**
 * Whether a call can be shown to have produced one of the schemas extraction recorded.
 *
 * An extension schema is named by a string literal in every real case, so the name is compared
 * directly. A module's own schema is usually named by an imported or local constant, which cannot
 * be read statically; it is instead settled by there being exactly one such call and exactly one
 * recorded schema, which leaves nothing for it to be except the one that produced it.
 */
function isProvable(call: SchemaCall, allCalls: Array<SchemaCall>, plan: StripPlan): boolean {
  if (call.imported === 'defineExtensionConfigSchema') {
    return call.literalName !== undefined && plan.extensionNames.includes(call.literalName);
  }

  if (!plan.hasModuleSchema) {
    return false;
  }

  if (call.literalName !== undefined) {
    return call.literalName === plan.moduleName;
  }

  return allCalls.filter((other) => other.imported === 'defineConfigSchema').length === 1;
}

/** Visits every node of an swc AST, which has no shared shape to key off. */
function walk(node: unknown, visit: (node: any) => void): void {
  if (!node || typeof node !== 'object') {
    return;
  }

  if (Array.isArray(node)) {
    for (const item of node) {
      walk(item, visit);
    }

    return;
  }

  if (typeof (node as any).type === 'string') {
    visit(node);
  }

  for (const [key, value] of Object.entries(node)) {
    if (key !== 'span') {
      walk(value, visit);
    }
  }
}
