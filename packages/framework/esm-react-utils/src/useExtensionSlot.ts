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

  // `state` must be local to the rendering rather than written to the store as state is
  // render-specific
  const extensions = useAssignedExtensions(slotName, state);

  return {
    extensions,
    extensionSlotName: slotName,
    extensionSlotModuleName: moduleName,
  };
}
