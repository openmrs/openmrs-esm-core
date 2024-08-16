/** @module @category UI */
import React from 'react';
import { ExtensionSlot, useConfig } from '@openmrs/esm-react-utils';
import { Type } from '@openmrs/esm-config';
import { Accordion } from '@carbon/react';
import { AccordionItem } from '@carbon/react';

export const navGroupConfigSchema = {
  title: {
    _type: Type.String,
    _description: 'The title of the nav group.',
    _default: 'My Group',
  },
  slotName: {
    _type: Type.String,
    _description: 'The name of the slot to create, which links can be added to.',
    _default: 'my-group-nav-slot',
  },
  isExpanded: {
    _type: Type.Boolean,
    _description: 'The boolean to determine whether the nav group is expanded or not.',
    _default: true,
  },
};

export interface NavGroupConfig {
  title: string;
  slotName: string;
  isExpanded?: boolean;
}

interface NavGroupProps {
  basePath: string;
}

export function NavGroup({ basePath }: NavGroupProps) {
  const { title, slotName, isExpanded } = useConfig<NavGroupConfig>();
  return (
    <Accordion>
      <AccordionItem open={isExpanded} title={title} style={{ border: 'none' }}>
        <ExtensionSlot name={slotName ?? title} state={{ basePath }} />
      </AccordionItem>
    </Accordion>
  );
}
