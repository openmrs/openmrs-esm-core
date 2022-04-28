import React from "react";
import styles from "./config-tree.styles.scss";
import { Accordion, AccordionItem } from "carbon-components-react";
import { ConfigTreeForModule } from "./config-tree-for-module.component";

export interface ConfigTreeProps {
  config: Record<string, any>;
}

export function ConfigTree({ config }: ConfigTreeProps) {
  return (
    <Accordion align="start" className={styles.configTab}>
      {config &&
        Object.keys(config)
          .sort()
          .map((moduleName) => {
            const moduleConfig = config[moduleName];
            return Object.keys(moduleConfig).length ? (
              <AccordionItem
                title={<h6 className={styles.configTitle}>{moduleName}</h6>}
                className={styles.fullWidthAccordion}
                key={`accordion-${moduleName}`}
              >
                <ConfigTreeForModule
                  config={moduleConfig}
                  moduleName={moduleName}
                  key={`${moduleName}-config`}
                />
              </AccordionItem>
            ) : null;
          })}
    </Accordion>
  );
}
