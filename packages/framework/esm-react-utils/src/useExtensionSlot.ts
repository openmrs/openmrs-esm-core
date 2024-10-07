import { useContext, useEffect } from 'react';
import { registerExtensionSlot } from '@openmrs/esm-extensions';
import { ComponentContext } from './ComponentContext';
import { useAssignedExtensions } from './useAssignedExtensions';

/** @internal */
export function useExtensionSlot(slotName: string) {
  const { moduleName } = useContext(ComponentContext);

  if (!moduleName) {
    throw Error('ComponentContext has not been provided. This should come from @openmrs/esm-react-utils.');
  }

  useEffect(() => {
    registerExtensionSlot(moduleName, slotName);
  }, []);

  const extensions = useAssignedExtensions(slotName);

  return {
    extensions,
    extensionSlotName: slotName,
    extensionSlotModuleName: moduleName,
  };
}
