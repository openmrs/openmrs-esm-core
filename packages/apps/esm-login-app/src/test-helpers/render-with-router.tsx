import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

export default function renderWithRouter<T = unknown>(
  Component: React.JSXElementConstructor<T>,
  props: T = {} as unknown as T,
  { route = '/', routes = [route], routeParams = {} } = {},
) {
  return {
    ...render(
      <MemoryRouter initialEntries={routes} initialIndex={(route && routes?.indexOf(route)) || undefined}>
        <Component {...props} />
      </MemoryRouter>,
    ),
  };
}
