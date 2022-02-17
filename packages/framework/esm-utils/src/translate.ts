import _i18n from "i18next";

export function translateFrom(
  moduleName: string,
  key: string,
  fallback?: string,
  options?: object
) {
  const i18n: typeof _i18n = (_i18n as any).default || _i18n;
  const tOptions = {
    ns: moduleName,
    defaultValue: fallback,
    ...options,
  };
  return i18n.t(key, tOptions);
}
