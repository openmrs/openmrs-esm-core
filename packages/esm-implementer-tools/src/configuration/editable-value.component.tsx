import React, { useState, useEffect, useRef } from "react";
import { isEqual } from "lodash";
import { setTemporaryConfigValue, ConfigValue } from "@openmrs/esm-config";
import styles from "./editable-value.styles.css";
import ValueEditor from "./value-editor";
import { useGlobalState } from "../global-state";
import { ConceptSearchBox } from "./concept-search";

export interface EditableValueProps {
  path: string[];
  element: ConfigValueDescriptor;
}

export interface ConfigValueDescriptor {
  _value: ConfigValue;
  _source: string;
  _default: ConfigValue;
  _description?: string;
  _validators?: Array<Function>;
}

export default function EditableValue({ path, element }: EditableValueProps) {
  const [valueString, setValueString] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [configPathBeingEdited, setConfigPathBeingEdited] = useGlobalState(
    "configPathBeingEdited"
  );
  const activeConfigPath = useRef<HTMLButtonElement>(null);

  const closeEditor = () => {
    setEditing(false);
    setError(null);
  };

  const focusOnConfigPathBeingEdited = () => {
    if (activeConfigPath && activeConfigPath.current) {
      setEditing(true);
      activeConfigPath.current.focus();
    }
  };

  useEffect(() => {
    if (isEqual(configPathBeingEdited, path)) {
      focusOnConfigPathBeingEdited();
    }
  }, [configPathBeingEdited]);

  return (
    <>
      <div style={{ display: "flex" }}>
        {editing ? (
          <ValueEditor
            element={element}
            handleClose={closeEditor}
            handleSave={(val) => {
              try {
                const result = JSON.parse(val);
                setTemporaryConfigValue(path, result);
                setValueString(val);
                closeEditor();
              } catch (e) {
                console.warn(e);
                setError("That's not formatted quite right. Try again.");
              }
            }}
          />
        ) : (
          <button
            className={`${styles.secretButton} ${
              element._source == "temporary config"
                ? styles.overriddenValue
                : ""
            }`}
            onClick={() => setEditing(true)}
            ref={activeConfigPath}
          >
            {valueString ?? JSON.stringify(element._value)}
          </button>
        )}
        {error && <div className={styles.error}>{error}</div>}
      </div>
    </>
  );
}
