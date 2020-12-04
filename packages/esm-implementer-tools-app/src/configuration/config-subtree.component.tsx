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
              onMouseEnter={() => {
                store.setState({ configPathBeingHovered: thisPath });
              }}
              onMouseLeave={() => {
                isEqual(store.getState().configPathBeingHovered, thisPath) &&
                  store.setState({ configPathBeingHovered: [] });
              }}
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
