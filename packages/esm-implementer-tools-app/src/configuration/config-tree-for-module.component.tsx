import React from "react";
import { ExtensionSlotsConfigTree } from "./extension-slots-config-tree";
import { ConfigSubtree } from "./config-subtree.component";
import { pickBy } from "lodash-es";
import { TreeContainer } from "./layout/tree-container.component";

export interface ConfigTreeForModuleProps {
  config: Record<string, any>;
  moduleName: string;
}

export function ConfigTreeForModule({
  config,
  moduleName,
}: ConfigTreeForModuleProps) {
  return (
    <TreeContainer>
      <ExtensionSlotsConfigTree
        config={config.extensions}
        moduleName={moduleName}
      />
      <ConfigSubtree
        config={pickBy(config, (v, key) => key !== "extensions")}
        path={[moduleName]}
      />
    </TreeContainer>
  );
}
