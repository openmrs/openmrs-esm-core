/** @module @category UI */
import { useContext, useEffect } from 'react';
import { type SetLeftNavParams, setLeftNav, unsetLeftNav } from '@openmrs/esm-extensions';
import { ComponentContext } from './ComponentContext';

/**
 * A React hook that registers a left navigation menu for the current component.
 * The navigation is automatically registered when the component mounts and
 * unregistered when it unmounts.
 *
 * **Important:** This hook should only be used in "page" components, not in
 * "extension" components. Extensions should not control the left navigation.
 *
 * @param params Configuration parameters for the left navigation, excluding the
 *   module name which is automatically determined from the component context.
 *
 * @example
 * ```tsx
 * import { useLeftNav } from '@openmrs/esm-framework';
 * function MyPageComponent() {
 *   useLeftNav({ name: 'my-nav', slots: ['nav-slot-1', 'nav-slot-2'] });
 *   return <div>My Page</div>;
 * }
 * ```
 */
export function useLeftNav(params: Omit<SetLeftNavParams, 'module'>) {
  const componentContext = useContext(ComponentContext);

  useEffect(() => {
    if (componentContext && componentContext.moduleName) {
      (params as SetLeftNavParams).componentContext = componentContext;
    }

    setLeftNav(params);

    return () => {
      unsetLeftNav(params.name);
    };
  }, [componentContext, params]);
}
