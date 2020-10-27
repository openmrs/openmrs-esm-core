import React, { useEffect, useState, useRef, useCallback } from "react";

interface ValueEditorProps {
  valueString: string;
  handleSave: (val: string) => void;
  handleClose: () => void;
}

export default function ValueEditor({
  valueString,
  handleSave,
  handleClose,
}: ValueEditorProps) {
  const ref = useRef(null);
  const [tmpValue, setTmpValue] = useState(valueString);

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
    <div ref={ref}>
      <input
        type="text"
        value={tmpValue}
        onChange={(e) => setTmpValue(e.target.value)}
      ></input>
      <button onClick={() => handleSave(tmpValue)}>Save</button>
    </div>
  );
}
