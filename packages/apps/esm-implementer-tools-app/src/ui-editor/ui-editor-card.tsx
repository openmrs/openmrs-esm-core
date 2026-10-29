import React, { useId, useLayoutEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { Button } from '@carbon/react';
import { configInternalStore, useStore } from '@openmrs/esm-framework/src/internal';
import { type Bounds, type CardPosition, type CardSide, getCardPosition, getHeldCardPosition } from './card-position';
import {
  getEnclosingSlot,
  getExtensionSlots,
  getSlotExtensions,
  getTargetChain,
  type ExtensionTarget,
  type RenderingLookup,
  type SlotTarget,
  type UiEditorTarget,
} from './ui-editor-targets';
import {
  getExtensionConfigPath,
  getExtensionInstanceConfigPath,
  getSlotConfigPath,
  showInConfiguration,
} from './config-paths';
import styles from './styles.scss';

export interface UiEditorCardProps {
  chain: Array<UiEditorTarget>;
  index: number;
  isPinned: boolean;
  /** The area the card must stay inside, in viewport coordinates. */
  bounds: Bounds;
  lookupRendering: RenderingLookup;
  /**
   * Where to keep the card instead of placing it next to its target, so that a card moved to
   * another target from inside itself stays under the pointer.
   */
  heldPosition?: { top: number; left: number };
  /** Moves the card to another target, passing where the card is now. */
  onRetarget(chain: Array<UiEditorTarget>, index: number, cardRect: DOMRect): void;
  /** Outlines a target on the page without moving the card, or clears the outline. */
  onPreview(target: UiEditorTarget | null): void;
}

interface Action {
  id: string;
  label: string;
  description: React.ReactNode;
  path: Array<string>;
}

// Module names contain slashes, which i18next would otherwise escape to HTML entities.
const raw = { interpolation: { escapeValue: false } };

/**
 * Describes the slot or extension at `chain[index]` and offers to open its config. It is rendered
 * with a `key` for its target, so expanded sections and the side it was placed on reset when the
 * target changes.
 */
export function UiEditorCard({
  chain,
  index,
  isPinned,
  bounds,
  lookupRendering,
  heldPosition,
  onRetarget,
  onPreview,
}: UiEditorCardProps) {
  const { t } = useTranslation();
  const cardRef = useRef<HTMLDivElement>(null);
  const sideRef = useRef<CardSide | undefined>(undefined);
  const [openAction, setOpenAction] = useState<string | null>(null);
  const [isListOpen, setIsListOpen] = useState(false);
  const { schemas } = useStore(configInternalStore);
  const idPrefix = useId();

  const retarget = (nextChain: Array<UiEditorTarget>, nextIndex: number) => {
    if (cardRef.current) {
      onRetarget(nextChain, nextIndex, cardRef.current.getBoundingClientRect());
    }
  };

  const target = chain[index];
  const slot = target.kind === 'slot' ? target : getEnclosingSlot(chain, index);

  // Runs on every render: the target can move without anything in the card changing.
  useLayoutEffect(() => {
    const card = cardRef.current;
    if (!card) {
      return;
    }

    let position: Omit<CardPosition, 'side'>;
    if (heldPosition) {
      position = getHeldCardPosition(heldPosition, { width: card.offsetWidth }, bounds);
    } else {
      const placed = getCardPosition(
        target.element.getBoundingClientRect(),
        // The full content height, plus the card's borders.
        { width: card.offsetWidth, height: card.scrollHeight + card.offsetHeight - card.clientHeight },
        bounds,
        sideRef.current,
      );
      sideRef.current = placed.side;
      position = placed;
    }
    Object.assign(card.style, {
      top: `${position.top}px`,
      left: `${position.left}px`,
      maxHeight: `${position.maxHeight}px`,
    });
  });

  const actions: Array<Action> =
    target.kind === 'extension' && slot
      ? getExtensionActions(target, slot, Boolean(schemas?.[target.extensionName]))
      : slot
        ? [getSlotAction(slot)]
        : [];

  function getExtensionActions(extension: ExtensionTarget, enclosingSlot: SlotTarget, hasOwnSchema: boolean) {
    const moduleName = extension.moduleName ?? '';
    // Without a schema of its own or a known module, there is nowhere to point at its config.
    const canConfigureExtension = hasOwnSchema || Boolean(moduleName);
    const actions: Array<Action> = [
      {
        id: 'instance',
        label: t('configureExtensionInstance', 'Configure this extension instance'),
        description: t(
          'configureExtensionInstanceDescription',
          "Applies only where {{extensionId}} renders in {{slotName}}, on top of the extension's own config.",
          { extensionId: extension.extensionId, slotName: enclosingSlot.slotName, ...raw },
        ),
        path: getExtensionInstanceConfigPath(enclosingSlot.moduleName, enclosingSlot.slotName, extension.extensionId),
      },
      {
        id: 'extension',
        label: t('configureExtension', 'Configure this extension'),
        description: hasOwnSchema ? (
          t(
            'configureExtensionOwnSchema',
            'This extension defines its own config schema. Changes apply everywhere it renders.',
          )
        ) : (
          <>
            {t(
              'configureExtensionModuleSchema',
              "This extension has no config schema of its own, so it reads its module's config.",
            )}{' '}
            <span className={styles.warning}>
              {t('configureExtensionModuleWarning', 'Changes here apply to everything in {{moduleName}}.', {
                moduleName,
                ...raw,
              })}
            </span>
          </>
        ),
        path: getExtensionConfigPath(extension.extensionName, moduleName, hasOwnSchema),
      },
      getSlotAction(enclosingSlot),
    ];
    return canConfigureExtension ? actions : actions.filter((action) => action.id !== 'extension');
  }

  function getSlotAction(slotTarget: SlotTarget): Action {
    return {
      id: 'slot',
      label: t('configureSlot', 'Configure this slot'),
      description: t('configureSlotDescription', 'Add, remove, or reorder the extensions in this slot.'),
      path: getSlotConfigPath(slotTarget.moduleName, slotTarget.slotName),
    };
  }

  const listedElements = target.kind === 'slot' ? getSlotExtensions(target.element) : getExtensionSlots(target.element);
  const listedTargets = listedElements.map((element) => getTargetChain(element, lookupRendering));
  const listLabel =
    target.kind === 'slot'
      ? t('extensionCount', {
          count: listedElements.length,
          defaultValue_one: '{{count}} extension',
          defaultValue_other: '{{count}} extensions',
        })
      : t('slotCount', {
          count: listedElements.length,
          defaultValue_one: '{{count}} slot',
          defaultValue_other: '{{count}} slots',
        });

  const outer = chain.slice(index + 1).reverse();
  const listId = `${idPrefix}-list`;

  return (
    <div
      className={styles.card}
      ref={cardRef}
      onMouseLeave={() => onPreview(null)}
      role="dialog"
      data-openmrs-ui-editor-card
      aria-label={target.kind === 'slot' ? target.slotName : target.extensionId}
    >
      <header className={styles.cardHeader}>
        {outer.length ? (
          <nav
            className={styles.crumbs}
            aria-label={t('enclosingSlotsAndExtensions', 'Enclosing slots and extensions')}
          >
            {outer.map((item) => (
              <React.Fragment key={chain.indexOf(item)}>
                <button type="button" onClick={() => retarget(chain, chain.indexOf(item))}>
                  {item.kind === 'slot' ? item.slotName : item.extensionId}
                </button>
                <span aria-hidden="true">›</span>
              </React.Fragment>
            ))}
          </nav>
        ) : null}
        <p className={styles.title}>
          <span className={styles.identifier}>{target.kind === 'slot' ? target.slotName : target.extensionId}</span>
          <span className={styles.kind}>
            {target.kind === 'slot' ? t('slot', 'slot') : t('extension', 'extension')}
          </span>
        </p>
        <div className={styles.meta}>
          {target.moduleName ? (
            <p>{t('fromModule', 'From {{moduleName}}', { moduleName: target.moduleName, ...raw })}</p>
          ) : null}
          {target.kind === 'extension' && slot ? (
            <p>{t('slotFromModule', 'Slot from {{moduleName}}', { moduleName: slot.moduleName, ...raw })}</p>
          ) : null}
          {listedElements.length ? (
            <button
              type="button"
              className={styles.listToggle}
              aria-expanded={isListOpen}
              aria-controls={listId}
              onClick={() => {
                // Closing the list removes the item the outline was previewing.
                if (isListOpen) {
                  onPreview(null);
                }
                setIsListOpen(!isListOpen);
              }}
            >
              {listLabel}
              <span className={styles.chevron} aria-hidden="true">
                ▶
              </span>
            </button>
          ) : target.kind === 'slot' ? (
            <p>{listLabel}</p>
          ) : null}
          {isListOpen ? (
            <ul className={styles.list} id={listId}>
              {listedTargets.map((itemChain, itemIndex) => {
                const item = itemChain[0];
                if (!item) {
                  return null;
                }

                return (
                  <li key={itemIndex}>
                    <button
                      type="button"
                      onMouseEnter={() => onPreview(item)}
                      onMouseLeave={() => onPreview(null)}
                      onFocus={() => onPreview(item)}
                      onBlur={() => onPreview(null)}
                      onClick={() => retarget(itemChain, 0)}
                    >
                      {item.kind === 'slot' ? item.slotName : item.extensionId}
                      <small>
                        {item.kind === 'slot'
                          ? describeSlotContents(getSlotExtensions(item.element).length)
                          : item.moduleName}
                      </small>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </header>
      <div className={styles.actions}>
        {actions.map((action) => {
          const isOpen = openAction === action.id;
          const detailId = `${idPrefix}-${action.id}`;
          return (
            <div className={classNames(styles.action, { [styles.actionOpen]: isOpen })} key={action.id}>
              <button
                type="button"
                className={styles.actionToggle}
                aria-expanded={isOpen}
                aria-controls={detailId}
                onClick={() => setOpenAction(isOpen ? null : action.id)}
              >
                <span>{action.label}</span>
                <span className={styles.chevron} aria-hidden="true">
                  ▶
                </span>
              </button>
              {isOpen ? (
                <div className={styles.actionDetail} id={detailId}>
                  <p>{action.description}</p>
                  <p className={styles.path}>{action.path.join(' › ')}</p>
                  <Button kind="ghost" size="sm" onClick={() => showInConfiguration(action.path)}>
                    {t('openInConfiguration', 'Open in Configuration')}
                  </Button>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <p className={styles.hint}>
        {isPinned
          ? t('uiEditorPinnedHint', 'Pinned · Alt+click to unpin, Esc to close')
          : t('uiEditorHoverHint', 'Alt+click to pin')}
      </p>
    </div>
  );

  function describeSlotContents(count: number) {
    return count
      ? t('extensionCount', {
          count,
          defaultValue_one: '{{count}} extension',
          defaultValue_other: '{{count}} extensions',
        })
      : t('emptySlot', 'empty');
  }
}
