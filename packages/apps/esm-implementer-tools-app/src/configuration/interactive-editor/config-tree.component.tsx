import React from 'react';
import { Accordion, AccordionItem } from '@carbon/react';
import { ConfigTreeForModule } from './config-tree-for-module.component';
import { implementerToolsStore } from '../../store';
import { useStore } from 'zustand';
import styles from './config-tree.styles.scss';

export interface ConfigTreeProps {
  config: Record<string, any>;
}

export function ConfigTree({ config }: ConfigTreeProps) {
  const { uiSelectedPath } = useStore(implementerToolsStore);
  const focusedModule = uiSelectedPath?.[0];

  return (
    <Accordion align="start">
      {config &&
        Object.keys(config)
          .sort()
          .map((moduleName) => {
            const moduleConfig = config[moduleName];
            return Object.keys(moduleConfig).length ? (
              <AccordionItem
                title={<h6>{moduleName}</h6>}
                className={styles.fullWidthAccordion}
                key={`accordion-${moduleName}`}
                open={focusedModule == moduleName ? true : undefined}
              >
                <ConfigTreeForModule config={moduleConfig} moduleName={moduleName} key={`${moduleName}-config`} />
              </AccordionItem>
            ) : null;
          })}
    </Accordion>
  );
}
