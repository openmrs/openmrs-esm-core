import React from "react";
import { connect } from "unistore/react";
import EditableValue from "./editable-value.component";
import styles from "./configuration.styles.css";
import { isEqual } from "lodash-es";

export interface ConfigSubtreeProps {
  config: Record<string, any>;
  path?: Array<string>;
}

export const ConfigSubtree = connect()(({ config, path = [] }: ConfigSubtreeProps) {
  const store = getStore();

  function setActiveItemDescription(thisPath, key, value) {
    if (!store.getState().configPathBeingEdited) {
      store.setState({
        activeItemDescription: {
          path: thisPath,
          source: value._source,
          description: value._description,
          value: value._value,
        },
      });
    }
  }

  function removeActiveItemDescription(thisPath) {
    if (isEqual(store.getState().activeItemDescription?.path, thisPath)) {
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
                setActiveItemDescription(thisPath, key, value)
              }
              onMouseLeave={() => removeActiveItemDescription(thisPath)}
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
