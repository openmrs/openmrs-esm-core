import React from "react";
import { useGlobalState } from "../global-state";

interface ConfigEditButtonProps {
  configPath: string[];
}

export default function ConfigEditButton({
  configPath,
}: ConfigEditButtonProps) {
  const [configPathBeingEdited, setConfigPathBeingEdited] = useGlobalState(
    "configPathBeingEdited"
  );
  return (
    <button
      onClick={() => {
        setConfigPathBeingEdited(configPath);
      }}
    >
      Edit
    </button>
  );
}
