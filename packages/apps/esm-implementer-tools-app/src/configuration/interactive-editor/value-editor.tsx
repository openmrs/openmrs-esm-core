import React, { useEffect, useState, useRef } from "react";
import Close16 from "@carbon/icons-react/es/close/16";
import Save16 from "@carbon/icons-react/es/save/16";
import { Button } from "carbon-components-react";
import { Type } from "@openmrs/esm-framework";
import { ConfigValueDescriptor } from "./editable-value.component";
import { ValueEditorField } from "./value-editors/value-editor-field";
import styles from "./value-editor.scss";
import { useTranslation } from "react-i18next";

export type CustomValueType = "add" | "remove" | "order" | "configure";

export type ValueType = CustomValueType | Type;

interface ValueEditorProps {
  element: ConfigValueDescriptor;
  customType?: CustomValueType;
  path: Array<string>;
  handleSave: (val: string) => void;
  handleClose: () => void;
}

export function ValueEditor({
  element,
  customType,
  path,
  handleSave,
  handleClose,
}: ValueEditorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [tmpValue, setTmpValue] = useState(element._value);
  const { t } = useTranslation();

  const valueType = customType ?? element._type;

  const keyListener = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClose();
    } else if (e.key === "Enter") {
      handleSave(JSON.stringify(tmpValue));
    }
  };

  useEffect(() => {
    document.addEventListener("keyup", keyListener);
    return () => {
      document.removeEventListener("keyup", keyListener);
    };
  }, [tmpValue]);

  return (
    <div ref={ref} style={{ display: "inherit" }}>
      <ValueEditorField
        element={element}
        path={path}
        value={tmpValue}
        onChange={setTmpValue}
        valueType={valueType}
      />
      <div className={styles.valueEditorButtons}>
        <Button
          renderIcon={Save16}
          kind="primary"
          onClick={() => handleSave(JSON.stringify(tmpValue))}
        >
          {t("saveValueButtonText", "Save")}
        </Button>
        <Button renderIcon={Close16} kind="secondary" onClick={handleClose}>
          {t("CancelButtonText", "Cancel")}
        </Button>
      </div>
    </div>
  );
}
