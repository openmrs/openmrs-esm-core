import { useContext, useEffect, useRef } from 'react';
import { type ExtensionSlotCustomState, registerExtensionSlot } from '@openmrs/esm-extensions';
import { ComponentContext } from './ComponentContext';
import { useAssignedExtensions } from './useAssignedExtensions';

/** @internal */
export function useExtensionSlot(slotName: string, state?: ExtensionSlotCustomState) {
  const { moduleName } = useContext(ComponentContext);

  if (!moduleName) {
    throw Error('ComponentContext has not been provided. This should come from @openmrs/esm-react-utils.');
  }

  // Callers almost always pass `state` as an object literal, so its identity changes every render
  // while its contents don't. Reading it from a ref keeps it out of the effect dependencies below.
  const stateRef = useRef(state);
  stateRef.current = state;

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
