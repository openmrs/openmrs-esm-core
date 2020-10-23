import React from "react";
import EditableValue from "./editable-value.component";

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
            <div key={key} style={{ margin: `0.25em 0em 0.25em 3em` }}>
              {isOrdinaryObject(value) ? (
                <div>
                  {key}: <ConfigTree config={value} path={thisPath} />
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
