import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { useOnClickOutside } from "./useOnClickOutside";

describe("useOnClickOutside", () => {
  const handler = jest.fn();
  const ref = useOnClickOutside<HTMLDivElement>(handler);
  const activeRef = useOnClickOutside<HTMLDivElement>(handler, false);
  const buttonText = "Button Text";
  const children = <button type="button">{buttonText}</button>;

  it("should call handler() when clicking outside", () => {
    render(<div ref={ref}></div>);
    fireEvent.mouseDown(document.body);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("should NOT call handler() when clicking inside", () => {
    render(<div ref={ref}>{children}</div>);
    fireEvent.mouseDown(screen.getByText("Button Text"));
    expect(handler).not.toHaveBeenCalled();
  });

  it("should NOT call handler() when active is false", () => {
    render(<div ref={activeRef}>{children}</div>);
    fireEvent.mouseDown(screen.getByText("Button Text"));
    expect(handler).not.toHaveBeenCalled();
  });
});
