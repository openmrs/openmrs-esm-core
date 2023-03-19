import React from "react";
import { ContentSwitcher } from "@carbon/react";
import styles from "./omrs-content-switcher.scss";

type OmrsContentSwitcher = {
  children: React.ReactNode;
  errored?: boolean;
  light?: boolean;
  onChange?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  selectedIndex?: number;
  size?: "sm" | "md" | "lg" | "xl";
};

export function OmrsContentSwitcher({
  children,
  errored = false,
  ...rest
}: OmrsContentSwitcher) {
  return (
    <ContentSwitcher className={errored && styles.errored} {...rest}>
      {children}
    </ContentSwitcher>
  );
}
