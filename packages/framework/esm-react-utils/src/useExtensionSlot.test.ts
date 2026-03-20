import React from 'react';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import * as esmExtensions from '@openmrs/esm-extensions';
import { useExtensionSlot } from '.';
import { ComponentContext } from './ComponentContext';

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(
    ComponentContext.Provider,
    { value: { moduleName: 'test-module', featureName: 'test-feature' } as any },
    children,
  );

describe('useExtensionSlot', () => {
  it('does not call updateExtensionSlotState when re-rendered with same state content', () => {
    const updateSpy = vi.spyOn(esmExtensions, 'updateExtensionSlotState');
    const { rerender } = renderHook(({ slotName, state }) => useExtensionSlot(slotName, state), {
      initialProps: { slotName: 'test-slot', state: { deep: { prop: 1 } } },
      wrapper,
    });
    updateSpy.mockClear();
    rerender({ slotName: 'test-slot', state: { deep: { prop: 1 } } });
    rerender({ slotName: 'test-slot', state: { deep: { prop: 1 } } });
    expect(updateSpy).not.toHaveBeenCalled();
  });

  it('calls updateExtensionSlotState when state content actually changes', () => {
    const updateSpy = vi.spyOn(esmExtensions, 'updateExtensionSlotState');
    const { rerender } = renderHook(({ slotName, state }) => useExtensionSlot(slotName, state), {
      initialProps: { slotName: 'test-slot', state: { deep: { prop: 1 } } },
      wrapper,
    });
    updateSpy.mockClear();
    rerender({ slotName: 'test-slot', state: { deep: { prop: 2 } } });
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(updateSpy).toHaveBeenCalledWith('test-slot', { deep: { prop: 2 } });
  });
});
