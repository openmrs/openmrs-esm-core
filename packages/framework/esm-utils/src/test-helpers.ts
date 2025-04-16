/** @module @category Utility */

/**
 * Given a config schema, this returns an object like is returned by `useConfig`
 * with all default values.
 *
 * This should be used in tests and not in production code.
 *
 * If all you need is the default values in your tests, these are returned by
 * default from the `useConfig`/`getConfig` mock. This function is useful if you
 * need to override some of the default values.
 */
export function getDefaultsFromConfigSchema<T = Record<string, any>>(
  schema: Record<string | number | symbol, unknown>,
): T {
  let tmp = {};
  for (let k of Object.keys(schema)) {
    if (
      isOrdinaryObject(schema[k]) &&
      (schema[k] as Record<string | number | symbol, unknown>).hasOwnProperty('_default')
    ) {
      tmp[k] = (schema[k] as Record<string | number | symbol, unknown>)._default;
    } else if (k.startsWith('_')) {
      continue;
    } else if (isOrdinaryObject(schema[k])) {
      tmp[k] = getDefaultsFromConfigSchema(schema[k] as Record<string | number | symbol, unknown>);
    } else {
      tmp[k] = schema[k];
    }
  }
  return tmp as T;
}

function isOrdinaryObject(x: any): x is Record<string | number | symbol, unknown> {
  return !!x && x.constructor === Object;
}
