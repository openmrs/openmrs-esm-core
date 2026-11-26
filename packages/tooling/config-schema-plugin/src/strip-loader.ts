import { stripSchemaCalls, type StripPlan } from './strip-calls';

/**
 * Rewrites a module's entry point so that it asserts its configuration schema came from the routes
 * registry rather than declaring it all over again. See {@link stripSchemaCalls}.
 *
 * A loader because the rewrite must happen before parsing, so the bundler can shake out the now
 * unreferenced schema.
 *
 * @module
 */

/**
 * What to rewrite, by entry point, filled in by the plugin once extraction has run. Not loader
 * options, which are fixed before extraction runs.
 *
 * A failed extraction leaves no entry, and an empty one names nothing; either way nothing changes.
 */
const plans = new Map<string, StripPlan>();

/** @internal */
export function setStripPlan(entryPath: string, plan: StripPlan): void {
  plans.set(entryPath, plan);
}

/** @internal */
export function clearStripPlan(entryPath: string): void {
  plans.delete(entryPath);
}

interface LoaderContext {
  resourcePath: string;
  callback(error: Error | null, content?: string, map?: unknown): void;
  emitWarning(warning: Error): void;
}

export default function stripLoader(this: LoaderContext, source: string, map?: unknown): void {
  const plan = plans.get(this.resourcePath);

  if (!plan) {
    this.callback(null, source, map);
    return;
  }

  try {
    const result = stripSchemaCalls(source, this.resourcePath, plan);

    if (result.stripped.length === 0) {
      this.callback(null, source, map);
      return;
    }

    this.callback(null, result.code, result.map ? JSON.parse(result.map) : map);
  } catch (error) {
    // Safe to leave alone: the module still declares its schema at runtime and the config system
    // prefers the registry's copy. It only ships a schema it doesn't need.
    this.emitWarning(
      new Error(
        `Could not rewrite the configuration schema declarations in ${this.resourcePath}, so they have been left ` +
          `as they are. The module will declare its schema at runtime, where it is ignored in favour of the one ` +
          `in the routes registry.\n\n${error instanceof Error ? error.message : String(error)}`,
      ),
    );

    this.callback(null, source, map);
  }
}
