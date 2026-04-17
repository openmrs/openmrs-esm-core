import React from 'react';
import { test, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { screen, render } from '@testing-library/react';
import NotificationsMenuPanel from './notifications-menu-panel.component';

vi.mock('@openmrs/esm-framework', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<typeof import('@openmrs/esm-framework')>();
  return {
    ...actual,
    ExtensionSlot: vi.fn(({ children }) => <>{children}</>),
  };
});

test('renders the notifications menu panel scaffold', () => {
  render(<NotificationsMenuPanel expanded />);

  expect(screen.getByRole('heading', { name: /notifications/i })).toBeInTheDocument();
});
