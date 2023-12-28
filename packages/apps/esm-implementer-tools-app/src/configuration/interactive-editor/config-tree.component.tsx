import React from 'react';
import styles from './config-tree.styles.scss';
import { Accordion, AccordionItem } from '@carbon/react';
import { ConfigTreeForModule } from './config-tree-for-module.component';
import { implementerToolsStore } from "../../store";
import isEqual from "lodash-es/isEqual";

export interface ConfigTreeProps {
  config: Record<string, any>;
}

export function ConfigTree({ config }: ConfigTreeProps) {
  const shouldFocus = (moduleName) => {
    const state = implementerToolsStore.getState();
    return isEqual(state.activeItemDescription?.path[0], moduleName);
  };
  return (
    <Accordion align="start">
      {config &&
        Object.keys(config)
          .sort()
          .map((moduleName) => {
            const moduleConfig = config[moduleName];
            return Object.keys(moduleConfig).length ? (
              <AccordionItem
                focus={shouldFocus(moduleName)}
                title={<h6>{moduleName}</h6>}
                className={styles.fullWidthAccordion}
                key={`accordion-${moduleName}`}
              >
                <ConfigTreeForModule config={moduleConfig} moduleName={moduleName} key={`${moduleName}-config`} />
              </AccordionItem>
            ) : null;
          })}
    </Accordion>
  );
}
