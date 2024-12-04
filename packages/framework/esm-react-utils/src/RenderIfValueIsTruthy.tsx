import React, { type PropsWithChildren } from 'react';

/**
 * A really simple component that renders its children if the prop named `value` has a truthy value
 *
 * @example
 * ```tsx
 * <RenderIfValueIsTruthy value={variable}>
 *  <Component value={variable} />
 * </RenderIfValueIsTruthy>
 * ````
 *
 * @param props.value The value to check whether or not its truthy
 * @param props.fallback What to render if the value is not truthy. If not specified, nothing will be rendered
 * @param props.children The components to render if the `value` is truthy
 */
export const RenderIfValueIsTruthy: React.FC<PropsWithChildren<{ value: unknown; fallback?: React.ReactNode }>> = ({
  children,
  value,
  fallback,
}) => {
  if (Boolean(value)) {
    return <>{children}</>;
  }
  return fallback ? <>{fallback}</> : null;
};
