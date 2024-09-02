/** @module @category UI */
import React from 'react';
import { ExtensionSlot, useConfig } from '@openmrs/esm-react-utils';
import { Type } from '@openmrs/esm-config';
import { Accordion } from '@carbon/react';
import { AccordionItem } from '@carbon/react';
import { useTranslation } from 'react-i18next';

export const globalNavGroupFeatureName = 'Nav Group';

export const globalNavGroupConfigSchema = {
  title: {
    _type: Type.String,
    _description: 'The title of the nav group.',
    _default: 'myGroup',
  },
  slotName: {
    _type: Type.String,
    _description: 'The name of the slot to create, which links can be added to.',
    _default: 'nav-group-slot',
  },
  isExpanded: {
    _type: Type.Boolean,
    _description: 'The boolean to determine whether the nav group is expanded or not.',
    _default: true,
  },
};

interface NavGroupConfig {
  title: string;
  slotName: string;
  isExpanded?: boolean;
}

export interface NavGroupProps {
  basePath?: string;
}

export function GlobalNavGroup({ basePath }: NavGroupProps) {
  const { t } = useTranslation();
  const { title, slotName, isExpanded } = useConfig<NavGroupConfig>();
  // t('myGroup', 'My Group')
  const translatedTitle = t(title);

  return (
    <Accordion>
      <AccordionItem open={isExpanded} title={translatedTitle} style={{ border: 'none' }}>
        <ExtensionSlot name={slotName ?? title} state={{ basePath }} />
      </AccordionItem>
    </Accordion>
  );
}
