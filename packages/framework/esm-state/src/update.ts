export function update<T extends Record<string, any>>(
  obj: T,
  [property, ...restPropertyPath]: Array<string>,
  value: any
): T {
  if (!property) {
    return obj;
  } else if (restPropertyPath.length === 0) {
    return { ...obj, [property]: value };
  } else {
    return {
      ...obj,
      [property]: update(obj[property] || {}, restPropertyPath, value),
    };
  }
}
