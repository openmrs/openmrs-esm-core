import { createGlobalStore } from './state';

export interface LeftNavStore {
  slotName: string | null;
  basePath: string;
}

/**
 * @internal
 */
export const leftNavStore = createGlobalStore<LeftNavStore>('left-nav', {
  slotName: null,
  basePath: window.spaBase,
});

export function setLeftNav({ name, basePath }) {
  leftNavStore.setState({ slotName: name, basePath });
}

export function unsetLeftNav(name) {
  if (leftNavStore.getState().slotName == name) {
    leftNavStore.setState({ slotName: null });
  }
}
