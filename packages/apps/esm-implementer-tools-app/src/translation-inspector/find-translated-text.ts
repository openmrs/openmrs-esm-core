import { matchTranslations, type TranslationSighting } from '@openmrs/esm-framework/src/internal';

/**
 * Attributes whose values are translated and rendered to the user. Inspecting them is what lets the
 * inspector resolve text that never becomes a text node, such as an icon button's `aria-label`. A label
 * referenced through `aria-labelledby`, as Carbon's icon-only buttons use, is not followed.
 */
const inspectableAttributes = ['aria-label', 'title', 'placeholder', 'alt'];

/**
 * The elements whose `aria-label` stands in for a label the user would otherwise see, such as an icon
 * button's. On anything else, a landmark like the left nav for one, it is only ever read out by
 * assistive technology, and matching it would report a key for text that is not on screen.
 */
const labelledControls = [
  'a[href]',
  'button',
  'input',
  'select',
  'textarea',
  'img',
  'svg',
  ...['button', 'link', 'menuitem', 'tab', 'checkbox', 'radio', 'switch', 'option', 'combobox', 'img'].map(
    (role) => `[role="${role}"]`,
  ),
].join(', ');

export interface InspectionTarget {
  /** The element the text was found on. */
  element: Element;
  sightings: Array<TranslationSighting>;
  /** The attribute the text came from, if it was not rendered as a text node. */
  attribute?: string;
}

/**
 * Walks up from the given element to the nearest ancestor whose own text, or whose translated
 * attributes, came from a translation. Walking up is what makes hovering the middle of a button
 * resolve the button's label rather than nothing.
 *
 * Only text that is exactly a translation counts. Text that merely contains one, such as a location
 * named "Outpatient Clinic" containing the translation "Clinic", is at least as likely to be data.
 *
 * Returns `null` for the implementer tools' own UI, which is translated too and would otherwise only
 * ever report itself.
 */
export function findTranslatedText(element: Element): InspectionTarget | null {
  if (element.closest('[data-openmrs-implementer-tools]')) {
    return null;
  }

  for (let current: Element | null = element; current; current = current.parentElement) {
    for (const candidate of getInspectableStrings(current)) {
      const sightings = matchTranslations(candidate.text);

      if (sightings?.length > 0) {
        return { element: current, sightings, attribute: candidate.attribute };
      }
    }
  }

  return null;
}

function getInspectableStrings(element: Element): Array<{ text: string; attribute?: string }> {
  const strings: Array<{ text: string; attribute?: string }> = [];

  element.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
      strings.push({ text: node.textContent });
    }
  });

  for (const attribute of inspectableAttributes) {
    if (attribute === 'aria-label' && !element.matches(labelledControls)) {
      continue;
    }

    const value = element.getAttribute(attribute);

    if (value?.trim()) {
      strings.push({ text: value, attribute });
    }
  }

  return strings;
}
