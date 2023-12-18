import React from 'react';
import { screen, render } from '@testing-library/react';
import NotificationsMenuPanel from './notifications-menu-panel.component';

test('renders the notifications menu panel scaffold', () => {
  render(<NotificationsMenuPanel expanded />);

  expect(screen.getByRole('heading', { name: /notifications/i })).toBeInTheDocument();
});
