import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { type TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Button } from '@carbon/react';
import {
  CloseIcon,
  type ExtensionRendering,
  type ExtensionRenderingsStore,
  getExtensionRenderingsStore,
  getExtensionInternalStore,
  useStore,
  useStoreWithActions,
} from '@openmrs/esm-framework/src/internal';
import { ExtensionOverlay } from './extension-overlay.component';
import { Portal } from './portal';
import { type ImplementerToolsStore, implementerToolsStore } from '../store';
import styles from './styles.scss';

interface ExitButtonProps {
  t: TFunction;
}

interface SlotOverlayProps {
  extensionCount: number;
  moduleName: string;
  slotName: string;
  t: TFunction;
  colorScheme: 'blue' | 'green';
}

export interface ExtensionOverlayTarget {
  extensionName: string;
  slotModuleName: string;
  slotName: string;
  extensionRendering: ExtensionRendering;
}

/**
 * Turns the rendering store's records into overlay targets, each naming a slot and extension to look
 * for in the DOM. A rendering is registered before its bundle loads, so the node may not exist yet.
 */
export function getExtensionOverlayTargets(
  renderings: ExtensionRenderingsStore['renderings'] | undefined,
): Array<ExtensionOverlayTarget> {
  return Array.from(renderings?.values() ?? [], (extensionRendering) => ({
    extensionName: extensionRendering.extensionName,
    slotModuleName: extensionRendering.slotModuleName,
    slotName: extensionRendering.slotName,
    extensionRendering,
  }));
}

export default function UiEditor() {
  const { t } = useTranslation();
  const { slots, extensions } = useStore(getExtensionInternalStore());
  // Depended on as a whole below: the rendering map is mutated in place, so only the state
  // object around it changes identity when an extension mounts or unmounts.
  const renderingsState = useStore(getExtensionRenderingsStore());
  const { isOpen: areImplementerToolsOpen } = useStore(implementerToolsStore);

  const getExtensionCount = (slotName: string, moduleName: string) => {
    if (!extensions || !moduleName) return 0;

    let count = 0;

    const slot = slots?.[slotName];

    if (slot && Array.isArray(slot.attachedIds)) {
      return slot.attachedIds.length;
    }

    return count;
  };

  const slotElements = useMemo(() => {
    if (!slots) {
      return [];
    }

    return Object.entries(slots)
      .map(([slotName, slotInfo]) => {
        if (!slotName) {
          return null;
        }

        return {
          slotName,
          slotInfo,
          element: document.querySelector(
            `*[data-extension-slot-name="${slotName}"][data-extension-slot-module-name="${slotInfo.moduleName}"]`,
          ) as HTMLElement | null,
        };
      })
      .filter((x): x is NonNullable<typeof x> => Boolean(x));
  }, [slots]);

  const extensionElements = useMemo(
    () =>
      getExtensionOverlayTargets(renderingsState.renderings).map((target) => ({
        ...target,
        element: document.querySelector(
          `*[data-extension-slot-name="${target.slotName}"][data-extension-slot-module-name="${target.slotModuleName}"] *[data-extension-id="${target.extensionRendering.id}"]`,
        ) as HTMLElement | null,
      })),
    [renderingsState],
  );

  return (
    <>
      <ExitButton t={t} />
      {slotElements.map(
        ({ slotName, slotInfo, element }, index) =>
          element && (
            <Portal key={`slot-overlay-${slotInfo.moduleName}-${slotName}`} el={element}>
              <SlotOverlay
                extensionCount={getExtensionCount(slotName, slotInfo.moduleName ?? '')}
                moduleName={slotInfo.moduleName ?? ''}
                slotName={slotName}
                t={t}
                colorScheme={index % 2 === 0 ? 'blue' : 'green'}
              />
            </Portal>
          ),
      )}
      {extensionElements.map(
        ({ extensionName, slotModuleName, slotName, extensionRendering, element }) =>
          element && (
            <ExtensionOverlay
              domElement={element}
              extensionName={extensionName}
              key={`${slotName}-${extensionRendering.id}`}
              slotModuleName={slotModuleName}
              slotName={slotName}
            />
          ),
      )}
    </>
  );
}

export function SlotOverlay({ slotName, moduleName, extensionCount = 0, colorScheme }: SlotOverlayProps) {
  const { slots } = useStore(getExtensionInternalStore());
  const [isHovering, setIsHovering] = useState(false);

  const overlayClass = classNames(styles.slotOverlay, {
    [styles.blueScheme]: colorScheme === 'blue',
    [styles.greenScheme]: colorScheme === 'green',
    [styles.slotOverlayHover]: isHovering,
  });

  const buttonClass = classNames(styles.slotName, {
    [styles.blueScheme]: colorScheme === 'blue',
    [styles.greenScheme]: colorScheme === 'green',
  });

  const getTooltipContent = () => {
    let content = `Slot: ${slotName}\nModule: ${moduleName}`;

    if (extensionCount > 0) {
      const slot = slots?.[slotName];
      if (slot?.attachedIds?.length) {
        content += `\nExtensions (${extensionCount}):\n- ${slot.attachedIds.join('\n- ')}`;
      }
    }

    return content;
  };

  const setActiveExtensionSlot = (moduleName: string, slotName: string) => {
    if (!implementerToolsStore.getState().configPathBeingEdited) {
      implementerToolsStore.setState({
        uiSelectedPath: [moduleName, 'extensionSlots', slotName],
        isOpen: true,
      });
    }
  };

  return (
    <>
      <div className={overlayClass}></div>
      <button
        className={buttonClass}
        onClick={(event) => {
          event.preventDefault();
          if (moduleName && slotName) {
            setActiveExtensionSlot(moduleName, slotName);
          }
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        title={getTooltipContent()}
      >
        {slotName}
      </button>
    </>
  );
}

export function ExitButton({ t }: ExitButtonProps) {
  const { toggleIsUIEditorEnabled } = useStoreWithActions(implementerToolsStore, actions);
  return (
    <Button
      className={styles.exitButton}
      hasIconOnly
      iconDescription={t('exitUIEditor', 'Exit UI Editor')}
      kind="danger"
      onClick={toggleIsUIEditorEnabled}
      renderIcon={(props) => <CloseIcon {...props} size={16} />}
      size="sm"
      tooltipPosition="left"
    />
  );
}

const actions = {
  toggleIsUIEditorEnabled({ isUIEditorEnabled }: ImplementerToolsStore) {
    return { isUIEditorEnabled: !isUIEditorEnabled };
  },
};
