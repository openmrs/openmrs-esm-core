import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useTranslation } from 'react-i18next';
import { IconButton } from '@carbon/react';
import { Draggable } from '@carbon/react/icons';
import { useAssignedExtensions } from '@openmrs/esm-framework';
import styles from './extension-slot-order.scss';

interface ExtensionSlotOrderProps {
  slotName: string;
  slotModuleName: string;
  value: string[];
  setValue: (value: string[]) => void;
}

interface DraggableExtensionProps {
  extension: { id: string; label: string };
  index: number;
  extensionCount: number;
}

const DraggableExtension: React.FC<DraggableExtensionProps> = ({ extension, index, extensionCount }) => {
  const { t } = useTranslation();
  const defaultEnterDelayInMs = 300;

  const { attributes, listeners, setNodeRef, active, isDragging, over } = useSortable({
    id: extension.id,
    data: { type: 'extension' },
    disabled: extensionCount <= 1,
  });

  return (
    <div
      ref={setNodeRef}
      className={classNames(styles.extension, {
        [styles.dragContainer]: true,
        [styles.dragContainerWhenDragging]: isDragging,
        [styles.dropZone]: over?.id === extension.id,
        [styles.droppable]: active?.id === extension.id,
      })}
    >
      <div>
        <div className={styles.iconAndName}>
          <div {...attributes} {...listeners}>
            <IconButton
              className={styles.dragIcon}
              enterDelayMs={over ? 6000 : defaultEnterDelayInMs}
              label={t('dragToReorder', 'Drag to reorder')}
              kind="ghost"
              size="md"
            >
              <Draggable />
            </IconButton>
          </div>
          <p>{extension.label}</p>
        </div>
      </div>
    </div>
  );
};

export function ExtensionSlotOrder({ slotName, slotModuleName, value, setValue }: ExtensionSlotOrderProps) {
  const { t } = useTranslation();
  const assignedExtensions = useAssignedExtensions(slotName);
  const [orderedExtensions, setOrderedExtensions] = useState<string[]>(
    value && value.length > 0 ? value : assignedExtensions.map((e) => e.id),
  );

  const sensors = useSensors(useSensor(PointerSensor));

  const extensionItems = orderedExtensions.map((extensionId) => {
    const extension = assignedExtensions.find((e) => e.id === extensionId);
    return {
      id: extensionId,
      label: extension?.id || extensionId,
    };
  });

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      if (active.id !== over?.id) {
        const oldIndex = orderedExtensions.indexOf(active.id);
        const newIndex = orderedExtensions.indexOf(over.id);
        const newOrder = arrayMove(orderedExtensions, oldIndex, newIndex);
        setOrderedExtensions(newOrder);
        setValue(newOrder);
      }
    },
    [orderedExtensions, setValue],
  );

  if (!assignedExtensions || assignedExtensions.length === 0) {
    return <p>{t('noExtensionsToOrderText', 'No extensions found in this slot.')}</p>;
  }

  return (
    <div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={extensionItems.map((item) => item.id)} strategy={verticalListSortingStrategy}>
          <div className={styles.extensionsList}>
            {extensionItems.map((extension, index) => (
              <DraggableExtension
                key={extension.id}
                extension={extension}
                index={index}
                extensionCount={extensionItems.length}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
