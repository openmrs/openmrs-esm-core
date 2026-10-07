import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getCoreTranslation } from '@openmrs/esm-translations';
import { Pagination, getCarbonPaginationTranslationProps } from './pagination.component';

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

  it('displays singular "item" and "page" when totalItems is 1', () => {
    render(<Pagination {...defaultProps} totalItems={1} currentItems={1} pageSize={10} pageNumber={1} />);
    expect(screen.getByText('1 / 1 item')).toBeInTheDocument();
    expect(screen.getByText('of 1 page', { selector: 'span' })).toBeInTheDocument();
  });

  it('displays plural "items" and "pages" when totalItems and page counts are greater than 1', () => {
    render(<Pagination {...defaultProps} totalItems={20} currentItems={10} pageSize={10} pageNumber={1} />);
    expect(screen.getByText(/10 \/ 20 items/i)).toBeInTheDocument();
    expect(screen.getByText('of 2 pages', { selector: 'span' })).toBeInTheDocument();
  });

  it('passes translated backwardText and forwardText to Carbon Pagination buttons', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByRole('button', { name: /previous page/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next page/i })).toBeInTheDocument();
  });

  it('renders translated button labels and tooltips in a non-English locale', () => {
    const originalImplementation = vi.mocked(getCoreTranslation).getMockImplementation();
    vi.mocked(getCoreTranslation).mockImplementation((key, defaultText) => {
      if (key === 'paginationPreviousPage') return 'página anterior';
      if (key === 'paginationNextPage') return 'siguiente página';
      return defaultText ?? key;
    });

    render(<Pagination {...defaultProps} />);
    expect(screen.getByRole('button', { name: /página anterior/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /siguiente página/i })).toBeInTheDocument();

    if (originalImplementation) {
      vi.mocked(getCoreTranslation).mockImplementation(originalImplementation);
    }
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

    const nextButton = screen.getByRole('button', { name: /next page/i });
    await user.click(nextButton);

    expect(onPageNumberChange).toHaveBeenCalled();
  });

  it('handles case when pageSize is greater than totalItems', () => {
    render(<Pagination {...defaultProps} pageSize={50} totalItems={30} currentItems={30} />);
    expect(screen.getByText(/30 \/ 30 items/i)).toBeInTheDocument();
  });

  describe('getCarbonPaginationTranslationProps', () => {
    it('returns complete translation props with singular and plural formatting', () => {
      const props = getCarbonPaginationTranslationProps();
      expect(props.backwardText).toBe('Previous page');
      expect(props.forwardText).toBe('Next page');
      expect(props.itemsPerPageText).toBe('Items per page:');
      expect(props.pageText(1)).toBe('page 1');
      expect(props.pageText(5)).toBe('page 5');
      expect(props.pageRangeText(1, 1)).toBe('of 1 page');
      expect(props.pageRangeText(1, 4)).toBe('of 4 pages');
      expect(props.itemRangeText(1, 1, 1)).toBe('1–1 of 1 item');
      expect(props.itemRangeText(1, 10, 50)).toBe('1–10 of 50 items');
      expect(props.itemText(1, 1)).toBe('1–1 item');
      expect(props.itemText(1, 10)).toBe('1–10 items');
    });
  });
});
