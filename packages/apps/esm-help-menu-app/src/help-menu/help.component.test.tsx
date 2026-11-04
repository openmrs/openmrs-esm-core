/**
 * @vitest-environment happy-dom
 */
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { useAssignedExtensions, useSession } from '@openmrs/esm-framework';
import HelpMenu from './help.component';

const mockUseAssignedExtensions = vi.mocked(useAssignedExtensions);
const mockUseSession = vi.mocked(useSession);

describe('HelpMenu', () => {
  beforeEach(() => {
    mockUseAssignedExtensions.mockReturnValue([
      { name: 'contact-us-extension', slot: 'help-menu-slot' } as any,
    ]);
    mockUseSession.mockReturnValue({
      user: { display: 'admin', uuid: 'user-uuid' },
      authenticated: true,
    } as any);
  });

  it('renders nothing when there are no assigned extensions for help-menu-slot', () => {
    mockUseAssignedExtensions.mockReturnValue([]);

    const { container } = render(<HelpMenu />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when user is not logged in', () => {
    mockUseSession.mockReturnValue({
      user: null,
      authenticated: false,
    } as any);

    render(<HelpMenu />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('renders the help menu button when user is logged in and extensions exist', () => {
    render(<HelpMenu />);

    const button = screen.getByRole('button');
    expect(button).toBeDefined();
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('opens and closes help popup on button click', () => {
    render(<HelpMenu />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByRole('menu', { name: /help menu/i })).toBeDefined();

    fireEvent.click(button);
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('closes help popup when clicking outside', () => {
    render(
      <div>
        <div data-testid="outside-element">Outside</div>
        <HelpMenu />
      </div>,
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByRole('menu', { name: /help menu/i })).toBeDefined();

    const outside = screen.getByTestId('outside-element');
    fireEvent.mouseDown(outside);

    expect(screen.queryByRole('menu')).toBeNull();
  });
});
