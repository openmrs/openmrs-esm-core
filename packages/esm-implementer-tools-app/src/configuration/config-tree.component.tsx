import React from "react";
import { getGlobalStore } from "@openmrs/esm-api";
import { Provider } from "unistore/react";
import styles from "./configuration.styles.css";
import { ConfigTreeForModule } from "./config-tree-for-module.component";

export interface ConfigTreeProps {
  config: Record<string, any>;
}

export function ConfigTree({ config }: ConfigTreeProps) {
  return (
    <div>
      {config &&
        Object.keys(config)
          .sort()
          .map((moduleName) => {
            const moduleConfig = config[moduleName];
            return Object.keys(moduleConfig).length ? (
              <div key={`${moduleName}-config`} className={styles.moduleConfig}>
                <h4 className={styles.moduleName}>{moduleName}</h4>
                <ConfigTreeForModule
                  config={moduleConfig}
                  moduleName={moduleName}
                />
              </div>
            ) : null;
          })}
    </div>
  );
}
