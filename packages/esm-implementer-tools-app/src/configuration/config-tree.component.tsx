import React from "react";
import { getGlobalStore } from "@openmrs/esm-api";
import { Provider } from "unistore/react";
import styles from "./configuration.styles.css";
import { ConfigTreeForModule } from "./config-tree-for-module.component";
import { Accordion, AccordionItem } from "carbon-components-react";

export interface ConfigTreeProps {
  config: Record<string, any>;
}

export function ConfigTree({ config }: ConfigTreeProps) {
  return (
    <div>
      <Accordion align="start">
        {config &&
          Object.keys(config)
            .sort()
            .map((moduleName) => {
              const moduleConfig = config[moduleName];
              return Object.keys(moduleConfig).length ? (
                <AccordionItem
                  open
                  title={<h4 className={styles.moduleName}>{moduleName}</h4>}
                  className={styles.fullWidthAccordion}
                >
                  <div key={`${moduleName}-config`}>
                    <ConfigTreeForModule
                      config={moduleConfig}
                      moduleName={moduleName}
                    />
                  </div>
                </AccordionItem>
              ) : null;
            })}
      </Accordion>
    </div>
  );
}
