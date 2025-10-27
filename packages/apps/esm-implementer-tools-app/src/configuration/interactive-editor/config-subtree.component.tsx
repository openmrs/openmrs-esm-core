import React from 'react';
import { isEqual } from 'lodash-es';
import { implementerToolsStore } from '../../store';
import { Subtree } from './layout/subtree.component';
import EditableValue from './editable-value.component';

export interface ConfigSubtreeProps {
  config: Record<string, any>;
  path?: Array<string>;
}

export function ConfigSubtree({ config, path = [] }: ConfigSubtreeProps) {
  function setActiveItemDescriptionOnMouseEnter(thisPath: Array<string>, value: any) {
    if (!implementerToolsStore.getState().configPathBeingEdited) {
      const isLeaf = value && typeof value === 'object' && Object.hasOwn(value, '_value');
      implementerToolsStore.setState({
        activeItemDescription: {
          path: thisPath,
          source: isLeaf ? value._source : undefined,
          description: isLeaf ? value._description : undefined,
          value: isLeaf ? JSON.stringify(value._value) : undefined,
        },
      });
    }
  }

  function removeActiveItemDescriptionOnMouseLeave(thisPath: Array<string>) {
    const state = implementerToolsStore.getState();
    if (isEqual(state.activeItemDescription?.path, thisPath) && !isEqual(state.configPathBeingEdited, thisPath)) {
      implementerToolsStore.setState({ activeItemDescription: undefined });
    }
  }

  return (
    <>
      {Object.entries(config)
        .filter(([key]) => !key.startsWith('_'))
        .map(([key, value]) => {
          const thisPath = path.concat([key]);
          const isLeaf = value && typeof value === 'object' && Object.hasOwn(value, '_value');
          return (
            <Subtree
              label={key}
              leaf={isLeaf}
              onMouseEnter={() => setActiveItemDescriptionOnMouseEnter(thisPath, value)}
              onMouseLeave={() => removeActiveItemDescriptionOnMouseLeave(thisPath)}
              key={`subtree-${thisPath.join('.')}`}
            >
              {isLeaf ? (
                <EditableValue path={thisPath} element={value} />
              ) : (
                <ConfigSubtree config={value} path={thisPath} />
              )}
            </Subtree>
          );
        })}
    </>
  );
}
