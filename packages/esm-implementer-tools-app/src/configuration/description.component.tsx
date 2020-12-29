import React from "react";
import { connect } from "unistore/react";
import styles from "./description.styles.css";

export const Description = connect("activeItemDescription")(
  ({ activeItemDescription }) => {
    return (
      <div>
        {activeItemDescription ? (
          <>
            <p className={styles.path}>
              {activeItemDescription.path.slice(1).join(" → ")}
            </p>
            <p className={styles.description}>
              {activeItemDescription.description}
            </p>
            <p className={styles.source}>
              {activeItemDescription.source === "default" ? (
                <>The current value is the default.</>
              ) : activeItemDescription.source ? (
                <>
                  The current value comes from {activeItemDescription.source}.
                </>
              ) : null}
            </p>
            {activeItemDescription.value ? <p>Value:</p> : null}
            <p className={styles.value}>
              {Array.isArray(activeItemDescription.value)
                ? activeItemDescription.value.map((v) => <p key={v}>{v}</p>)
                : activeItemDescription.value}
            </p>
          </>
        ) : null}
      </div>
    );
  }
);
