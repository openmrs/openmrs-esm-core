export function routePrefix(prefix: string, location: Location) {
  return location.pathname.startsWith(window.getOpenmrsSpaBase() + prefix);
}

export function routeRegex(regex: RegExp, location: Location) {
  const result = regex.test(
    location.pathname.replace(window.getOpenmrsSpaBase(), "")
  );
  return result;
}

export function distinct<T>(values: Array<T>) {
  return values.filter((value, index, self) => self.indexOf(value) === index);
}

export function flatten<T>(values: Array<Array<T>>) {
  return values.reduce((a, b) => a.concat(b), []);
}
