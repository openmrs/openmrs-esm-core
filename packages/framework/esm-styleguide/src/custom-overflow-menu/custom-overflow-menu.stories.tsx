import React from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { CustomOverflowMenu, CustomOverflowMenuItem } from './custom-overflow-menu.component';

const meta: Meta<typeof CustomOverflowMenu> = {
  title: 'Components/CustomOverflowMenu',
  component: CustomOverflowMenu,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CustomOverflowMenu>;

export const Default: Story = {
  args: {
    menuTitle: 'Actions',
    children: (
      <>
        <CustomOverflowMenuItem itemText="Edit" />
        <CustomOverflowMenuItem itemText="Delete" />
      </>
    ),
  },
};

export const WithMultipleItems: Story = {
  args: {
    menuTitle: 'Options',
    children: (
      <>
        <CustomOverflowMenuItem itemText="View details" />
        <CustomOverflowMenuItem itemText="Edit" />
        <CustomOverflowMenuItem itemText="Print" />
        <CustomOverflowMenuItem itemText="Delete" hasDivider />
      </>
    ),
  },
};

export const WithDisabledItem: Story = {
  args: {
    menuTitle: 'Actions',
    children: (
      <>
        <CustomOverflowMenuItem itemText="Edit" />
        <CustomOverflowMenuItem itemText="Delete" disabled />
      </>
    ),
  },
};
