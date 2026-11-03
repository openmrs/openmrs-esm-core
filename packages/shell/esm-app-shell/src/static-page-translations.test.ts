import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@openmrs/esm-translations/translations/fr.json', () => ({
  default: { reload: 'Recharger', copied: '' },
}));

vi.mock('@openmrs/esm-translations/translations/pt_BR.json', () => ({
  default: { reload: 'Recarregar' },
}));

function createPage() {
  const template = document.createElement('template');
  template.innerHTML = `
    <button data-i18n="reload">Reload</button>
    <span data-i18n="copied">Copied!</span>
    <span data-i18n="notAKey">Untouched</span>`;
  return template.content;
}

async function translate(lang: string) {
  document.documentElement.setAttribute('lang', lang);
  // The translations are loaded once per page, so each language needs a fresh module.
  vi.resetModules();
  const { translateStaticPage } = await import('./static-page-translations');

  const page = createPage();
  translateStaticPage(page);
  await vi.dynamicImportSettled();
  await new Promise((resolve) => setTimeout(resolve));
  return page;
}

describe('translateStaticPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('replaces the text of tagged elements with the translation for the detected language', async () => {
    const page = await translate('fr');

    expect(page.querySelector('button')?.textContent).toBe('Recharger');
  });

  it('keeps the English text for keys that are missing or untranslated', async () => {
    const page = await translate('fr');

    expect(page.querySelector('[data-i18n="copied"]')?.textContent).toBe('Copied!');
    expect(page.querySelector('[data-i18n="notAKey"]')?.textContent).toBe('Untouched');
  });

  it('loads the file named with an underscore for a regional language', async () => {
    const page = await translate('pt-BR');

    expect(page.querySelector('button')?.textContent).toBe('Recarregar');
  });

  it('falls back to the base language when there is no regional file', async () => {
    const page = await translate('fr-CA');

    expect(page.querySelector('button')?.textContent).toBe('Recharger');
  });

  it('keeps the English text when the language has no translations', async () => {
    const page = await translate('xx');

    expect(page.querySelector('button')?.textContent).toBe('Reload');
  });
});
