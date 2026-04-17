import React from 'react';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import GlobalImplementerToolsButton from './global-implementer-tools.component';

describe('Testing the global implementer tools button', () => {
  it('should render global Implementer tools', () => {
    render(<GlobalImplementerToolsButton />);
    const button = screen.getByTestId('globalImplementerToolsButton');
    expect(button).toBeInTheDocument();
  });
});
