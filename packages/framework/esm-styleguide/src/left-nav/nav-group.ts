/** @module @category UI */
import { createGlobalStore } from '@openmrs/esm-state';
import { createUseStore } from '@openmrs/esm-react-utils';

export * from './generic-nav-group.component';

interface NavGroupStoreState {
  navGroups: string[];
}

const navGroupStore = createGlobalStore<NavGroupStoreState>('nav-groups', { navGroups: [] });

export function registerNavGroup(slotName: string) {
  const store = navGroupStore.getState();
  navGroupStore.setState({ navGroups: [slotName, ...store.navGroups] });
}

export const useNavGroups = createUseStore(navGroupStore);
