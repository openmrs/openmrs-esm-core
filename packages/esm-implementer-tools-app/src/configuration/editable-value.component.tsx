import React, { useState, useEffect, useRef } from "react";
import isEqual from "lodash-es/isEqual";
import { Reset16 } from "@carbon/icons-react";
import {
  setTemporaryConfigValue,
  ConfigValue,
  Validator,
  Type,
  Config,
  unsetTemporaryConfigValue,
} from "@openmrs/esm-config";
import styles from "./editable-value.styles.css";
import { ValueEditor, CustomValueType } from "./value-editor";
import { getStore, ImplementerToolsStore } from "../store";
import { Button } from "carbon-components-react";
import { DisplayValue } from "./display-value";

export interface EditableValueProps {
  path: string[];
  element: ConfigValueDescriptor;
  customType?: CustomValueType;
}

export interface ConfigValueDescriptor {
  _value: ConfigValue;
  _source: string;
  _default?: ConfigValue;
  _description?: string;
  _elements?: Config | ConfigValueDescriptor;
  _validators?: Array<Validator>;
  _type?: Type;
}

export default function EditableValue({
  path,
  element,
  customType,
}: EditableValueProps) {
  const [valueString, setValueString] = useState<string>();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const activeConfigRef = useRef<HTMLButtonElement>(null);

  const closeEditor = () => {
    setEditing(false);
    setError(null);
  };

  const focusOnConfigPathBeingEdited = () => {
    if (activeConfigRef && activeConfigRef.current) {
      setEditing(true);
      activeConfigRef.current.focus();
    }
  };

  useEffect(() => {
    const update = (state: ImplementerToolsStore) => {
      if (isEqual(state.configPathBeingEdited, path)) {
        focusOnConfigPathBeingEdited();
      }
    };
    const store = getStore();
    update(store.getState());
    return store.subscribe(update);
  }, []);

  useEffect(() => {
    const store = getStore();
    const state = store.getState();
    if (editing && !isEqual(state.configPathBeingEdited, path)) {
      store.setState({
        configPathBeingEdited: path,
        activeItemDescription: {
          path: path,
          source: element._source,
          description: element._description,
          value: valueString,
        },
      });
    }
    if (!editing && isEqual(state.configPathBeingEdited, path)) {
      store.setState({ configPathBeingEdited: null });
    }
  }, [editing]);

  return (
    <>
      <div className={styles.line}>
        {editing ? (
          <>
            <ValueEditor
              element={element}
              customType={customType}
              path={path}
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
          </>
        ) : (
          <>
            <button
              className={`${styles.secretButton} ${
                element._source == "temporary config"
                  ? styles.overriddenValue
                  : ""
              }`}
              onClick={() => setEditing(true)}
              ref={activeConfigRef}
            >
              <DisplayValue value={element._value} />
            </button>
            {element._source == "temporary config" ? (
              <Button
                style={{ marginLeft: "1em" }}
                renderIcon={Reset16}
                size="small"
                kind="tertiary"
                iconDescription="Reset to default"
                hasIconOnly
                onClick={() => {
                  unsetTemporaryConfigValue(path);
                }}
              />
            ) : null}
          </>
        )}
        {error && <div className={styles.error}>{error}</div>}
      </div>
    </>
  );
}
