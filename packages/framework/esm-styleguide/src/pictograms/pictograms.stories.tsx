import React from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import * as AllPictograms from './pictograms';

// Collect all exported pictogram components (named *Pictogram, excluding
// the base Pictogram component and type-only exports).
const pictogramEntries = Object.entries(AllPictograms).filter(
  ([name, value]) =>
    name.endsWith('Pictogram') && typeof value === 'object' && name !== 'Pictogram' && name !== 'MaybePictogram',
);

function PictogramGallery() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
      {pictogramEntries.map(([name, PictogramComponent]: [string, any]) => (
        <div
          key={name}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px', gap: '8px' }}
        >
          <PictogramComponent />
          <span style={{ fontSize: '11px', textAlign: 'center', wordBreak: 'break-all' }}>{name}</span>
        </div>
      ))}
    </div>
  );
}

const meta: Meta<typeof PictogramGallery> = {
  title: 'Pictograms/Gallery',
  component: PictogramGallery,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof PictogramGallery>;

export const AllAvailablePictograms: Story = {};
