export function openmrsFetch() {
  return new Promise(() => {});
}

let state;

export const createGlobalStore = jest.fn().mockImplementation((n, value) => {
  state = value;
});

export const getGlobalStore = jest.fn().mockImplementation(() => ({
  getState: () => state,
  setState: (val) => {
    state = { ...state, ...val };
  },
  subscribe: (updateFcn) => {
    updateFcn(state);
    return () => {};
  },
  unsubscribe: () => {},
}));
