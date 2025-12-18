import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from './pagination.component';

describe('Pagination', () => {
  const defaultProps = {
    currentItems: 10,
    totalItems: 100,
    pageNumber: 1,
    pageSize: 10,
    onPageNumberChange: vi.fn(),
  };

  it('renders nothing when totalItems is 0', () => {
    const { container } = render(<Pagination {...defaultProps} totalItems={0} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders pagination when totalItems is greater than 0', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByText(/10 \/ 100 items/i)).toBeInTheDocument();
  });

  it('displays correct items count for the first page', () => {
    render(<Pagination {...defaultProps} pageNumber={1} currentItems={10} />);
    expect(screen.getByText(/10 \/ 100 items/i)).toBeInTheDocument();
  });

  it('displays correct items count for a middle page', () => {
    render(<Pagination {...defaultProps} pageNumber={5} currentItems={10} />);
    expect(screen.getByText(/50 \/ 100 items/i)).toBeInTheDocument();
  });

  it('displays correct items count for the last page with fewer items', () => {
    render(<Pagination {...defaultProps} totalItems={95} pageNumber={10} currentItems={5} />);
    expect(screen.getByText(/95 \/ 95 items/i)).toBeInTheDocument();
  });

  it('renders ConfigurableLink when dashboardLinkUrl is provided', () => {
    render(<Pagination {...defaultProps} dashboardLinkUrl="/dashboard" />);
    expect(screen.getByRole('link', { name: /see all/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /see all/i })).toHaveAttribute('href', '/dashboard');
  });

  it('uses custom label when dashboardLinkLabel is provided', () => {
    render(<Pagination {...defaultProps} dashboardLinkUrl="/dashboard" dashboardLinkLabel="View all items" />);
    expect(screen.getByRole('link', { name: /view all items/i })).toBeInTheDocument();
  });

  it('does not render ConfigurableLink when dashboardLinkUrl is not provided', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('calls onPageNumberChange when page changes', async () => {
    const user = userEvent.setup();
    const onPageNumberChange = vi.fn();
    render(<Pagination {...defaultProps} onPageNumberChange={onPageNumberChange} />);

    const nextButton = screen.getByRole('button', { name: /next/i });
    await user.click(nextButton);

    expect(onPageNumberChange).toHaveBeenCalled();
  });

  it('handles case when pageSize is greater than totalItems', () => {
    render(<Pagination {...defaultProps} pageSize={50} totalItems={30} currentItems={30} />);
    expect(screen.getByText(/30 \/ 30 items/i)).toBeInTheDocument();
  });
});
