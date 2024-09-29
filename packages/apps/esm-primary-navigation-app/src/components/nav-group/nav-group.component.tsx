import React from 'react';
import { useTranslation } from 'react-i18next';
import { Accordion, AccordionItem } from '@carbon/react';
import { ExtensionSlot, useConfig, Type } from '@openmrs/esm-framework';

export const navGroupFeatureName = 'Nav Group';

export const navGroupConfigSchema = {
  title: {
    _type: Type.String,
    _description: 'The title of the nav group.',
    _default: 'My Group',
  },
  slotName: {
    _type: Type.String,
    _description: 'The name of the slot to create, which links can be added to.',
  },
  isExpanded: {
    _type: Type.Boolean,
    _description: 'The boolean to determine whether the nav group is expanded or not.',
    _default: false,
  },
};

export interface NavGroupConfig {
  title: string;
  slotName: string;
  isExpanded?: boolean;
}

interface NavGroupProps {
  basePath?: string;
}

export function NavGroup({ basePath }: NavGroupProps) {
  const { t } = useTranslation();
  const { title, isExpanded, slotName } = useConfig<NavGroupConfig>();

  return (
    <Accordion>
      <AccordionItem open={isExpanded} title={t(title)}>
        <ExtensionSlot name={slotName ?? `nav-group-${title}`} state={{ basePath }} />
      </AccordionItem>
    </Accordion>
  );
}
