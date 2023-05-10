import React, { useState } from "react";
import DevToolsPopup from "./devtools-popup.component";
import styles from "./devtools.styles.css";
import { importMapOverridden } from "./import-map.component";

export default function Root(props) {
  return window.spaEnv === "development" ||
    Boolean(localStorage.getItem("openmrs:devtools")) ? (
    <DevTools {...props} />
  ) : null;
}

function DevTools() {
  const [devToolsOpen, setDevToolsOpen] = useState(false);
  const [isOverridden, setIsOverridden] = useState(importMapOverridden);
  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={toggleDevTools}
        className={`${styles.devtoolsTriggerButton} ${
          styles.overridden ? isOverridden : ""
        }`}
      />
      {devToolsOpen && (
        <DevToolsPopup
          close={toggleDevTools}
          toggleOverridden={toggleOverridden}
        />
      )}
    </>
  );

  function toggleDevTools() {
    setDevToolsOpen(!devToolsOpen);
  }

  function toggleOverridden(overridden) {
    setIsOverridden(overridden);
  }
}
