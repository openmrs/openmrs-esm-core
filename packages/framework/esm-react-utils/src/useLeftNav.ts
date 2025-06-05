import { useContext, useEffect } from 'react';
import { type SetLeftNavParams, setLeftNav, unsetLeftNav } from '@openmrs/esm-extensions';
import { ComponentContext } from './ComponentContext';

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
