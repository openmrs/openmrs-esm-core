import { act, renderHook } from "@testing-library/react";
import { createGlobalStore } from "@openmrs/esm-state";
import { useStore, useStoreWithActions } from "@openmrs/esm-react-utils";

describe("useStore", () => {
  it("updates state, selects, and correctly binds actions", () => {
    const store = createGlobalStore("scoreboard", {
      good: { count: 0 },
      evil: { count: 0 },
    });
    const actions = {
      tally: (state, team, number) => ({
        [team]: { count: state[team].count + number },
      }),
    };

    const { result } = renderHook(() =>
      useStore(store, (state) => state.good, actions)
    );

    expect(result.current.count).toBe(0);
    act(() => {
      result.current.tally("good", 2);
    });
    expect(result.current.count).toBe(2);
  });
});

describe("useStoreWithActions", () => {
  it("should correctly bind actions", () => {
    const store = createGlobalStore("counter", { count: 0 });
    const actions = {
      increment: (state) => ({ count: state.count + 1 }),
      incrementBy: (state, number) => ({ count: state.count + number }),
    };

    const { result } = renderHook(() => useStoreWithActions(store, actions));

    expect(result.current.count).toBe(0);
    act(() => {
      result.current.increment();
    });
    expect(store.getState().count).toBe(1);
    expect(result.current.count).toBe(1);
    act(() => {
      result.current.incrementBy(3);
    });
    expect(result.current.count).toBe(4);
  });
});
