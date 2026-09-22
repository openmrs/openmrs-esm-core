import React, { type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// <Workspace2> reads the setters that report its title and unsaved-changes state from the single-spa
// parcel context. Replace that context with a plain React context so this test can provide mock
// setters without a real parcel.
const { SingleSpaContext } = vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- hoisted before imports; needs require
  const react = require('react');
  return { SingleSpaContext: react.createContext({}) };
});
vi.mock('single-spa-react', () => ({ SingleSpaContext }));

import { Workspace2 } from './workspace2.component';

function makeSetters() {
  return { setWorkspaceTitle: vi.fn(), setHasUnsavedChanges: vi.fn() };
}

function wrapInContext(setters: ReturnType<typeof makeSetters>, ui: ReactNode) {
  return <SingleSpaContext.Provider value={setters as never}>{ui}</SingleSpaContext.Provider>;
}

describe('<Workspace2>', () => {
  it('renders its children and reports its title and unsaved-changes state', () => {
    const setters = makeSetters();
    render(
      wrapInContext(
        setters,
        <Workspace2 title="Foo" hasUnsavedChanges>
          content
        </Workspace2>,
      ),
    );

    expect(screen.getByText('content')).toBeInTheDocument();
    expect(setters.setWorkspaceTitle).toHaveBeenLastCalledWith('Foo');
    expect(setters.setHasUnsavedChanges).toHaveBeenLastCalledWith(true);
  });

  it('reports no unsaved changes by default', () => {
    const setters = makeSetters();
    render(wrapInContext(setters, <Workspace2 title="Foo">content</Workspace2>));

    expect(setters.setHasUnsavedChanges).toHaveBeenLastCalledWith(false);
  });

  it('reports again when its props change', () => {
    const setters = makeSetters();
    const { rerender } = render(
      wrapInContext(
        setters,
        <Workspace2 title="Foo" hasUnsavedChanges>
          content
        </Workspace2>,
      ),
    );

    rerender(
      wrapInContext(
        setters,
        <Workspace2 title="Bar" hasUnsavedChanges={false}>
          content
        </Workspace2>,
      ),
    );

    expect(setters.setWorkspaceTitle).toHaveBeenLastCalledWith('Bar');
    expect(setters.setHasUnsavedChanges).toHaveBeenLastCalledWith(false);
  });
});
