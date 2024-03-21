import React, { type ReactElement } from 'react';
import { SWRConfig } from 'swr';
import { type RenderOptions, render } from '@testing-library/react';

export const swrWrapper = ({ children }) => {
  return (
    <SWRConfig
      value={{
        dedupingInterval: 0,
        provider: () => new Map(),
      }}
    >
      {children}
    </SWRConfig>
  );
};

export const renderWithSwr = (ui: ReactElement, options?: Omit<RenderOptions, 'queries'>) =>
  render(ui, { wrapper: swrWrapper, ...options });
