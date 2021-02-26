import React from "react";
import styles from "./vertical-label-value.css";

export default function VerticalLabelValue(props: VerticalLabelValueProps) {
  return (
    <div className={styles.root}>
      <label className={`omrs-type-body-small ${styles.label}`}>
        {props.label}
      </label>
      <div
        className={props.className}
        style={props.valueStyles}
        title={props.label}
      >
        {/* em-dash is shown if no value is passed in */}
        {props.value || "\u2014"}
      </div>
    </div>
  );
}

VerticalLabelValue.defaultProps = {
  valueStyles: {},
  className: ""
};

type VerticalLabelValueProps = {
  label: string;
  value: React.ReactNode;
  valueStyles?: React.CSSProperties;
  className: string;
};
