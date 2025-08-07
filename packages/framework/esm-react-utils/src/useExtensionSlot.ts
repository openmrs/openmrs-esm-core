import { useContext, useEffect } from 'react';
import { type ExtensionSlotCustomState, registerExtensionSlot, setExtensionSlotState } from '@openmrs/esm-extensions';
import { ComponentContext } from './ComponentContext';
import { useAssignedExtensions } from './useAssignedExtensions';

/** @internal */
export function useExtensionSlot(slotName: string, state?: ExtensionSlotCustomState) {
  const { moduleName } = useContext(ComponentContext);

  if (!moduleName) {
    throw Error('ComponentContext has not been provided. This should come from @openmrs/esm-react-utils.');
  }

  useEffect(() => {
    registerExtensionSlot(moduleName, slotName, state);
  }, []);

  useEffect(() => {
    if (state) {
      setExtensionSlotState(slotName, state);
    }
  }, [slotName, state]);

  const extensions = useAssignedExtensions(slotName);

  return {
    extensions,
    extensionSlotName: slotName,
    extensionSlotModuleName: moduleName,
  };
}
