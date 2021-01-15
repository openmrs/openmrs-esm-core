export function openmrsFetch() {
  return new Promise(() => {});
}

let state;

function makeStore(state) {
  return {
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
}

export const createGlobalStore = jest.fn().mockImplementation((n, value) => {
  state = value;
  return makeStore(state);
});

export const getGlobalStore = jest
  .fn()
  .mockImplementation(() => makeStore(state));
