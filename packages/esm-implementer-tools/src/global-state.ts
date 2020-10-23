import { createGlobalState } from "react-hooks-global-state";

type State = {
  configPathBeingEdited: null | string[];
};

const state: State = { configPathBeingEdited: null };

export const { useGlobalState } = createGlobalState(state);
