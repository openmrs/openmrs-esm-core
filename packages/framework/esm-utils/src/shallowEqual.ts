/** @module @category Utility */

/**
 * Checks whether two objects are equal, using a shallow comparison, similar to React.
 *
 * In essence, shallowEquals ensures two objects have the same own properties and that the values
 * of these are equal (===) to each other.
 *
 * @param objA The first object to compare
 * @param objB The second object to compare
 * @returns true if the objects are shallowly equal to each other
 */
export function shallowEqual(objA: unknown, objB: unknown) {
  if (Object.is(objA, objB)) {
    return true;
  }

  if (
    typeof objA !== "object" ||
    objA === null ||
    typeof objB !== "object" ||
    objB === null
  ) {
    return false;
  }

  const objAKeys = Object.getOwnPropertyNames(objA);
  const objBKeys = Object.getOwnPropertyNames(objB);

  return (
    objAKeys.length === objBKeys.length &&
    objAKeys.every((key) => objA[key] === objB[key])
  );
}
