import React from "react";
import EditableValue, {
  ConfigValueDescriptor,
} from "./editable-value.component";
import { ExtensionsConfigTree } from "./extensions-config-tree";
import styles from "./configuration.styles.css";

interface ConfigTreeProps {
  config: { [key: string]: any };
  path?: string[];
}

export default function ConfigTree({ config, path = [] }: ConfigTreeProps) {
  return (
    <div>
      {config &&
        Object.entries(config)
          .filter(([k, v]) => k != "extensions")
          .map(([key, value]) => {
            const thisPath = path.concat([key]);
            return (
              <div key={key} className={styles.treeIndent}>
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
  );
}

function isOrdinaryObject(value: any): boolean {
  return typeof value === "object" && !Array.isArray(value);
}
