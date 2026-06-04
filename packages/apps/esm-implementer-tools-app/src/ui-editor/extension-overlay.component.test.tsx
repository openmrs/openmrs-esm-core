// This component manages a portal container imperatively, so verifying its lifecycle requires
// inspecting the DOM directly rather than via Testing Library queries.
/* eslint-disable testing-library/no-node-access */
import React from 'react';
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { ExtensionOverlay } from './extension-overlay.component';

// ExtensionOverlay imperatively appends a portal container as a sibling of the host element. These
// tests guard against leaking that container, which previously was never removed on unmount or when
// the host element changed.
describe('ExtensionOverlay', () => {
  it('removes its injected overlay container on unmount', () => {
    const parent = document.createElement('div');
    const host = document.createElement('div');
    parent.appendChild(host);
    document.body.appendChild(parent);

    const before = parent.childElementCount;

    const { unmount } = render(
      <ExtensionOverlay extensionName="my-ext" slotModuleName="@openmrs/mod" slotName="my-slot" domElement={host} />,
    );
    expect(parent.childElementCount).toBe(before + 1);

    unmount();
    expect(parent.childElementCount).toBe(before);
  });

  it('does not accumulate containers when the host element changes', () => {
    const parent = document.createElement('div');
    const hostA = document.createElement('div');
    const hostB = document.createElement('div');
    parent.append(hostA, hostB);
    document.body.appendChild(parent);

    const before = parent.childElementCount;

    const { rerender } = render(
      <ExtensionOverlay extensionName="my-ext" slotModuleName="@openmrs/mod" slotName="my-slot" domElement={hostA} />,
    );
    expect(parent.childElementCount).toBe(before + 1);

    rerender(
      <ExtensionOverlay extensionName="my-ext" slotModuleName="@openmrs/mod" slotName="my-slot" domElement={hostB} />,
    );
    expect(parent.childElementCount).toBe(before + 1);
  });
});
