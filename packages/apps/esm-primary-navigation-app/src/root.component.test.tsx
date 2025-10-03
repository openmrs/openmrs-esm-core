import React from 'react';
import { of } from 'rxjs';
import { render, screen, waitFor } from '@testing-library/react';
import {
  useConfig,
  useAssignedExtensions,
  useSession,
  type AssignedExtension,
  type Session,
  useLeftNavStore,
} from '@openmrs/esm-framework';
import { isDesktop } from './utils';
import { mockUser } from '../__mocks__/mock-user';
import { mockSession } from '../__mocks__/mock-session';
import Root from './root.component';

const mockUserObservable = of(mockUser);
const mockSessionObservable = of({ data: mockSession });
const mockIsDesktop = jest.mocked(isDesktop);

const mockUseConfig = jest.mocked(useConfig);
const mockUseAssignedExtensions = jest.mocked(useAssignedExtensions);
const mockUseSession = jest.mocked(useSession);
const mockUseLeftNavStore = jest.mocked(useLeftNavStore);

mockUseConfig.mockReturnValue({
  logo: { src: null, alt: null, name: 'Mock EMR', link: 'Mock EMR' },
});
mockUseAssignedExtensions.mockReturnValue(['mock-extension'] as unknown as AssignedExtension[]);
mockUseSession.mockReturnValue(mockSession as unknown as Session);
mockUseLeftNavStore.mockReturnValue({ slotName: '', basePath: '', mode: 'normal' });

jest.mock('./root.resource', () => ({
  getSynchronizedCurrentUser: jest.fn(() => mockUserObservable),
  getCurrentSession: jest.fn(() => mockSessionObservable),
}));

jest.mock('./utils', () => ({
  isDesktop: jest.fn(() => true),
}));

describe('Root', () => {
  it('should display navbar with title', async () => {
    render(<Root />);
    expect(screen.getByText(/mock emr/i)).toBeInTheDocument();
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
