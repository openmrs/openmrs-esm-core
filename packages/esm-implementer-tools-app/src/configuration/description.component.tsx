import React from "react";
import { connect } from "unistore/react";
import styles from "./description.styles.css";

export const Description = connect("activeItemDescription")(
  ({ activeItemDescription }) => {
    console.log(activeItemDescription);
    return (
      <div className={styles.container}>
        {activeItemDescription ? (
          <>
            <p className={styles.path}>
              {activeItemDescription.path.slice(1).join(" → ")}
            </p>
            <p className={styles.description}>
              {activeItemDescription.description}
            </p>
            <p className={styles.source}>
              {activeItemDescription.source ? <>Source:</> : null}{" "}
              {activeItemDescription.source}
            </p>
            <p className={styles.value}>{activeItemDescription.value}</p>
          </>
        ) : null}
      </div>
    );
  }
);
