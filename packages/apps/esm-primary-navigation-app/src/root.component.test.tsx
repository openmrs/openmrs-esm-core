import React from 'react';
import { of } from 'rxjs';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useConfig, useAssignedExtensions, useSession } from '@openmrs/esm-framework';
import { isDesktop } from './utils';
import { mockUser } from '../__mocks__/mock-user';
import { mockSession } from '../__mocks__/mock-session';
import Root from './root.component';

const mockUserObservable = of(mockUser);
const mockSessionObservable = of({ data: mockSession });
const mockIsDesktop = jest.mocked(isDesktop);

const mockedUseConfig = useConfig as jest.Mock;
const mockedUseAssignedExtensions = useAssignedExtensions as jest.Mock;
const mockedUseSession = useSession as jest.Mock;

mockedUseConfig.mockReturnValue({
  logo: { src: null, alt: null, name: 'Mock EMR', link: 'Mock EMR' },
});
mockedUseAssignedExtensions.mockReturnValue(['mock-extension']);
mockedUseSession.mockReturnValue(mockSession);

jest.mock('./root.resource', () => ({
  getSynchronizedCurrentUser: jest.fn(() => mockUserObservable),
  getCurrentSession: jest.fn(() => mockSessionObservable),
}));

jest.mock('./offline', () => ({
  syncUserPropertiesChanges: () => Promise.resolve({}),
}));

jest.mock('./utils', () => ({
  isDesktop: jest.fn(() => true),
}));

describe('Root', () => {
  it('should display navbar with title', async () => {
    render(<Root />);

    expect(screen.getByRole('button', { name: /My Account/i })).toBeInTheDocument();
    expect(screen.getByRole('banner', { name: /openmrs/i })).toBeInTheDocument();
    expect(screen.getByText(/mock emr/i)).toBeInTheDocument();
  });

  it('should open user-menu panel', async () => {
    const user = userEvent.setup();

    render(<Root />);

    const userButton = screen.getByRole('button', { name: /My Account/i });
    await user.click(userButton);
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
  });

  describe('when view is desktop', () => {
    beforeEach(() => {
      mockIsDesktop.mockImplementation(() => true);
    });

    it('does not render side menu button if desktop', async () => {
      await waitFor(() => expect(screen.queryAllByLabelText('Open menu')).toHaveLength(0));
    });
  });
});
