import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, render } from '@testing-library/react';
import { type LoggedInUser, type Session, useSession } from '@openmrs/esm-framework';
import { mockLoggedInUser } from '../../../__mocks__/mock-user';
import UserPanelSwitcher from './user-panel-switcher.component';

vi.mock('@openmrs/esm-framework', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<typeof import('@openmrs/esm-framework')>();
  return {
    ...actual,
    useSession: vi.fn(),
  };
});

const mockUseSession = vi.mocked(useSession);

describe('UserPanelSwitcher', () => {
  beforeEach(() => {
    mockUseSession.mockReturnValue({
      authenticated: true,
      user: mockLoggedInUser as unknown as LoggedInUser,
    } as unknown as Session);
  });

  it('should display user name', async () => {
    render(<UserPanelSwitcher />);

    expect(await screen.findByText(/Dr Healther Morgan/i)).toBeInTheDocument();
  });
});
