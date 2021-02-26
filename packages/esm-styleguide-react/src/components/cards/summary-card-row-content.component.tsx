import React from "react";

export default function SummaryCardRowContent(
  props: SummaryCardRowContentProps
) {
  const styles: Styles = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: props.justifyContent,
    width: "100%",
    paddingRight: "1rem",
    flexWrap: "wrap"
  };

  return <div style={styles}>{props.children}</div>;
}

SummaryCardRowContent.defaultProps = {
  justifyContent: "flex-start"
};

type SummaryCardRowContentProps = {
  children: React.ReactNode;
  justifyContent?: string;
};

type Styles = {};
