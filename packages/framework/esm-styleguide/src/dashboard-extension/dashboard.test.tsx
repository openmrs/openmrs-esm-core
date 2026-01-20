import React from 'react';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DashboardExtension } from './index';

describe('DashboardExtension', () => {
  describe('Basic Rendering', () => {
    it('renders with required props (path and title)', () => {
      renderDashboardExtension('/base', 'dashboard', 'Dashboard', '/base');
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
    });

    it('renders ConfigurableLink with correct href', () => {
      renderDashboardExtension('/base', 'dashboard', 'Dashboard', '/base');

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/base/dashboard');
    });

    // it('renders icon when provided', () => {
    //   render(
    //     <MemoryRouter initialEntries={['/base']}>
    //       <DashboardExtension path="dashboard" title="Dashboard" basePath="/base" icon="omrs-icon-calendar" />
    //     </MemoryRouter>,
    //   );

    //   expect(screen.getByText('omrs-icon-calendar')).toBeInTheDocument();
    // });
  });

  describe('Active State Logic', () => {
    it('is active when current pathname matches dashboard path', () => {
      renderDashboardExtension('/base/dashboard', 'dashboard', 'Dashboard', '/base');

      const link = screen.getByRole('link');
      expect(link).toHaveClass('active-left-nav-link');
    });

    it('is active when path segments match (partial match)', () => {
      renderDashboardExtension('/base/dashboard/patients', 'patients', 'Dashboard', '/base');

      const link = screen.getByRole('link');
      expect(link).toHaveClass('active-left-nav-link');
    });

    it('is not active when path does not match', () => {
      renderDashboardExtension('/base/other', 'dashboard', 'Dashboard', '/base');

      const link = screen.getByRole('link');
      expect(link).not.toHaveClass('active-left-nav-link');
    });

    it('handles empty path (returns false)', () => {
      renderDashboardExtension('/base', '', 'Dashboard', '/base');

      const link = screen.getByRole('link');
      expect(link).not.toHaveClass('active-left-nav-link');
    });

    it('handles path with encoded characters in location', () => {
      renderDashboardExtension('/base/dashboard%20%26%20test', 'dashboard & test', 'Dashboard', '/base');

      const link = screen.getByRole('link');
      expect(link).toHaveClass('active-left-nav-link');
      expect(link).toHaveAttribute('href', '/base/dashboard%20%26%20test');
    });
  });
});

const renderDashboardExtension = (browserPath: string,path: string, title: string, basePath: string) => {
  render(
    <MemoryRouter initialEntries={[browserPath]}>
      <DashboardExtension path={path} title={title} basePath={basePath} />
    </MemoryRouter>
  );
};