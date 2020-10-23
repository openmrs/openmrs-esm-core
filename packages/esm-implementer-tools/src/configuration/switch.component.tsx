import React, { useState } from "react";
import styles from "./switch.styles.css";
import _uniqueId from "lodash/uniqueId";

const Switch = (props) => {
  const [id] = useState(_uniqueId("switch-"));
  return (
    <>
      <input
        className={styles.switchCheckbox}
        id={id}
        type="checkbox"
        checked={props.checked}
        onChange={props.onChange}
      />
      <label className={styles.switchLabel} htmlFor={id}>
        <span className={styles.switchButton} />
      </label>
    </>
  );
};

export default Switch;
