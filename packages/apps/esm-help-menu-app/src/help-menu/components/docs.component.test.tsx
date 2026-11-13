/**
 * @vitest-environment happy-dom
 */
import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Docs from './docs.component';

describe('Docs', () => {
  it('renders a link to the documentation with target _blank', () => {
    render(<Docs />);

    const link = screen.getByRole('link', { name: /docs/i });
    expect(link).toBeDefined();
    expect(link.getAttribute('href')).toBe('https://om.rs/o3docs');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  });
});
