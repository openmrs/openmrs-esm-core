export const getIsUIEditorEnabled = (): boolean => true;

export const setIsUIEditorEnabled = (boolean): void => {};

let state = { slots: {}, extensions: {} };

export const extensionStore = {
  getState: () => state,
  setState: (val) => {
    state = { ...state, ...val };
  },
  subscribe: (updateFcn) => {
    updateFcn(state);
    return () => {};
  },
  unsubscribe: () => {},
};
