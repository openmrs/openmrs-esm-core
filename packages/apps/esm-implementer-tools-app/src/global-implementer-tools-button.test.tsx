import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import GlobalImplementerToolsButton from './global-implementer-tools.component';

describe('Testing the global implementer tools button', () => {
  afterEach(cleanup);
  it('should render global Implementer tools', () => {
    render(<GlobalImplementerToolsButton />);
    const button = screen.getByTestId('globalImplementerToolsButton');
    expect(button).toBeInTheDocument();
  });
});
