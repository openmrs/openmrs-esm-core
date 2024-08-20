/** @module @category UI */
import React from 'react';
import { ExtensionSlot, useConfig } from '@openmrs/esm-react-utils';
import { Type } from '@openmrs/esm-config';
import { Accordion } from '@carbon/react';
import { AccordionItem } from '@carbon/react';
import { useTranslation } from 'react-i18next';

export const navGroupFeatureName = 'Nav Group';

export const navGroupConfigSchema = {
  title: {
    _type: Type.Object,
    _description: 'The title of the nav group.',
    _default: {
      key: 'myGroupKey',
      value: 'My Group',
    },
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

interface NavGroupConfig {
  title: { key: string; value: string };
  slotName: string;
  isExpanded?: boolean;
}

export interface NavGroupProps {
  basePath: string;
}

export function NavGroup({ basePath }: NavGroupProps) {
  const { t } = useTranslation();
  const { title, slotName, isExpanded } = useConfig<NavGroupConfig>();
  const translatedTitle = t(title.key, title.value);
  return (
    <Accordion>
      <AccordionItem open={isExpanded} title={translatedTitle} style={{ border: 'none' }}>
        <ExtensionSlot name={slotName ?? translatedTitle} state={{ basePath }} />
      </AccordionItem>
    </Accordion>
  );
}
