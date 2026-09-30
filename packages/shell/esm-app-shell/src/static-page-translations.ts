import LanguageDetector from 'i18next-browser-languagedetector';
import { languageDetectionOptions } from './language-detection';

let translations: Promise<Record<string, string>> | undefined;

/**
 * Translates the pages the shell renders from `index.ejs` templates, such as the error page. These can
 * appear before i18next is set up, or because setting it up failed, so the core translations are
 * loaded directly for the language i18next would detect, without config overrides or interpolation.
 *
 * Each element with a `data-i18n` attribute has its text replaced by the core translation of that key
 * once the translations load. Until then, or if they can't be loaded, the template's English text stays.
 */
export function translateStaticPage(root: ParentNode) {
  const elements = Array.from(root.querySelectorAll<HTMLElement>('[data-i18n]'));
  if (elements.length === 0) {
    return;
  }

  void loadTranslations().then((loaded) => {
    for (const element of elements) {
      const translation = loaded[element.dataset.i18n!];
      if (translation) {
        element.textContent = translation;
      }
    }
  });
}

function loadTranslations() {
  translations ??= (async () => {
    const detected = new LanguageDetector(undefined, languageDetectionOptions).detect();
    const language = Array.isArray(detected) ? detected[0] : detected;
    if (!language) {
      return {};
    }

    // Translation files are named with underscores, e.g. `pt_BR.json`.
    const candidates = new Set([language.replace('-', '_'), language.split(/[-_]/)[0]]);
    for (const candidate of candidates) {
      try {
        const json = await import(/* webpackMode: "lazy" */ `@openmrs/esm-translations/translations/${candidate}.json`);
        return (json.default ?? json) as Record<string, string>;
      } catch {
        // Try the next candidate
      }
    }

    return {};
  })();

  return translations;
}
