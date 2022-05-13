import React from "react";
import ImportMap from "./import-map.component";
import styles from "./devtools-popup.styles.css";

export default function DevToolsPopup(props: DevToolsPopupProps) {
  return (
    <div className={styles.popup}>
      <ImportMap toggleOverridden={props.toggleOverridden} />
      <div className={styles.farRight}>
        <button onClick={props.close} className={styles.closeButton}>
          {"\u24e7"}
        </button>
      </div>
    </div>
  );
}

type DevToolsPopupProps = {
  close(): void;
  toggleOverridden(isOverridden: boolean): void;
};
