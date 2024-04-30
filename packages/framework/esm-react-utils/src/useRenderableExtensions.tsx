/** @module @category Extension */
import React from 'react';
import { ComponentContext, Extension, type ExtensionProps, useExtensionSlot } from '.';

/**
 * This is an advanced hook for use-cases where its useful to use the extension system,
 * but not the `ExtensionSlot` component's rendering of extensions. Use of this hook
 * should be avoided if possible.
 *
 * Functionally, this hook is very similar to the `ExtensionSlot` component, but whereas
 * an `ExtensionSlot` renders a DOM tree of extensions bound to the slot, this hook simply
 * returns the extensions as an array of React components that can be wired into a component
 * however makes sense.
 *
 * @param name The name of the extension slot
 *
 * @example
 * ```ts
 * const extensions = useRenderableExtensions('my-extension-slot');
 * return (
 *  <>
 *    {extensions.map((Ext, index) => (
 *      <React.Fragment key={index}>
 *        <Ext state={{key: 'value'}} />
 *      </React.Fragment>
 *    ))}
 *  </>
 * )
 * ```
 */
export function useRenderableExtensions(name: string): Array<React.FC<Pick<ExtensionProps, 'state'>>> {
  const { extensions, extensionSlotModuleName } = useExtensionSlot(name);

  return name
    ? extensions.map((extension) => ({ state }: Pick<ExtensionProps, 'state'>) => (
        <ComponentContext.Provider
          value={{
            moduleName: extensionSlotModuleName, // moduleName is not used by the receiving Extension
            featureName: '', // featureName is not available at this point
            extension: {
              extensionId: extension.id,
              extensionSlotName: name,
              extensionSlotModuleName,
            },
          }}
        >
          <Extension state={state} />
        </ComponentContext.Provider>
      ))
    : [];
}
