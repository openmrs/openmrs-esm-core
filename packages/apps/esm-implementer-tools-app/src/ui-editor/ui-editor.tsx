import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { type TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Button } from '@carbon/react';
import {
  CloseIcon,
  type ExtensionInfo,
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
  extensionInstance: ExtensionInfo['instances'][number];
}

/**
 * Flattens `extensions[name].instances` into a flat list of overlay targets. `instances` is an
 * `Array<ExtensionInstance>`, so it must be iterated directly. Treating it as a nested object (via
 * `Object.entries`) yields array indices as the module name and instance property names as the slot
 * name, so the generated selectors never match a real extension DOM node.
 */
export function getExtensionOverlayTargets(
  extensions: Record<string, ExtensionInfo> | undefined,
): Array<ExtensionOverlayTarget> {
  return Object.entries(extensions ?? {}).flatMap(([extensionName, extensionInfo]) =>
    (extensionInfo.instances ?? []).map((extensionInstance) => ({
      extensionName,
      slotModuleName: extensionInstance.slotModuleName,
      slotName: extensionInstance.slotName,
      extensionInstance,
    })),
  );
}

export default function UiEditor() {
  const { t } = useTranslation();
  const { slots, extensions } = useStore(getExtensionInternalStore());
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
      getExtensionOverlayTargets(extensions).map((target) => ({
        ...target,
        element: document.querySelector(
          `*[data-extension-slot-name="${target.slotName}"][data-extension-slot-module-name="${target.slotModuleName}"] *[data-extension-id="${target.extensionInstance.id}"]`,
        ) as HTMLElement | null,
      })),
    [extensions],
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
        ({ extensionName, slotModuleName, slotName, extensionInstance, element }) =>
          element && (
            <ExtensionOverlay
              domElement={element}
              extensionName={extensionName}
              key={`${slotName}-${extensionInstance.id}`}
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
