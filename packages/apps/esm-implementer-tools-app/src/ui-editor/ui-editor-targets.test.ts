import { beforeEach, describe, expect, it } from 'vitest';
import { type ExtensionRendering } from '@openmrs/esm-framework/src/internal';
import {
  getEnclosingSlot,
  getExtensionSlots,
  getSlotExtensions,
  getTargetChain,
  getTargetKey,
} from './ui-editor-targets';

const renderings: Record<string, ExtensionRendering> = {
  'patient-header-slot/patient-banner-0': {
    renderingId: 'patient-header-slot/patient-banner-0',
    extensionName: 'patient-banner',
    extensionModuleName: '@openmrs/esm-patient-banner-app',
    extensionId: 'patient-banner',
    slotName: 'patient-header-slot',
    slotModuleName: '@openmrs/esm-patient-chart-app',
  },
  'patient-banner-tags-slot/active-visit-tag#chart-1': {
    renderingId: 'patient-banner-tags-slot/active-visit-tag#chart-1',
    extensionName: 'active-visit-tag',
    extensionModuleName: '@openmrs/esm-patient-chart-app',
    extensionId: 'active-visit-tag#chart',
    slotName: 'patient-banner-tags-slot',
    slotModuleName: '@openmrs/esm-patient-banner-app',
  },
};

const lookupRendering = (renderingId: string) => renderings[renderingId];

function byId(id: string) {
  return document.getElementById(id) as HTMLElement;
}

describe('UI editor targets', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="header-slot" data-extension-slot-name="patient-header-slot" data-extension-slot-module-name="@openmrs/esm-patient-chart-app">
        <div id="banner" data-extension-id="patient-banner" data-extension-rendering-id="patient-header-slot/patient-banner-0">
          <span id="name">Joshua Johnson</span>
          <div id="actions-slot" data-extension-slot-name="patient-banner-actions-slot" data-extension-slot-module-name="@openmrs/esm-patient-banner-app"></div>
          <div id="tags-slot" data-extension-slot-name="patient-banner-tags-slot" data-extension-slot-module-name="@openmrs/esm-patient-banner-app">
            <div id="visit-tag" data-extension-id="active-visit-tag#chart" data-extension-rendering-id="patient-banner-tags-slot/active-visit-tag#chart-1">
              <span id="visit-text">Active visit</span>
            </div>
            <div id="unknown-tag" data-extension-id="old-tag" data-extension-rendering-id="patient-banner-tags-slot/old-tag-9"></div>
          </div>
        </div>
      </div>
      <div data-openmrs-implementer-tools>
        <div data-extension-slot-name="tools-slot"><span id="tools-text">Tools</span></div>
      </div>`;
  });

  it('lists the enclosing extensions and slots, innermost first', () => {
    const chain = getTargetChain(byId('visit-text'), lookupRendering);

    expect(chain.map((target) => (target.kind === 'slot' ? target.slotName : target.extensionId))).toEqual([
      'active-visit-tag#chart',
      'patient-banner-tags-slot',
      'patient-banner',
      'patient-header-slot',
    ]);
    expect(chain[0]).toMatchObject({
      kind: 'extension',
      extensionName: 'active-visit-tag',
      moduleName: '@openmrs/esm-patient-chart-app',
    });
    expect(chain[1]).toMatchObject({ kind: 'slot', moduleName: '@openmrs/esm-patient-banner-app' });
    expect(getEnclosingSlot(chain, 0)?.slotName).toBe('patient-banner-tags-slot');
    expect(getEnclosingSlot(chain, 2)?.slotName).toBe('patient-header-slot');
  });

  it('describes an extension whose rendering is no longer known from the page alone', () => {
    const [target] = getTargetChain(byId('unknown-tag'), lookupRendering);

    expect(target).toMatchObject({ kind: 'extension', extensionId: 'old-tag', extensionName: 'old-tag' });
    expect(target.moduleName).toBeUndefined();
  });

  it("never describes the implementer tools' own UI", () => {
    expect(getTargetChain(byId('tools-text'), lookupRendering)).toEqual([]);
  });

  it('identifies a target by where it is, not just its name', () => {
    const chain = getTargetChain(byId('visit-text'), lookupRendering);

    expect(getTargetKey(chain[0])).not.toBe(getTargetKey(chain[1]));
    expect(getTargetKey(chain[0])).toBe(getTargetKey(getTargetChain(byId('visit-tag'), lookupRendering)[0]));

    // A second copy of the tags slot, rendering the same extension, as a list does once per row.
    byId('tags-slot').insertAdjacentHTML('afterend', byId('tags-slot').outerHTML.replace(/ id="[^"]*"/g, ''));
    const copy = byId('tags-slot').nextElementSibling!.querySelector('[data-extension-id]')!;
    const copyChain = getTargetChain(copy, lookupRendering);

    expect(getTargetKey(copyChain[0])).not.toBe(getTargetKey(chain[0]));
    expect(getTargetKey(copyChain[1])).not.toBe(getTargetKey(chain[1]));
  });

  it("lists a slot's own extensions but not those in slots nested inside them", () => {
    expect(getSlotExtensions(byId('header-slot')).map((element) => element.id)).toEqual(['banner']);
    expect(getSlotExtensions(byId('tags-slot')).map((element) => element.id)).toEqual(['visit-tag', 'unknown-tag']);
  });

  it("lists an extension's own slots, including empty ones", () => {
    expect(getExtensionSlots(byId('banner')).map((element) => element.id)).toEqual(['actions-slot', 'tags-slot']);
    expect(getExtensionSlots(byId('visit-tag'))).toEqual([]);
  });
});
