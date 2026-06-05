import { describe, expect, it } from 'vitest';
import { type ExtensionInfo } from '@openmrs/esm-framework/src/internal';
import { getExtensionOverlayTargets } from './ui-editor';

// `extensions[name].instances` is an Array<ExtensionInstance> in the framework store. These tests
// guard against regressing to an object-style traversal, which produced array indices as module
// names and instance property names as slot names, so no overlay ever matched a real DOM node.
const extensions = {
  'nav-item': {
    instances: [
      { id: 'nav-item-0', slotName: 'top-nav-slot', slotModuleName: '@openmrs/esm-nav-app' },
      { id: 'nav-item-1', slotName: 'side-nav-slot', slotModuleName: '@openmrs/esm-nav-app' },
    ],
  },
  'patient-banner': {
    instances: [{ id: 'patient-banner-0', slotName: 'patient-header-slot', slotModuleName: '@openmrs/esm-chart-app' }],
  },
} as unknown as Record<string, ExtensionInfo>;

describe('getExtensionOverlayTargets', () => {
  it('flattens the instances array into real slot, module, and id descriptors', () => {
    const targets = getExtensionOverlayTargets(extensions);

    expect(targets).toHaveLength(3);
    expect(targets[0]).toMatchObject({
      extensionName: 'nav-item',
      slotName: 'top-nav-slot',
      slotModuleName: '@openmrs/esm-nav-app',
    });
    expect(targets[0].extensionInstance.id).toBe('nav-item-0');
    expect(targets[2]).toMatchObject({
      extensionName: 'patient-banner',
      slotName: 'patient-header-slot',
      slotModuleName: '@openmrs/esm-chart-app',
    });
  });

  it('does not surface array indices or instance property names (regression guard)', () => {
    const targets = getExtensionOverlayTargets(extensions);

    // Old object-traversal bug surfaced "0"/"1" as module names and "id"/"slotName"/"slotModuleName"
    // as slot names, with an undefined instance id.
    expect(targets.map((target) => target.slotModuleName)).not.toContain('0');
    expect(targets.map((target) => target.slotName)).toEqual(
      expect.not.arrayContaining(['id', 'slotName', 'slotModuleName']),
    );
    expect(targets.every((target) => typeof target.extensionInstance.id === 'string')).toBe(true);
  });

  it('returns an empty list when there are no extensions', () => {
    expect(getExtensionOverlayTargets(undefined)).toEqual([]);
    expect(getExtensionOverlayTargets({})).toEqual([]);
  });
});
