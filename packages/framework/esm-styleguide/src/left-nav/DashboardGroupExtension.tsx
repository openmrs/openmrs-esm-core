/** @module @category UI */
import React, { useEffect } from 'react';
import { ExtensionSlot } from '@openmrs/esm-react-utils';
import { Accordion, AccordionItem } from '@carbon/react';
import { registerNavGroup } from './nav-group';

export interface DashboardGroupExtensionProps {
  title: string;
  slotName?: string;
  basePath: string;
  isExpanded?: boolean;
}

export const DashboardGroupExtension = ({ title, slotName, basePath, isExpanded }: DashboardGroupExtensionProps) => {
  useEffect(() => {
    registerNavGroup(slotName ?? title);
  }, [slotName]);

  return (
    <Accordion>
      <AccordionItem open={isExpanded ?? true} title={title} style={{ border: 'none' }}>
        <ExtensionSlot name={slotName ?? title} state={{ basePath }} />
      </AccordionItem>
    </Accordion>
  );
};
