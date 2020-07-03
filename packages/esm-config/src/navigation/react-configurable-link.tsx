import React, { FunctionComponent, MouseEvent } from "react";
import { navigate, interpolateUrl } from "./navigate";

const ConfigurableLink: FunctionComponent<ConfigurableLinkProps> = ({
  to,
  children,
  ...otherProps
}) => (
  <a
    onClick={event => handleClick(event, to)}
    href={interpolateUrl(to)}
    {...otherProps}
  >
    {children}
  </a>
);

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

type ConfigurableLinkProps = {
  to: string;
  className?: string;
};

export default ConfigurableLink;
