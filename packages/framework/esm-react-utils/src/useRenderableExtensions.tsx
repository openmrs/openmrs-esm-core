/** @module @category Extension */
import React, { useMemo, useState } from 'react';
import {
  type ExtensionInternalStore,
  getExtensionInternalStore,
  getExtensionNameFromId,
} from '@openmrs/esm-extensions';
import { ComponentContext, Extension, type ExtensionProps, useExtensionSlot } from '.';
import { useStore } from './useStore';

type RenderableExtension = React.FC<Pick<ExtensionProps, 'state'>>;

/** The components a hook has handed out, keyed by extension id, for one slot in one module. */
interface RenderableExtensionTable {
  slotName: string;
  slotModuleName: string;
  components: ReadonlyMap<string, RenderableExtension>;
}

/**
 * Creates the component for one extension. The component only captures which extension it renders.
 * It reads the extension's meta from the store, so a change to the meta updates the mounted extension
 * the same way `ExtensionSlot` does, rather than replacing the component.
 */
function createRenderableExtension(slotName: string, slotModuleName: string, extensionId: string) {
  const extensionName = getExtensionNameFromId(extensionId);
  const selectMeta = (state: ExtensionInternalStore) => state.extensions[extensionName]?.meta;

  const Component: RenderableExtension = ({ state }) => {
    const extensionMeta = useStore(getExtensionInternalStore(), selectMeta);
    const contextValue = useMemo(
      () => ({
        moduleName: slotModuleName, // moduleName is not used by the receiving Extension
        featureName: '', // featureName is not available at this point
        extension: {
          extensionId,
          extensionSlotName: slotName,
          extensionSlotModuleName: slotModuleName,
          extensionMeta,
        },
      }),
      [extensionMeta],
    );

    return (
      <ComponentContext.Provider value={contextValue}>
        <Extension state={state} />
      </ComponentContext.Provider>
    );
  };
  Component.displayName = `RenderableExtension(${extensionId})`;

  return Component;
}

/**
 * Returns a table with a component for each of `extensionIds`. Components already in `previous` for
 * the same slot and module are reused; extensions no longer in the slot are dropped.
 */
function reconcileTable(
  previous: RenderableExtensionTable | null,
  slotName: string,
  slotModuleName: string,
  extensionIds: ReadonlySet<string>,
): RenderableExtensionTable {
  const reusable =
    previous?.slotName === slotName && previous.slotModuleName === slotModuleName ? previous.components : null;
  const components = new Map<string, RenderableExtension>();
  for (const extensionId of extensionIds) {
    components.set(
      extensionId,
      reusable?.get(extensionId) ?? createRenderableExtension(slotName, slotModuleName, extensionId),
    );
  }
  return { slotName, slotModuleName, components };
}

function tableMatches(
  table: RenderableExtensionTable,
  slotName: string,
  slotModuleName: string,
  extensionIds: ReadonlySet<string>,
) {
  return (
    table.slotName === slotName &&
    table.slotModuleName === slotModuleName &&
    table.components.size === extensionIds.size &&
    [...extensionIds].every((extensionId) => table.components.has(extensionId))
  );
}

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
 * Each extension keeps the same component for as long as it stays in the slot, so passing it new
 * state updates the mounted extension rather than remounting it.
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
  const extensionIds = useMemo(
    () => new Set(name ? extensions.map((extension) => extension.id) : []),
    [name, extensions],
  );

  const [table, setTable] = useState(() => reconcileTable(null, name, extensionSlotModuleName, extensionIds));
  let currentTable = table;
  if (!tableMatches(table, name, extensionSlotModuleName, extensionIds)) {
    // Adjusting state while rendering, as React documents for storing information from previous renders:
    // React re-renders this component with the new table before rendering its children.
    currentTable = reconcileTable(table, name, extensionSlotModuleName, extensionIds);
    setTable(currentTable);
  }

  return useMemo(
    () =>
      name
        ? extensions.flatMap((extension) => {
            const component = currentTable.components.get(extension.id);
            return component ? [component] : [];
          })
        : [],
    [name, extensions, currentTable],
  );
}
