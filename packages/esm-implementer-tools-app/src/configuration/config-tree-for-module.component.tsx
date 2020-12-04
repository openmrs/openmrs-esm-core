import React from "react";
import { ExtensionsConfigTree } from "./extensions-config-tree";
import { ConfigSubtree } from "./config-subtree.component";
import { pickBy } from "lodash-es";
import styles from "./configuration.styles.css";

export interface ConfigTreeForModuleProps {
  config: Record<string, any>;
  moduleName: string;
}

export function ConfigTreeForModule({
  config,
  moduleName,
}: ConfigTreeForModuleProps) {
  return (
    <div className={styles.topLevelConfig}>
      <ExtensionsConfigTree
        config={config.extensions}
        moduleName={moduleName}
      />
      <ConfigSubtree
        config={pickBy(config, (v, key) => key !== "extensions")}
        path={[moduleName]}
      />
    </div>
  );
}
