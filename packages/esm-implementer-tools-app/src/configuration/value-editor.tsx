import React, { useEffect, useState, useRef, useCallback } from "react";
import { ConfigValueDescriptor } from "./editable-value.component";
import { ConceptSearchBox } from "./concept-search";

interface ValueEditorProps {
  element: ConfigValueDescriptor;
  handleSave: (val: string) => void;
  handleClose: () => void;
}

export default function ValueEditor({
  element,
  handleSave,
  handleClose,
}: ValueEditorProps) {
  const ref = useRef(null);
  const [tmpValue, setTmpValue] = useState(JSON.stringify(element._value));

  const escapeListener = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClose();
    }
  }, []);
  const clickListener = useCallback(
    (e: MouseEvent) => {
      if (!(ref.current! as any).contains(e.target)) {
        handleClose?.(); // using optional chaining here, change to onClose && onClose(), if required
      }
    },
    [ref.current]
  );

  useEffect(() => {
    // Attach the listeners on component mount.
    document.addEventListener("click", clickListener);
    document.addEventListener("keyup", escapeListener);
    // Detach the listeners on component unmount.
    return () => {
      document.removeEventListener("click", clickListener);
      document.removeEventListener("keyup", escapeListener);
    };
  }, []);

  return (
    <div ref={ref} style={{ display: "inherit" }}>
      {isConcept(element) ? (
        <ConceptSearchBox
          setConcept={(concept) => {
            handleSave(JSON.stringify(concept.uuid));
          }}
        />
      ) : (
        <input
          type="text"
          value={tmpValue}
          onChange={(e) => setTmpValue(e.target.value)}
        ></input>
      )}
      <button onClick={() => handleSave(tmpValue)}>Save</button>
    </div>
  );
}

function isConcept(element) {
  return element._value.length == 36;
}
