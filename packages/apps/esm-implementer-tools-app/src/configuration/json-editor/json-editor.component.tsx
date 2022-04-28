import React, { useCallback, useEffect, useState } from "react";
import {
  temporaryConfigStore,
  useStore,
} from "@openmrs/esm-framework/src/internal";
import Editor from "react-ace";
import style from "./json-editor.scss";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import { Button } from "carbon-components-react";
export interface JsonEditorProps {
  /** A CSS value */
  height: string;
}

export default function JsonEditor({ height }: JsonEditorProps) {
  const temporaryConfig = useStore(temporaryConfigStore);
  const [editorValue, setEditorValue] = useState("");
  const [error, setError] = useState("");
  const [key, setKey] = useState(`json-editor`);

  const updateTemporaryConfig = useCallback(() => {
    let config;
    try {
      config = JSON.parse(editorValue);
    } catch (e) {
      setError(e.message);
      return;
    }
    setError("");
    temporaryConfigStore.setState({ config });
  }, [editorValue, temporaryConfigStore]);

  useEffect(() => {
    if (editorValue != JSON.stringify(temporaryConfig.config, null, 2)) {
      setKey((k) => `${k}+`); // just keep appendingplus signs
    }
  }, [temporaryConfig.config]);

  return (
    <div>
      <Editor
        key={key}
        defaultValue={JSON.stringify(temporaryConfig.config, null, 2)}
        tabSize={2}
        fontSize="12pt"
        width="100vw"
        className={style.jsonEditorBackground}
        height={`calc(${height} - 3rem)`}
        onChange={(v) => {
          setEditorValue(v);
        }}
      />
      <div className={style.toolbar}>
        <Button type="submit" onClick={updateTemporaryConfig}>
          Update
        </Button>
        <div
          className={style.alert}
          style={{
            backgroundColor: error ? "#b81921" : "inherit",
            paddingRight: 10,
          }}
        >
          {error}
        </div>
      </div>
    </div>
  );
}
