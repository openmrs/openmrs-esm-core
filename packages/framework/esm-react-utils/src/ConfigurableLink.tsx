import React, { MouseEvent, AnchorHTMLAttributes } from "react";
import { navigate, interpolateUrl } from "@openmrs/esm-config";

function handleClick(event: MouseEvent, to: string) {
  if (
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    event.button == 0
  ) {
    event.preventDefault();
    navigate({ to });
  }
}

export interface ConfigurableLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
}

/**
 * A React link component which calls [[navigate]] when clicked
 *
 * @param to The target path or URL. Supports interpolation. See [[navigate]]
 * @param children Inline elements within the link
 * @param otherProps Any other valid props for an <a> tag except `href` and `onClick`
 * @category Navigation
 */
export const ConfigurableLink: React.FC<ConfigurableLinkProps> = ({
  to,
  children,
  ...otherProps
}) => (
  <a
    onClick={(event) => handleClick(event, to)}
    href={interpolateUrl(to)}
    {...otherProps}
  >
    {children}
  </a>
);
