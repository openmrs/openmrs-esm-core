import React, { useEffect, useState, useRef } from "react";
import { Type } from "@openmrs/esm-config";
import { ConfigValueDescriptor } from "./editable-value.component";
import { ConceptSearchBox } from "./concept-search";
import styles from "./configuration.styles.css";
import { ExtensionSlotAdd } from "./extension-slot-add";

export type CustomValueType = "add" | "remove" | "order" | "configure";

interface ValueEditorProps {
  element: ConfigValueDescriptor;
  customType?: CustomValueType;
  handleSave: (val: string) => void;
  handleClose: () => void;
}

export function ValueEditor({
  element,
  customType,
  handleSave,
  handleClose,
}: ValueEditorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [tmpValue, setTmpValue] = useState(() =>
    JSON.stringify(element._value)
  );

  const valueType = customType ?? element._type;

  const keyListener = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClose();
    } else if (e.key === "Enter") {
      handleSave(tmpValue);
    }
  };

  const clickListener = (e: MouseEvent) => {
    if (!ref.current?.contains(e.target as Node)) {
      handleClose?.(); // using optional chaining here, change to onClose && onClose(), if required
    }
  };

  useEffect(() => {
    // Attach the listeners on component mount.
    document.addEventListener("click", clickListener);
    document.addEventListener("keyup", keyListener);
    // Detach the listeners on component unmount.
    return () => {
      document.removeEventListener("click", clickListener);
      document.removeEventListener("keyup", keyListener);
    };
  }, [tmpValue]);

  return (
    <div ref={ref} style={{ display: "inherit" }}>
      {valueType === Type.ConceptUuid ? (
        <ConceptSearchBox
          setConcept={(concept) => {
            handleSave(JSON.stringify(concept.uuid));
          }}
        />
      ) : valueType === "add" ? (
        <ExtensionSlotAdd
          value={tmpValue ?? element._value}
          setValue={(value) => {
            setTmpValue(JSON.stringify(value));
          }}
        />
      ) : (
        <input
          type="text"
          value={tmpValue}
          onChange={(e) => setTmpValue(e.target.value)}
          className={styles.valueEditorInput}
        ></input>
      )}
      <button onClick={() => handleSave(tmpValue)}>Save</button>
    </div>
  );
}
