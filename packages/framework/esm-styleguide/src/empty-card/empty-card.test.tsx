import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmptyCard } from './empty-card.component';

describe('EmptyCard', () => {
  const defaultProps = {
    displayText: 'medications',
    headerTitle: 'Medications',
  };

  it('renders the header title', () => {
    render(<EmptyCard {...defaultProps} />);
    expect(screen.getByRole('heading', { name: /medications/i })).toBeInTheDocument();
  });

  it('renders the empty state text with the display text', () => {
    render(<EmptyCard {...defaultProps} />);
    expect(screen.getByText(/there are no medications to display/i)).toBeInTheDocument();
  });

  it('does not render the action button when launchForm is not provided', () => {
    render(<EmptyCard {...defaultProps} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders the action button when launchForm is provided', () => {
    const launchForm = vi.fn();
    render(<EmptyCard {...defaultProps} launchForm={launchForm} />);
    expect(screen.getByRole('button', { name: /record medications/i })).toBeInTheDocument();
  });

  it('calls launchForm when the action button is clicked', async () => {
    const user = userEvent.setup();
    const launchForm = vi.fn();
    render(<EmptyCard {...defaultProps} launchForm={launchForm} />);

    const button = screen.getByRole('button', { name: /record medications/i });
    await user.click(button);

    expect(launchForm).toHaveBeenCalledTimes(1);
  });

  it('renders with different display text', () => {
    render(<EmptyCard displayText="allergies" headerTitle="Allergies" />);
    expect(screen.getByRole('heading', { name: /allergies/i })).toBeInTheDocument();
    expect(screen.getByText(/there are no allergies to display/i)).toBeInTheDocument();
  });

  it('renders the empty data illustration', () => {
    render(<EmptyCard {...defaultProps} />);
    // eslint-disable-next-line testing-library/no-node-access
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 64 64');
  });
});
