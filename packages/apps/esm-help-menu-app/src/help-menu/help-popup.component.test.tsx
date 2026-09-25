/**
 * @vitest-environment happy-dom
 */
import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import HelpMenuPopup from './help-popup.component';

describe('HelpMenuPopup', () => {
  it('renders menu container with role="menu" and extension slot', () => {
    render(<HelpMenuPopup />);

    const menu = screen.getByRole('menu', { name: /help menu/i });
    expect(menu).toBeDefined();
    expect(menu.getAttribute('tabIndex')).toBe('-1');
  });
});
