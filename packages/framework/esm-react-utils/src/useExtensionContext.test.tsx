import React, { type PropsWithChildren } from 'react';
import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { type ExtensionData } from '@openmrs/esm-extensions';
import { ComponentContext } from './ComponentContext';
import { useExtensionContext } from './useExtensionContext';

describe('useExtensionContext', () => {
  it('returns the extension context when rendered as an extension', () => {
    const extension: ExtensionData = {
      extensionId: 'my-extension#instance',
      extensionSlotName: 'my-slot',
      extensionSlotModuleName: 'slot-module',
      extensionMeta: { column: 2, title: 'My Extension' },
    };

    const wrapper = ({ children }: PropsWithChildren) => (
      <ComponentContext.Provider value={{ moduleName: 'slot-module', featureName: '', extension }}>
        {children}
      </ComponentContext.Provider>
    );

    const { result } = renderHook(() => useExtensionContext(), { wrapper });

    expect(result.current).toEqual(extension);
    expect(result.current?.extensionMeta).toEqual({ column: 2, title: 'My Extension' });
  });

  it('returns undefined when not rendered as an extension', () => {
    const { result } = renderHook(() => useExtensionContext());

    expect(result.current).toBeUndefined();
  });
});
