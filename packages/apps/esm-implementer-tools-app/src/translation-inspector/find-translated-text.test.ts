import { beforeEach, describe, expect, it, vi } from 'vitest';
import { matchTranslations, type TranslationSighting } from '@openmrs/esm-framework/src/internal';
import { findTranslatedText } from './find-translated-text';

const mockMatchTranslations = vi.mocked(matchTranslations);

const loginButtonSighting: TranslationSighting = {
  namespace: '@openmrs/esm-login-app',
  key: 'loginButton',
  value: 'Log in',
  hasCount: false,
};

beforeEach(() => {
  mockMatchTranslations.mockImplementation((text: string) => (text.trim() === 'Log in' ? [loginButtonSighting] : []));
});

function buildDom(html: string): HTMLElement {
  document.body.innerHTML = html;
  return document.body.firstElementChild as HTMLElement;
}

describe('findTranslatedText', () => {
  it('resolves text rendered as an element’s own text node', () => {
    const element = buildDom('<button>Log in</button>');

    expect(findTranslatedText(element)).toEqual({ element, sightings: [loginButtonSighting], attribute: undefined });
  });

  it('walks up to the nearest translated ancestor', () => {
    const button = buildDom('<button><span><svg></svg></span>Log in</button>');
    const svg = button.querySelector('svg') as Element;

    expect(findTranslatedText(svg)?.element).toBe(button);
  });

  it('resolves text that is only rendered as an attribute', () => {
    const element = buildDom('<button aria-label="Log in"><svg></svg></button>');

    expect(findTranslatedText(element)).toEqual({
      element,
      sightings: [loginButtonSighting],
      attribute: 'aria-label',
    });
  });

  it('prefers an element’s own text to its attributes when both are translations', () => {
    const element = buildDom('<button title="Log in">Log in</button>');

    expect(findTranslatedText(element)?.attribute).toBeUndefined();
  });

  it('skips a landmark’s aria-label, which is never shown on screen', () => {
    const nav = buildDom('<nav aria-label="Log in"><ul><li>Untranslated item</li></ul></nav>');
    const item = nav.querySelector('li') as Element;

    expect(findTranslatedText(nav)).toBeNull();
    expect(findTranslatedText(item)).toBeNull();
  });

  it('does not claim text that merely contains a translation', () => {
    expect(findTranslatedText(buildDom('<h1>Please Log in now</h1>'))).toBeNull();
  });

  it('reports nothing for text that came from no translation', () => {
    expect(findTranslatedText(buildDom('<p>Kaposi sarcoma</p>'))).toBeNull();
  });

  it('ignores the implementer tools’ own UI', () => {
    const element = buildDom('<div data-openmrs-implementer-tools><button>Log in</button></div>');
    const button = element.querySelector('button') as Element;

    expect(findTranslatedText(button)).toBeNull();
  });
});
