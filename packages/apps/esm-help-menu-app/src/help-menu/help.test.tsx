import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { type AssignedExtension, type Session, useAssignedExtensions, useSession } from '@openmrs/esm-framework';
import HelpMenu from './help.component';

const mockUseAssignedExtensions = vi.mocked(useAssignedExtensions);
const mockUseSession = vi.mocked(useSession);

describe('HelpMenu', () => {
  beforeEach(() => {
    mockUseSession.mockReturnValue({ authenticated: true, user: { uuid: 'user-uuid' } } as Session);
    mockUseAssignedExtensions.mockReturnValue([{ id: 'docs' }] as unknown as Array<AssignedExtension>);
  });

  it('renders a labelled button that shows and hides the help menu', async () => {
    const user = userEvent.setup();
    render(<HelpMenu />);

    const button = screen.getByRole('button', { name: /help menu/i });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-controls', 'help-menu-popup');
    expect(screen.queryByRole('group', { name: /help menu/i })).not.toBeInTheDocument();

    await user.click(button);

    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('group', { name: /help menu/i })).toBeInTheDocument();

    await user.click(button);

    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('group', { name: /help menu/i })).not.toBeInTheDocument();
  });

  it('closes the help menu on Escape and returns focus to the button', async () => {
    const user = userEvent.setup();
    render(<HelpMenu />);

    const button = screen.getByRole('button', { name: /help menu/i });
    await user.click(button);
    await user.keyboard('{Escape}');

    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('group', { name: /help menu/i })).not.toBeInTheDocument();

    await user.click(button);
    screen.getByRole('group', { name: /help menu/i }).focus();
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('group', { name: /help menu/i })).not.toBeInTheDocument();
    expect(button).toHaveFocus();
  });

  it('renders nothing when no help menu items are registered', () => {
    mockUseAssignedExtensions.mockReturnValue([]);
    const { container } = render(<HelpMenu />);

    expect(container).toBeEmptyDOMElement();
  });
});
