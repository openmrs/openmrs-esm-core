import React from 'react';
import { I18nProvider, type I18nProviderProps } from 'react-aria';

/**
 * Thin wrapper around React Aria's I18nProvider to work around a JSX return type mismatch
 * between the library's types and our TSX configuration.
 */
export function I18nWrapper(props: I18nProviderProps): JSX.Element {
  return React.createElement(I18nProvider as (props: I18nProviderProps) => JSX.Element, props);
}
