import { describe, expect, it } from 'vitest';
import { type ExtensionRenderingsStore } from '@openmrs/esm-framework/src/internal';
import { getExtensionOverlayTargets } from './ui-editor';

// Each target has to carry the real slot, module and extension ID: they build the DOM selector
// for the overlay.
const renderings = new Map(
  Object.entries({
    'top-nav-slot/nav-item-0': {
      renderingId: 'top-nav-slot/nav-item-0',
      extensionName: 'nav-item',
      extensionModuleName: '@openmrs/esm-nav-app',
      extensionId: 'nav-item',
      slotName: 'top-nav-slot',
      slotModuleName: '@openmrs/esm-nav-app',
    },
    'side-nav-slot/nav-item-1': {
      renderingId: 'side-nav-slot/nav-item-1',
      extensionName: 'nav-item',
      extensionModuleName: '@openmrs/esm-nav-app',
      extensionId: 'nav-item',
      slotName: 'side-nav-slot',
      slotModuleName: '@openmrs/esm-nav-app',
    },
    'patient-header-slot/patient-banner-2': {
      renderingId: 'patient-header-slot/patient-banner-2',
      extensionName: 'patient-banner',
      extensionModuleName: '@openmrs/esm-chart-app',
      extensionId: 'patient-banner',
      slotName: 'patient-header-slot',
      slotModuleName: '@openmrs/esm-chart-app',
    },
  }),
) satisfies ExtensionRenderingsStore['renderings'];

describe('getExtensionOverlayTargets', () => {
  it('describes every rendering, including two of the same extension in different slots', () => {
    const targets = getExtensionOverlayTargets(renderings);

    expect(targets).toHaveLength(3);
    expect(targets[0]).toMatchObject({
      extensionName: 'nav-item',
      slotName: 'top-nav-slot',
      slotModuleName: '@openmrs/esm-nav-app',
    });
    expect(targets[1]).toMatchObject({
      extensionName: 'nav-item',
      slotName: 'side-nav-slot',
    });
    expect(targets[2]).toMatchObject({
      extensionName: 'patient-banner',
      slotName: 'patient-header-slot',
      slotModuleName: '@openmrs/esm-chart-app',
    });
  });

  it('surfaces real identifiers rather than structural artifacts of the store', () => {
    const targets = getExtensionOverlayTargets(renderings);

    // `slotName`, `slotModuleName` and `extensionId` go into a DOM selector, so none of them may
    // come from the record's own keys or an index.
    expect(targets.map((target) => target.slotName)).toEqual(
      expect.not.arrayContaining(['id', 'slotName', 'slotModuleName', '0', '1', '2']),
    );
    expect(targets.every((target) => typeof target.extensionRendering.extensionId === 'string')).toBe(true);
    expect(targets.every((target) => typeof target.extensionName === 'string')).toBe(true);
  });

  it('keeps two renderings of one instance in one slot apart', () => {
    // A list renders the same slot once per row, so these share everything but their rendering ID —
    // which is the only thing that can key them or tell their overlays apart.
    const sameSlot = new Map(
      Object.entries({
        'ward-slot/bed-card-0': {
          renderingId: 'ward-slot/bed-card-0',
          extensionName: 'bed-card',
          extensionModuleName: '@openmrs/esm-ward-app',
          extensionId: 'bed-card',
          slotName: 'ward-slot',
          slotModuleName: '@openmrs/esm-ward-app',
        },
        'ward-slot/bed-card-1': {
          renderingId: 'ward-slot/bed-card-1',
          extensionName: 'bed-card',
          extensionModuleName: '@openmrs/esm-ward-app',
          extensionId: 'bed-card',
          slotName: 'ward-slot',
          slotModuleName: '@openmrs/esm-ward-app',
        },
      }),
    ) satisfies ExtensionRenderingsStore['renderings'];

    const targets = getExtensionOverlayTargets(sameSlot);

    expect(targets).toHaveLength(2);
    expect(new Set(targets.map((target) => target.extensionRendering.renderingId)).size).toBe(2);
  });

  it('returns an empty list when nothing is rendered', () => {
    expect(getExtensionOverlayTargets(undefined)).toEqual([]);
    expect(getExtensionOverlayTargets(new Map())).toEqual([]);
  });
});
