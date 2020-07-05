import React, { MouseEvent, AnchorHTMLAttributes } from "react";
import { navigate } from "./navigate";
import { interpolateUrl } from "./interpolate-string";

/**
 * A React link component which calls [[navigate]] when clicked
 *
 * @param to The target path or URL. Supports interpolation. See [[navigate]]
 * @param children Inline elements within the link
 * @param otherProps Any other valid props for an <a> tag except `href` and `onClick`
 * @category Navigation
 */
export function ConfigurableLink({
  to,
  children,
  ...otherProps
}: ConfigurableLinkProps) {
  return (
    <a
      onClick={event => handleClick(event, to)}
      href={interpolateUrl(to)}
      {...otherProps}
    >
      {children}
    </a>
  );
}

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

interface ConfigurableLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  children: any;
}
