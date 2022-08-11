import React, { useCallback, useEffect, useState } from "react";
import {
  temporaryConfigStore,
  useStore,
} from "@openmrs/esm-framework/src/internal";
import { Button } from "@carbon/react";
import AceEditor from "react-ace";
import style from "./json-editor.scss";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";

export interface JsonEditorProps {
  /** A CSS value */
  height: string;
}

export default function JsonEditor({ height }: JsonEditorProps) {
  const temporaryConfig = useStore(temporaryConfigStore);
  const [editorValue, setEditorValue] = useState("");
  const [error, setError] = useState("");
  const [key, setKey] = useState(`ace-editor`);

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
      <AceEditor
        key={key}
        mode="json"
        theme="github"
        defaultValue={JSON.stringify(temporaryConfig.config, null, 2)}
        tabSize={2}
        fontSize="12pt"
        width="100vw"
        height={`calc(${height} - 3rem)`}
        onChange={(v) => {
          setEditorValue(v);
        }}
      />
      <div className={style.toolbar}>
        <Button size="md" type="submit" onClick={updateTemporaryConfig}>
          Update
        </Button>
        <div
          className={style.alert}
          style={{ backgroundColor: error ? "#d03030" : "inherit" }}
        >
          {error}
        </div>
      </div>
    </div>
  );
}
