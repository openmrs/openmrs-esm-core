import React from "react";
import EditableValue from "./editable-value.component";
import styles from "./configuration.styles.css";
import { getStore } from "../store";
import { isEqual } from "lodash-es";

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
    <div>
      {Object.entries(config).map(([key, value]) => {
        const thisPath = path.concat([key]);
        const isLeaf =
          value.hasOwnProperty("_value") || value.hasOwnProperty("_type");
        return (
          <div key={key}>
            <div
              className={styles.treeIndent}
              onMouseEnter={() =>
                setActiveItemDescriptionOnMouseEnter(thisPath, key, value)
              }
              onMouseLeave={() =>
                removeActiveItemDescriptionOnMouseLeave(thisPath)
              }
            >
              {key}:
              {isLeaf ? (
                <div className={styles.treeLeaf}>
                  <EditableValue path={thisPath} element={value} />
                </div>
              ) : null}
            </div>
            {!isLeaf ? (
              <div className={styles.treeIndent}>
                <ConfigSubtree config={value} path={thisPath} />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
