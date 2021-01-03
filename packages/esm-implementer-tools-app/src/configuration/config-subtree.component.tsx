import React from "react";
import EditableValue from "./editable-value.component";
import { getStore } from "../store";
import isEqual from "lodash-es/isEqual";
import { Subtree } from "./layout/subtree.component";

export interface ConfigSubtreeProps {
  config: Record<string, any>;
  path?: Array<string>;
}

export function ConfigSubtree({ config, path = [] }: ConfigSubtreeProps) {
  const store = getStore();

  function setActiveItemDescriptionOnMouseEnter(thisPath, key, value) {
    if (!store.getState().configPathBeingEdited) {
      store.setState({
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
    const state = store.getState();
    if (
      isEqual(state.activeItemDescription?.path, thisPath) &&
      !isEqual(state.configPathBeingEdited, thisPath)
    ) {
      store.setState({ activeItemDescription: undefined });
    }
  }

  return (
    <>
      {Object.entries(config).map(([key, value], i) => {
        const thisPath = path.concat([key]);
        const isLeaf =
          value.hasOwnProperty("_value") || value.hasOwnProperty("_type");
        return (
          <Subtree
            label={key}
            leaf={isLeaf}
            onMouseEnter={() =>
              setActiveItemDescriptionOnMouseEnter(thisPath, key, value)
            }
            onMouseLeave={() =>
              removeActiveItemDescriptionOnMouseLeave(thisPath)
            }
            key={`subtree-${thisPath.join(".")}`}
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
