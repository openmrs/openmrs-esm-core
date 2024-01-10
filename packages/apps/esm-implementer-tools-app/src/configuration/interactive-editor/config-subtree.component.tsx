import React from 'react';
import EditableValue from './editable-value.component';
import { implementerToolsStore } from '../../store';
import isEqual from 'lodash-es/isEqual';
import { Subtree } from './layout/subtree.component';

export interface ConfigSubtreeProps {
  config: Record<string, any>;
  path?: Array<string>;
}

export function ConfigSubtree({ config, path = [] }: ConfigSubtreeProps) {
  function setActiveItemDescriptionOnMouseEnter(thisPath, key, value) {
    if (!implementerToolsStore.getState().configPathBeingEdited) {
      implementerToolsStore.setState({
        activeItemDescription: {
          path: thisPath,
          source: value._source,
          description: value._description,
          value: JSON.stringify(value._value),
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
      {Object.entries(config).map(([key, value], i) => {
        const thisPath = path.concat([key]);
        const isLeaf = value.hasOwnProperty('_value') || value.hasOwnProperty('_type');
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
