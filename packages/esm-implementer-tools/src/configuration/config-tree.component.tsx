import React from "react";
import EditableValue from "./editable-value.component";
import { ExtensionSlotConfigTree } from "./extension-slot-config-tree";
import styles from "./configuration.styles.css";

interface ConfigTreeProps {
  config: { [key: string]: any };
  path?: string[];
}

export default function ConfigTree({ config, path = [] }: ConfigTreeProps) {
  return (
    <div>
      {config &&
        Object.entries(config).map(([key, value]) => {
          const thisPath = path.concat([key]);
          return (
            <div key={key} className={styles.treeIndent}>
              {isOrdinaryObject(value) ? (
                <div>
                  {key}:
                  <ConfigTree config={value} path={thisPath} />
                  {thisPath.length === 1 && (
                    <ExtensionSlotConfigTree moduleName={thisPath[0]} />
                  )}
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexFlow: "row wrap",
                    alignItems: "center",
                  }}
                >
                  {key}: <EditableValue path={thisPath} value={value} />
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
