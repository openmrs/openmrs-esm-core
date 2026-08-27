import { describe, expect, it } from 'vitest';
import { type ExtensionInstancesStore } from '@openmrs/esm-framework/src/internal';
import { getExtensionOverlayTargets } from './ui-editor';

// Each target has to carry the real slot, module and extension ID: they build the DOM selector
// for the overlay.
const instances = new Map(
  Object.entries({
    'top-nav-slot/nav-item-0': {
      instanceId: 'top-nav-slot/nav-item-0',
      extensionName: 'nav-item',
      extensionModuleName: '@openmrs/esm-nav-app',
      id: 'nav-item',
      slotName: 'top-nav-slot',
      slotModuleName: '@openmrs/esm-nav-app',
    },
    'side-nav-slot/nav-item-1': {
      instanceId: 'side-nav-slot/nav-item-1',
      extensionName: 'nav-item',
      extensionModuleName: '@openmrs/esm-nav-app',
      id: 'nav-item',
      slotName: 'side-nav-slot',
      slotModuleName: '@openmrs/esm-nav-app',
    },
    'patient-header-slot/patient-banner-2': {
      instanceId: 'patient-header-slot/patient-banner-2',
      extensionName: 'patient-banner',
      extensionModuleName: '@openmrs/esm-chart-app',
      id: 'patient-banner',
      slotName: 'patient-header-slot',
      slotModuleName: '@openmrs/esm-chart-app',
    },
  }),
) satisfies ExtensionInstancesStore['instances'];

describe('getExtensionOverlayTargets', () => {
  it('describes every rendered instance, including two of the same extension in different slots', () => {
    const targets = getExtensionOverlayTargets(instances);

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
    const targets = getExtensionOverlayTargets(instances);

    // `slotName`, `slotModuleName` and the instance's `id` go into a DOM selector, so none of
    // them may come from the record's own keys or an index.
    expect(targets.map((target) => target.slotName)).toEqual(
      expect.not.arrayContaining(['id', 'slotName', 'slotModuleName', '0', '1', '2']),
    );
    expect(targets.every((target) => typeof target.extensionInstance.id === 'string')).toBe(true);
    expect(targets.every((target) => typeof target.extensionName === 'string')).toBe(true);
  });

  it('returns an empty list when nothing is rendered', () => {
    expect(getExtensionOverlayTargets(undefined)).toEqual([]);
    expect(getExtensionOverlayTargets(new Map())).toEqual([]);
  });
});
