import React from "react";
import { implementerToolsStore } from "../store";

interface ConfigEditButtonProps {
  configPath: string[];
}

export default function ConfigEditButton({
  configPath,
}: ConfigEditButtonProps) {
  return (
    <button
      onClick={() => {
        implementerToolsStore.setState({ configPathBeingEdited: configPath });
      }}
    >
      Edit
    </button>
  );
}
