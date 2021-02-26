import React from "react";
import styles from "./horizontal-label-value.css";

export default function HorizontalLabelValue(props: HorizontalLabelValueProps) {
  return (
    <div className={styles.root}>
      <label
        className={props.labelClassName || "omrs-type-body-regular"}
        style={props.labelStyles}
      >
        {props.label}
        {props.specialKey && <sup>{"\u002A"}</sup>}
      </label>
      <div
        title={props.label}
        className={props.valueClassName || "omrs-type-body-regular"}
        style={props.valueStyles}
      >
        {props.value || "\u2014"}
      </div>
    </div>
  );
}

HorizontalLabelValue.defaultProps = {
  labelStyles: {},
  valueStyles: {},
  specialKey: false
};

type HorizontalLabelValueProps = {
  label: string;
  value: React.ReactNode;
  valueStyles?: React.CSSProperties;
  labelStyles?: React.CSSProperties;
  specialKey: boolean;
  labelClassName?: string;
  valueClassName?: string;
};
