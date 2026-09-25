/**
 * @vitest-environment happy-dom
 */
import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExtensionSlot } from '@openmrs/esm-framework';
import HelpMenuPopup from './help-popup.component';

describe('HelpMenuPopup', () => {
  it('renders menu container with role="menu" and extension slot', () => {
    render(<HelpMenuPopup />);

    const menu = screen.getByRole('menu', { name: /help menu/i });
    expect(menu).toBeDefined();
    expect(menu.getAttribute('tabIndex')).toBe('-1');
    expect(ExtensionSlot).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'help-menu-slot' }),
      expect.anything(),
    );
  });
});

