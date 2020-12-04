import React from "react";
import { getStore } from "../store";

interface ConfigEditButtonProps {
  configPath: string[];
}

export default function ConfigEditButton({
  configPath,
}: ConfigEditButtonProps) {
  const store = getStore();
  return (
    <button
      onClick={() => {
        store.setState({ configPathBeingEdited: configPath });
      }}
    >
      Edit
    </button>
  );
}
