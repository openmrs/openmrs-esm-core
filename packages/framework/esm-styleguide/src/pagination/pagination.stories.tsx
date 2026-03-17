import React, { useState } from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { Pagination } from './pagination.component';

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  args: {
    totalItems: 100,
    pageSize: 10,
    pageNumber: 1,
    currentItems: 10,
  },
};

function InteractivePagination() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalItems = 85;
  const currentItems = page * pageSize > totalItems ? totalItems - (page - 1) * pageSize : pageSize;

  return (
    <Pagination
      totalItems={totalItems}
      pageSize={pageSize}
      pageNumber={page}
      currentItems={currentItems}
      onPageNumberChange={({ page: newPage }) => setPage(newPage)}
    />
  );
}

export const Interactive: Story = {
  render: () => <InteractivePagination />,
};

export const WithDashboardLink: Story = {
  args: {
    totalItems: 50,
    pageSize: 5,
    pageNumber: 1,
    currentItems: 5,
    dashboardLinkUrl: '/dashboard/vitals',
    dashboardLinkLabel: 'View all vitals',
  },
};
