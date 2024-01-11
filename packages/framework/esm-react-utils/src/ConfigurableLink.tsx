/** @module @category Navigation */
import React, { type MouseEvent, type AnchorHTMLAttributes, type PropsWithChildren, useEffect } from 'react';
import type { TemplateParams } from '@openmrs/esm-navigation';
import { navigate, interpolateUrl } from '@openmrs/esm-navigation';

function handleClick(
  event: MouseEvent,
  to: string,
  templateParams?: TemplateParams,
  onBeforeNavigate?: (event: MouseEvent) => void,
) {
  if (!event.metaKey && !event.ctrlKey && !event.shiftKey && event.button == 0) {
    event.preventDefault();
    onBeforeNavigate?.(event);
    navigate({ to, templateParams });
  }
}

/**
 * @noInheritDoc
 */
export interface ConfigurableLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  templateParams?: TemplateParams;
  onBeforeNavigate?: (event: MouseEvent) => void;
}

/**
 * A React link component which calls [[navigate]] when clicked
 *
 * @param to The target path or URL. Supports interpolation. See [[navigate]]
 * @param templateParams: A dictionary of values to interpolate into the URL, in addition to the default keys `openmrsBase` and `openmrsSpaBase`.
 * @param onBeforeNavigate A callback to be called just before navigation occurs
 * @param children Inline elements within the link
 * @param otherProps Any other valid props for an <a> tag except `href` and `onClick`
 */
export function ConfigurableLink({
  to,
  templateParams,
  onBeforeNavigate,
  children,
  ...otherProps
}: PropsWithChildren<ConfigurableLinkProps>) {
  useEffect(() => {
    if (otherProps.href) {
      console.warn(
        `ConfigurableLink does not support the href prop. Use the 'to' prop instead. The provided href value is '${otherProps.href}'`,
      );
    }
    if (otherProps.onClick) {
      console.warn(
        `ConfigurableLink does not support the onClick prop. Use the 'onBeforeNavigate' prop instead. The 'to' prop of the offending link is ${to}`,
      );
    }
  }, []);
  return (
    <a
      onClick={(event) => handleClick(event, to, templateParams, onBeforeNavigate)}
      href={interpolateUrl(to, templateParams)}
      {...otherProps}
    >
      {children}
    </a>
  );
}
