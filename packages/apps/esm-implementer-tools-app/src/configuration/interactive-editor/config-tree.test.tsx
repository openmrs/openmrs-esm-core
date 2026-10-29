import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Type } from '@openmrs/esm-framework/src/internal';
import { implementerToolsStore } from '../../store';
import { ConfigTree } from './config-tree.component';

vi.mock('@openmrs/esm-framework/src/internal', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  useCandidateExtensions: () => [],
}));

const config = {
  '@openmrs/esm-patient-banner-app': {
    showTags: { _type: Type.Boolean, _default: true, _value: true, _source: 'default' },
    extensionSlots: {
      'patient-banner-tags-slot': {},
    },
  },
  'deceased-tag': {
    color: { _type: Type.String, _default: 'red', _value: 'red', _source: 'default' },
  },
};

const instancePath = [
  '@openmrs/esm-patient-banner-app',
  'extensionSlots',
  'patient-banner-tags-slot',
  'configure',
  'deceased-tag',
];

describe('ConfigTree', () => {
  let scrolled: Array<string>;

  beforeEach(() => {
    scrolled = [];
    implementerToolsStore.setState({ uiSelectedPath: null, configPathBeingEdited: null, activeItemDescription: null });
    Element.prototype.scrollIntoView = vi.fn(function (this: Element) {
      scrolled.push(this.textContent ?? '');
    });
  });

  afterEach(() => {
    delete (Element.prototype as Partial<Element>).scrollIntoView;
  });

  it("opens the slot module and scrolls to the slot's configure row for an extension instance path", () => {
    render(<ConfigTree config={config} />);

    act(() => implementerToolsStore.setState({ uiSelectedPath: instancePath }));

    expect(screen.getByRole('button', { name: '@openmrs/esm-patient-banner-app' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(scrolled).toEqual(['configure']);
  });

  it('scrolls to the slot row for a slot path', () => {
    render(<ConfigTree config={config} />);

    act(() => implementerToolsStore.setState({ uiSelectedPath: instancePath.slice(0, 3) }));

    expect(scrolled).toEqual(['patient-banner-tags-slot']);
  });

  it("opens and scrolls to an extension's own schema for an extension path", () => {
    render(<ConfigTree config={config} />);

    act(() => implementerToolsStore.setState({ uiSelectedPath: ['deceased-tag'] }));

    expect(screen.getByRole('button', { name: 'deceased-tag' })).toHaveAttribute('aria-expanded', 'true');
    expect(scrolled).toEqual(['deceased-tag']);
  });

  it('reopens a module the user collapsed when the UI editor points into it again', async () => {
    const user = userEvent.setup();
    render(<ConfigTree config={config} />);
    const moduleHeading = screen.getByRole('button', { name: '@openmrs/esm-patient-banner-app' });

    act(() => implementerToolsStore.setState({ uiSelectedPath: instancePath }));
    expect(moduleHeading).toHaveAttribute('aria-expanded', 'true');

    await user.click(moduleHeading);
    expect(moduleHeading).toHaveAttribute('aria-expanded', 'false');

    act(() => implementerToolsStore.setState({ uiSelectedPath: instancePath.slice(0, 3) }));

    expect(moduleHeading).toHaveAttribute('aria-expanded', 'true');
  });

  it('reopens a module the user collapsed with Escape when the UI editor points into it again', async () => {
    const user = userEvent.setup();
    render(<ConfigTree config={config} />);
    const moduleHeading = screen.getByRole('button', { name: '@openmrs/esm-patient-banner-app' });

    act(() => implementerToolsStore.setState({ uiSelectedPath: instancePath }));
    moduleHeading.focus();
    await user.keyboard('{Escape}');
    expect(moduleHeading).toHaveAttribute('aria-expanded', 'false');

    act(() => implementerToolsStore.setState({ uiSelectedPath: instancePath.slice(0, 3) }));

    expect(moduleHeading).toHaveAttribute('aria-expanded', 'true');
  });

  it('leaves other modules as the user set them', async () => {
    const user = userEvent.setup();
    render(<ConfigTree config={config} />);
    const otherHeading = screen.getByRole('button', { name: 'deceased-tag' });

    await user.click(otherHeading);
    act(() => implementerToolsStore.setState({ uiSelectedPath: instancePath }));

    expect(otherHeading).toHaveAttribute('aria-expanded', 'true');
  });
});
