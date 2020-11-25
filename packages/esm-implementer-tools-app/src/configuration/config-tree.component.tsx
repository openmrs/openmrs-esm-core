import React from "react";
import { getGlobalStore } from "@openmrs/esm-api";
import { Provider } from "unistore/react";
import EditableValue from "./editable-value.component";
import { ExtensionsConfigTree } from "./extensions-config-tree";
import styles from "./configuration.styles.css";

export interface ConfigTreeProps {
  config: Record<string, any>;
  path?: Array<string>;
}

export default function ConfigTree({ config, path = [] }: ConfigTreeProps) {
  const store = React.useMemo(() => getGlobalStore("extensions"), []);

  return (
    <Provider store={store}>
      <div>
        {config &&
          Object.keys(config)
            .filter((key) => key !== "extensions")
            .map((key) => {
              const value = config[key];
              const thisPath = path.concat([key]);
              return (
                <div
                  key={key}
                  className={
                    path.length ? styles.treeIndent : styles.topLevelTree
                  }
                >
                  {!value.hasOwnProperty("_value") ? (
                    <div>
                      {key}:
                      {thisPath.length === 1 && (
                        <ExtensionsConfigTree
                          config={value.extensions}
                          moduleName={thisPath[0]}
                        />
                      )}
                      <ConfigTree config={value} path={thisPath} />
                    </div>
                  ) : (
                    <div className={styles.treeLeaf}>
                      {key}: <EditableValue path={thisPath} element={value} />
                    </div>
                  )}
                </div>
              );
            })}
      </div>
    </Provider>
  );
}
