import React from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import * as AllIcons from './icons';

// Collect all exported icon components (named *Icon, excluding the base
// Icon component and type-only exports).
const iconEntries = Object.entries(AllIcons).filter(
  ([name, value]) => name.endsWith('Icon') && typeof value === 'object' && name !== 'Icon' && name !== 'MaybeIcon',
);

function IconGallery({ size, fill }: { size: number; fill: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}>
      {iconEntries.map(([name, IconComponent]: [string, any]) => (
        <div
          key={name}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px', gap: '8px' }}
        >
          <IconComponent size={size} fill={fill} />
          <span style={{ fontSize: '11px', textAlign: 'center', wordBreak: 'break-all' }}>{name}</span>
        </div>
      ))}
    </div>
  );
}

const meta: Meta<typeof IconGallery> = {
  title: 'Icons/Gallery',
  component: IconGallery,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof IconGallery>;

export const AllAvailableIcons: Story = {
  args: { size: 20, fill: 'currentColor' },
};

export const LargeIcons: Story = {
  args: { size: 48, fill: 'currentColor' },
};
