/** @module @category Translation */
import _i18n from 'i18next';

const i18n: typeof _i18n = (_i18n as unknown as { default: typeof _i18n }).default || _i18n;

/**
 * Extension-scoped namespaces are composites of the module name, the slot the extension is rendered
 * in, and the extension's id, joined by this separator. `openmrsComponentDecorator` builds them as
 * the default namespace it gives an extension.
 */
export const extensionNamespaceSeparator = '___';

/**
 * A record of one string having been rendered from a translation key, as observed while the
 * inspector was recording.
 */
export interface TranslationSighting {
  /** The namespace the key belongs to, which for O3 is the name of the owning frontend module. */
  namespace: string;
  /**
   * Set when the string was rendered inside an extension, in which case this is the
   * extension-scoped namespace it was rendered through. Overriding this namespace rather than
   * `namespace` confines the override to that one extension in that one slot.
   */
  extensionNamespace?: string;
  /**
   * The key the string was resolved from, as it is written in the namespace's translation file. For a
   * plural or context lookup this is the suffixed form, such as `visit_one`.
   */
  key: string;
  /** The rendered string, i.e. the key's value after interpolation. */
  value: string;
  /**
   * Whether i18next resolved the lookup as a plural, in which case other counts render through other
   * forms of the key (`key_one`, `key_other`, ...).
   */
  hasCount: boolean;
}

/** Rendered strings to the keys that produced them. */
const sightings = new Map<string, Array<TranslationSighting>>();

/** Caps the number of distinct strings indexed, so a long recording session cannot grow unbounded. */
const maxSightings = 20_000;

let isRecording = false;

/**
 * Starts recording which translation keys produce which strings, so that `matchTranslations` can map
 * text found in the DOM back to the key an implementer would override. The app shell's i18next
 * post-processor is what feeds the recording; it reports nothing until this is called.
 *
 * Enabling re-renders the application, because the index is otherwise empty for everything that was
 * already on screen when the inspector was switched on.
 */
export function enableTranslationInspector() {
  isRecording = true;

  // Mounted components only re-read their translations on `languageChanged`; react-i18next leaves
  // the resource store's own events unbound.
  i18n.emit('languageChanged', i18n.language);
}

/** Stops recording and discards the index. */
export function disableTranslationInspector() {
  isRecording = false;
  sightings.clear();
}

/**
 * Whether translations are being recorded. The app shell's post-processor checks this on every
 * translation, so it is deliberately nothing more than reading a flag.
 */
export function isTranslationInspectorRecording(): boolean {
  return isRecording;
}

/**
 * Adds a rendered translation to the index. Recording while the inspector is off is ignored, so a
 * sighting cannot survive into a later session as a stale result.
 */
export function recordTranslationSighting(sighting: TranslationSighting) {
  if (!isRecording) {
    return;
  }

  const existing = sightings.get(sighting.value);

  if (!existing) {
    // Evicting the least recently rendered string keeps the index tracking what is on screen now;
    // silently refusing new entries would make the inspector look broken rather than full.
    if (sightings.size >= maxSightings) {
      sightings.delete(sightings.keys().next().value as string);
    }

    sightings.set(sighting.value, [{ ...sighting }]);

    return;
  }

  const known = existing.find(
    (candidate) =>
      candidate.key === sighting.key &&
      candidate.namespace === sighting.namespace &&
      candidate.extensionNamespace === sighting.extensionNamespace,
  );

  if (known) {
    // A key rendered both with and without a count is still a plural.
    known.hasCount ||= sighting.hasCount;
  } else {
    existing.push({ ...sighting });
  }

  // Moved to the back of the map's insertion order, which eviction treats as most recently rendered.
  sightings.delete(sighting.value);
  sightings.set(sighting.value, existing);
}

/**
 * Finds the translations that rendered exactly this text, or this text trimmed. This is a map lookup,
 * so it is the one to use when searching over many candidate strings.
 *
 * More than one result means several keys render identically; the caller has to disambiguate, for
 * instance by the module that owns the surrounding DOM.
 */
export function matchTranslations(text: string): Array<TranslationSighting> {
  if (!text || !isRecording) {
    return [];
  }

  return (sightings.get(text) ?? sightings.get(text.trim()) ?? []).map((sighting) => ({ ...sighting }));
}
