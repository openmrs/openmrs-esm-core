/** @module @category Utility */

/**
 * Checks whether two objects are equal, using a shallow comparison, similar to React.
 *
 * In essence, shallowEquals ensures two objects have the same own properties and that the values
 * of these are equal (===) to each other.
 *
 * @param a The first value to compare
 * @param b The second value to compare
 * @returns true if the objects are shallowly equal to each other
 */
export function shallowEqual(a: unknown, b: unknown) {
  if (a === b || Object.is(a, b)) {
    return true;
  }

  if (Array.isArray(a)) {
    if (!Array.isArray(b)) {
      return false;
    }

    if (a.length !== b.length) {
      return false;
    }

    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }

    return true;
  } else if (Array.isArray(b)) {
    return false;
  }

  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
    return false;
  }

  const objAKeys = Object.getOwnPropertyNames(a);
  const objBKeys = Object.getOwnPropertyNames(b);

  return objAKeys.length === objBKeys.length && objAKeys.every((key) => a[key] === b[key]);
}
