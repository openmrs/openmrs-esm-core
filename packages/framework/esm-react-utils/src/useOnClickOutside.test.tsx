import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";

import { render, fireEvent, screen } from "@testing-library/react";
import { useOnClickOutside } from "./useOnClickOutside";

describe("useOnClickOutside", () => {
  const handler = jest.fn();

  const ref = renderHook(() => useOnClickOutside(handler)) as unknown;

  test("should call handler() when clicking outside", async () => {
    expect(handler).not.toHaveBeenCalled();

    await act(async () => {
      render(<div ref={ref as React.MutableRefObject<HTMLDivElement>}></div>);
      fireEvent.mouseDown(document.body);
    });

    expect(handler).toHaveBeenCalledTimes(1);

    // Testing that "removeEventListener" works correctly
    // by ensuring that handler still be called once time.
    jest.spyOn(document, "removeEventListener");

    await act(async () => {
      ref.unmount();
    });

    expect(document.removeEventListener).toHaveBeenCalledTimes(1);

    await act(async () => {
      fireEvent.mouseDown(document.body);
    });
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
