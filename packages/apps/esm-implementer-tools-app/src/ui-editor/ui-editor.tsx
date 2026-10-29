import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { throttle } from 'lodash-es';
import { useTranslation } from 'react-i18next';
import { getExtensionRenderingsStore, useStore } from '@openmrs/esm-framework/src/internal';
import { implementerToolsStore } from '../store';
import { type Bounds } from './card-position';
import { getTargetChain, getTargetKey, type RenderingLookup, type UiEditorTarget } from './ui-editor-targets';
import { UiEditorCard } from './ui-editor-card';
import { ExitUiEditorButton } from './exit-ui-editor-button';
import styles from './styles.scss';

/** How often the pointer position is turned into a lookup. */
const inspectionIntervalMs = 50;
/** Smallest outline drawn for a target, so that an empty slot is still visible. */
const minimumHighlightSize = { width: 24, height: 12 };
/** Height of the name tag drawn above a highlighted target. */
const highlightLabelHeight = 22;
/** Space kept between the card and the edges of the area it may use. */
const boundsMargin = 8;

/** Marks the implementer tools' panel, whose top edge is the bottom of the area the card may use. */
const implementerToolsPanelAttribute = 'data-openmrs-implementer-tools-panel';

interface Selection {
  chain: Array<UiEditorTarget>;
  index: number;
  /** Where the card stays instead of being placed next to the target. */
  heldPosition?: { top: number; left: number };
}

const lookupRendering: RenderingLookup = (renderingId) =>
  getExtensionRenderingsStore().getState().renderings.get(renderingId);

/**
 * Lets the user hover any part of the application to see which extension renders it and which
 * slot that extension is in, and to open the config for either. Alt+click pins the description so
 * its buttons can be used; plain clicks still reach the application.
 */
export default function UiEditor() {
  const { isOpen: areImplementerToolsOpen } = useStore(implementerToolsStore);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [isPinned, setIsPinned] = useState(false);
  const [preview, setPreview] = useState<UiEditorTarget | null>(null);
  // Bumped when the page scrolls, resizes, or changes, so that the highlight and card follow their
  // target and the card stays out of the implementer tools' panel.
  const [, setLayoutVersion] = useState(0);
  const isPinnedRef = useRef(isPinned);
  isPinnedRef.current = isPinned;
  const editorRef = useRef<HTMLDivElement>(null);

  const selectAt = useCallback((element: Element | null) => {
    const chain = getTargetChain(element, lookupRendering);
    setSelection((current) => {
      if (!chain.length) {
        return null;
      }
      return current && getTargetKey(current.chain[current.index]) === getTargetKey(chain[0])
        ? current
        : { chain, index: 0 };
    });
  }, []);

  const inspectAt = useMemo(
    () =>
      throttle((clientX: number, clientY: number) => {
        const element = document.elementFromPoint(clientX, clientY);
        // Leave the selection alone over the tools' own UI, so that the card can be reached.
        if (isPinnedRef.current || !element || element.closest('[data-openmrs-implementer-tools]')) {
          return;
        }
        selectAt(element);
      }, inspectionIntervalMs),
    [selectAt],
  );

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => inspectAt(event.clientX, event.clientY);

    const handleClick = (event: MouseEvent) => {
      const element = event.target instanceof Element ? event.target : null;
      if (!event.altKey || !element) {
        return;
      }

      // Alt+click on the card pins or releases whatever it shows, which is the only way to pin a
      // target reached from inside the card, such as a slot picked from the breadcrumb.
      if (element.closest('[data-openmrs-ui-editor-card]')) {
        event.preventDefault();
        event.stopPropagation();
        setIsPinned((pinned) => !pinned);
        return;
      }

      if (element.closest('[data-openmrs-implementer-tools]')) {
        return;
      }

      // Alt+click would otherwise reach the application, and on macOS it downloads links.
      event.preventDefault();
      event.stopPropagation();

      if (isPinnedRef.current) {
        setIsPinned(false);
        selectAt(element);
      } else {
        const chain = getTargetChain(element, lookupRendering);
        if (chain.length) {
          setSelection({ chain, index: 0 });
          setIsPinned(true);
        }
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      // Escape inside the rest of the tools, such as to cancel editing a value, is theirs.
      const element = event.target instanceof Element ? event.target : null;
      if (element?.closest('[data-openmrs-implementer-tools]') && !element.closest('[data-openmrs-ui-editor-card]')) {
        return;
      }
      if (event.key === 'Escape' && isPinnedRef.current) {
        setIsPinned(false);
        setSelection(null);
        setPreview(null);
      }
    };

    let frame = 0;
    const handleLayoutChange = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setLayoutVersion((version) => version + 1));
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick, true);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleLayoutChange, { capture: true, passive: true });
    window.addEventListener('resize', handleLayoutChange);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleLayoutChange, { capture: true });
      window.removeEventListener('resize', handleLayoutChange);
      cancelAnimationFrame(frame);
      inspectAt.cancel();
    };
  }, [inspectAt, selectAt]);

  const target = selection?.chain[selection.index];
  // A target that has left the page, for example on navigation, can no longer be described.
  const isTargetConnected = target?.element.isConnected ?? false;
  const hasTarget = Boolean(target);

  // The rest of the page renders separately, so changes there, such as the target being removed or
  // the implementer tools' panel opening, would otherwise not re-render the editor.
  useEffect(() => {
    if (!hasTarget) {
      return;
    }

    let frame = 0;
    const observer = new MutationObserver((records) => {
      // The editor's own output changes as it renders; reacting to that would re-render it forever.
      if (records.every((record) => editorRef.current?.contains(record.target))) {
        return;
      }
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setLayoutVersion((version) => version + 1));
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [hasTarget]);

  // The target can also move or resize without any of that, for example when an image loading above
  // it pushes it down, which only measuring it shows.
  useEffect(() => {
    if (!target) {
      return;
    }

    let last = target.element.getBoundingClientRect();
    let frame = requestAnimationFrame(function measure() {
      const rect = target.element.getBoundingClientRect();
      if (
        rect.top !== last.top ||
        rect.left !== last.left ||
        rect.width !== last.width ||
        rect.height !== last.height
      ) {
        last = rect;
        setLayoutVersion((version) => version + 1);
      }
      frame = requestAnimationFrame(measure);
    });

    return () => cancelAnimationFrame(frame);
  }, [target]);

  useEffect(() => {
    if (target && !isTargetConnected) {
      setSelection(null);
      setIsPinned(false);
      setPreview(null);
    }
  }, [target, isTargetConnected]);

  // Moving the card from inside itself leaves pinning alone. An unpinned card stays where it is, so
  // that it is still under the pointer; a pinned one is placed next to its new target.
  const retarget = useCallback((chain: Array<UiEditorTarget>, index: number, cardRect: DOMRect) => {
    setSelection({
      chain,
      index,
      heldPosition: isPinnedRef.current ? undefined : { top: cardRect.top, left: cardRect.left },
    });
    setPreview(null);
  }, []);

  return (
    <div className={styles.editor} ref={editorRef}>
      {areImplementerToolsOpen ? null : <ExitUiEditorButton />}
      {preview?.element.isConnected ? <Highlight target={preview} isPreview /> : null}
      {selection && target && isTargetConnected ? (
        <>
          <Highlight target={target} />
          <UiEditorCard
            key={getTargetKey(target)}
            chain={selection.chain}
            index={selection.index}
            isPinned={isPinned}
            bounds={getCardBounds()}
            lookupRendering={lookupRendering}
            heldPosition={selection.heldPosition}
            onRetarget={retarget}
            onPreview={setPreview}
          />
        </>
      ) : null}
    </div>
  );
}

interface HighlightProps {
  target: UiEditorTarget;
  isPreview?: boolean;
}

function Highlight({ target, isPreview }: HighlightProps) {
  const { t } = useTranslation();
  const rect = target.element.getBoundingClientRect();
  const isEmpty = rect.width < minimumHighlightSize.width / 2 || rect.height < minimumHighlightSize.height / 2;
  const name = target.kind === 'slot' ? target.slotName : target.extensionId;

  return (
    <div
      className={classNames(styles.highlight, {
        [styles.slotHighlight]: target.kind === 'slot',
        [styles.extensionHighlight]: target.kind === 'extension',
        [styles.dashedHighlight]: isPreview || isEmpty,
      })}
      style={{
        top: rect.top,
        left: rect.left,
        width: Math.max(rect.width, minimumHighlightSize.width),
        height: Math.max(rect.height, minimumHighlightSize.height),
      }}
    >
      {/* Drawn inside the outline when there is no room above it. */}
      <span
        className={classNames(styles.highlightLabel, {
          [styles.highlightLabelInside]: rect.top < highlightLabelHeight,
        })}
      >
        {isEmpty ? t('emptySlotLabel', '{{name}} · empty', { name, interpolation: { escapeValue: false } }) : name}
      </span>
    </div>
  );
}

/**
 * The area the card may use: the viewport above the implementer tools' panel when it is open,
 * and above the exit button docked on the panel's edge.
 */
function getCardBounds(): Bounds {
  const panel = document.querySelector(`[${implementerToolsPanelAttribute}]`);
  const dockedExitButton = panel?.querySelector('[data-openmrs-ui-editor-exit="docked"]');
  const bottom = Math.min(
    window.innerHeight,
    panel?.getBoundingClientRect().top ?? Infinity,
    dockedExitButton?.getBoundingClientRect().top ?? Infinity,
  );

  return {
    top: boundsMargin,
    left: boundsMargin,
    right: window.innerWidth - boundsMargin,
    bottom: bottom - boundsMargin,
  };
}
