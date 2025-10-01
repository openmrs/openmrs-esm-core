import { useContext, useEffect, useMemo, useRef } from 'react';
import {
  type ExtensionSlotCustomState,
  registerExtensionSlot,
  updateExtensionSlotState,
} from '@openmrs/esm-extensions';
import { ComponentContext } from './ComponentContext';
import { useAssignedExtensions } from './useAssignedExtensions';

/** @internal */
export function useExtensionSlot(slotName: string, state?: ExtensionSlotCustomState) {
  const { moduleName } = useContext(ComponentContext);
  const isInitialRender = useRef(true);
  const extensionState = useMemo(() => state, [state]);

  if (!moduleName) {
    throw Error('ComponentContext has not been provided. This should come from @openmrs/esm-react-utils.');
  }

  useEffect(() => {
    registerExtensionSlot(moduleName, slotName, extensionState);
    isInitialRender.current = false;
  }, []);

  useEffect(() => {
    if (!isInitialRender.current) {
      updateExtensionSlotState(slotName, extensionState);
    }
  }, [slotName, extensionState]);

  const extensions = useAssignedExtensions(slotName);

  return {
    extensions,
    extensionSlotName: slotName,
    extensionSlotModuleName: moduleName,
  };
}
