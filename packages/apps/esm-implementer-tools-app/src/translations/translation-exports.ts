import { translationOverridesKey } from './translation-catalog';

/**
 * The language Transifex treats as the source for every OpenMRS resource. Its strings come from each
 * app's `en.json` and are pushed from the code, so they are not something to upload changes for.
 */
export const transifexSourceLanguage = 'en';

/** The local (temporary config) overrides for one namespace and language, as a flat key/value map. */
export function getLocalEdits(
  temporaryConfig: Record<string, any> | undefined,
  namespace: string,
  language: string,
): Record<string, string> {
  const edits = temporaryConfig?.[namespace]?.[translationOverridesKey]?.[language] ?? {};

  return Object.fromEntries(
    Object.entries(edits).filter((entry): entry is [string, string] => typeof entry[1] === 'string'),
  );
}

/** A config file carrying the given edits, in the shape a distribution's config takes them. */
export function toOverrideFile(namespace: string, language: string, edits: Record<string, string>) {
  return { [namespace]: { [translationOverridesKey]: { [language]: edits } } };
}

/**
 * The locale code Transifex and the translation files use for a language tag: `ar-SY` is stored as
 * `ar_SY.json`.
 */
export function toTransifexLocale(language: string): string {
  return language.replace(/-/g, '_');
}

/** A file name for a namespace's overrides that is safe on any file system: `openmrs-esm-login-app`. */
export function toFileSafeName(namespace: string): string {
  return namespace.replace(/^@/, '').replace(/[^\w.-]+/g, '-');
}

/** Saves `data` as a pretty-printed JSON file through the browser's download mechanism. */
export function downloadJson(fileName: string, data: unknown) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, undefined, 2) + '\n'], { type: 'application/json' }));
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();

  // Deferred so the download has started before its URL goes away.
  setTimeout(() => URL.revokeObjectURL(url));
}
