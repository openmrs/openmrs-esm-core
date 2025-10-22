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
  function setActiveItemDescriptionOnMouseEnter(thisPath, key, value) {
    if (!implementerToolsStore.getState().configPathBeingEdited) {
      const isLeaf = Object.hasOwn(value, '_value');
      implementerToolsStore.setState({
        activeItemDescription: {
          path: thisPath,
          source: value._source,
          description: value._description,
          value: isLeaf ? JSON.stringify(value._value) : undefined,
        },
      });
    }
  }

  function removeActiveItemDescriptionOnMouseLeave(thisPath) {
    const state = implementerToolsStore.getState();
    if (isEqual(state.activeItemDescription?.path, thisPath) && !isEqual(state.configPathBeingEdited, thisPath)) {
      implementerToolsStore.setState({ activeItemDescription: undefined });
    }
  }

  return (
    <>
      {Object.entries(config)
        .filter(([key]) => !key.startsWith('_'))
        .map(([key, value], i) => {
          const thisPath = path.concat([key]);
          const isLeaf = Object.hasOwn(value, '_value');
          return (
            <Subtree
              label={key}
              leaf={isLeaf}
              onMouseEnter={() => setActiveItemDescriptionOnMouseEnter(thisPath, key, value)}
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
