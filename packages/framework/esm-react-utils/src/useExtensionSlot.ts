import { useContext, useEffect } from 'react';
import { type ExtensionSlotCustomState, registerExtensionSlot } from '@openmrs/esm-extensions';
import { ComponentContext } from './ComponentContext';
import { useAssignedExtensions } from './useAssignedExtensions';

/** @internal */
export function useExtensionSlot(slotName: string, state?: ExtensionSlotCustomState) {
  const { moduleName } = useContext(ComponentContext);

  if (!moduleName) {
    throw Error('ComponentContext has not been provided. This should come from @openmrs/esm-react-utils.');
  }

  useEffect(() => {
    registerExtensionSlot(moduleName, slotName);
  }, [moduleName, slotName]);

  // `state` stays local to this rendering rather than being written to the slot: the same slot can
  // be rendered many times at once — once per row of a list — and each rendering has its own state,
  // so there is no single value the slot could hold. It is passed to `useAssignedExtensions`, which
  // resolves this rendering's display conditions against it.
  const extensions = useAssignedExtensions(slotName, state);

  return {
    extensions,
    extensionSlotName: slotName,
    extensionSlotModuleName: moduleName,
  };
}
