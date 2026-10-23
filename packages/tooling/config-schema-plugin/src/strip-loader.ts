import { stripSchemaCalls, type StripPlan } from './strip-calls';

/**
 * Rewrites a module's entry point so that it asserts its configuration schema came from the routes
 * registry rather than declaring it all over again. See {@link stripSchemaCalls}.
 *
 * A loader rather than something the plugin does to the assets, because the rewrite has to happen
 * before the module is parsed: the point of it is that the schema object becomes unreferenced, and
 * only the bundler's own graph can then shake it out.
 *
 * @module
 */

/**
 * What to rewrite, by entry point, filled in by the plugin once extraction has run.
 *
 * Passed this way rather than through loader options because the options are fixed when the rule is
 * built, which is long before there is anything to say.
 *
 * Every failure path comes out as "change nothing", by one of two routes: extraction that failed
 * leaves no entry here at all, and extraction that found nothing leaves one naming nothing, which
 * makes every call unprovable. Neither needs the other to hold.
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
    // Leaving the source alone is a real fallback rather than a shrug: an unrewritten module still
    // declares its schema at runtime, and the config system simply prefers the registry's copy. The
    // module ships a schema it does not need, which is worth a warning and not a failed build.
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
