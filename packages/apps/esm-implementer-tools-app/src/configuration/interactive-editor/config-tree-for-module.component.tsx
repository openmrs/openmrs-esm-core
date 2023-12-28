import React from 'react';
import { ExtensionSlotsConfigTree } from './extension-slots-config-tree';
import { ConfigSubtree } from './config-subtree.component';
import pickBy from 'lodash-es/pickBy';
import { TreeContainer } from './layout/tree-container.component';

export interface ConfigTreeForModuleProps {
  config: Record<string, any>;
  moduleName: string;
}

export function ConfigTreeForModule({ config, moduleName }: ConfigTreeForModuleProps) {
  return (
    <TreeContainer>
      <ExtensionSlotsConfigTree extensionsConfig={config.extensionSlots} moduleName={moduleName} />
      <ConfigSubtree config={pickBy(config, (v, key) => key !== 'extensionSlots')} path={[moduleName]} />
    </TreeContainer>
  );
}
