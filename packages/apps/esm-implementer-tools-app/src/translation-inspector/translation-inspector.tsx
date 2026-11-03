import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { throttle } from 'lodash-es';
import { Button } from '@carbon/react';
import {
  disableTranslationInspector,
  enableTranslationInspector,
  type TranslationSighting,
} from '@openmrs/esm-framework/src/internal';
import { implementerToolsStore } from '../store';
import { findTranslatedText, type InspectionTarget } from './find-translated-text';
import styles from './translation-inspector.styles.scss';

/** How often the pointer position is turned into a lookup. */
const inspectionIntervalMs = 100;

/**
 * Lets the user hover any text in the application and see which translation key produced it.
 *
 * Recording only runs while this component is mounted, and mounting it is gated on the user turning
 * the inspector on in the implementer tools.
 */
export default function TranslationInspector() {
  const { t } = useTranslation();
  const [target, setTarget] = useState<InspectionTarget | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    enableTranslationInspector();
    return () => disableTranslationInspector();
  }, []);

  const inspectAt = useMemo(
    () =>
      throttle((clientX: number, clientY: number) => {
        const element = document.elementFromPoint(clientX, clientY);

        // Leave the target alone while the pointer is over the inspector's own card, so that the
        // card can be read and its buttons used without it retargeting from under the pointer.
        if (!element || cardRef.current?.contains(element)) {
          return;
        }

        setTarget(findTranslatedText(element));
      }, inspectionIntervalMs),
    [],
  );

  useEffect(() => {
    let pointer: { x: number; y: number } | null = null;
    const handleMouseMove = (event: MouseEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      inspectAt(pointer.x, pointer.y);
    };
    // Scrolling moves content under a still pointer. Captured so that nested containers count too.
    const handleScroll = () => pointer && inspectAt(pointer.x, pointer.y);

    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { capture: true, passive: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll, { capture: true });
      inspectAt.cancel();
    };
  }, [inspectAt]);

  // Read on render rather than stored alongside the target: the next inspection is what would
  // invalidate it, and that produces a render anyway.
  const rect = target?.element.getBoundingClientRect();

  const showInTranslationsTab = useCallback((sighting: TranslationSighting) => {
    implementerToolsStore.setState((state) => ({
      ...state,
      isOpen: true,
      openTab: 'translations',
      selectedTranslation: { namespace: sighting.namespace, key: sighting.key },
    }));
  }, []);

  if (!target || !rect) {
    return null;
  }

  return (
    <>
      <div
        className={styles.highlight}
        style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height }}
      />
      {/* Moving the pointer onto the card stops it retargeting, so its buttons stay reachable. */}
      <div className={styles.card} ref={cardRef} style={getCardPosition(rect)}>
        {target.sightings.map((sighting) => (
          <div className={styles.sighting} key={`${sighting.extensionNamespace ?? sighting.namespace}|${sighting.key}`}>
            <p className={styles.key}>{sighting.key}</p>
            <p className={styles.namespace}>{sighting.namespace}</p>
            {sighting.extensionNamespace ? (
              <p className={styles.note}>
                {t('renderedInExtension', 'Rendered through {{namespace}}', {
                  namespace: sighting.extensionNamespace,
                  // Namespaces are module names, so they contain slashes, which i18next would
                  // otherwise escape to HTML entities that React renders as literal text.
                  interpolation: { escapeValue: false },
                })}
              </p>
            ) : null}
            {sighting.hasCount ? (
              <p className={styles.note}>
                {t('pluralKeyNote', 'This is one plural form; other counts render through other forms of the key.')}
              </p>
            ) : null}
            {target.attribute ? (
              <p className={styles.note}>
                {t('renderedInAttribute', 'Rendered as the {{attribute}} attribute', {
                  attribute: target.attribute,
                  interpolation: { escapeValue: false },
                })}
              </p>
            ) : null}
            <Button kind="ghost" onClick={() => showInTranslationsTab(sighting)} size="sm">
              {t('showInTranslations', 'Show in Translations')}
            </Button>
          </div>
        ))}
        {target.sightings.length > 1 ? (
          <p className={styles.note}>
            {t('multipleKeysNote', 'Several keys render this same text; all of them are listed.')}
          </p>
        ) : null}
      </div>
    </>
  );
}

/** The card's maximum height, from its styles, plus a margin. */
const cardHeight = 220;
const cardWidth = 320;

/**
 * Places the card just below the inspected element, or above it when there is no room below. An
 * element too tall for either, such as a full-height sidebar, gets the card over its top instead.
 *
 * The card touches the element: any gap between them is background the pointer has to cross on its
 * way to the card, which would retarget and close it.
 */
export function getCardPosition(rect: DOMRect): React.CSSProperties {
  const left = Math.max(0, Math.min(rect.left, window.innerWidth - cardWidth));

  if (window.innerHeight - rect.bottom > cardHeight) {
    return { top: rect.bottom, left };
  }

  if (rect.top > cardHeight) {
    return { bottom: window.innerHeight - rect.top, left };
  }

  return { top: Math.max(rect.top, 0) + 4, left };
}
