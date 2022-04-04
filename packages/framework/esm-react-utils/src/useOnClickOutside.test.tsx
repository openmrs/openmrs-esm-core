import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { useOnClickOutside } from "./useOnClickOutside";

describe("useOnClickOutside", () => {
  const handler: (e: Event) => void = jest.fn();
  afterEach(() => (handler as jest.Mock).mockClear());

  it("should call the handler when clicking outside", () => {
    // setup
    const Component: React.FC = ({ children }) => {
      const ref = useOnClickOutside<HTMLDivElement>(handler);
      return <div ref={ref}>{children}</div>;
    };
    const ref = render(<Component />);

    // act
    fireEvent.click(ref.container);

    // verify
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("should not call the handler when clicking on the element", () => {
    // setup
    const Component: React.FC = ({ children }) => {
      const ref = useOnClickOutside<HTMLDivElement>(handler);
      return <div ref={ref}>{children}</div>;
    };
    const mutableRef: { current: HTMLDivElement } = { current: undefined };
    render(
      <Component>
        <div ref={mutableRef}></div>
      </Component>
    );

    // act
    fireEvent.click(mutableRef.current);

    // verify
    expect(handler).not.toHaveBeenCalled();
  });

  it("should unregister the event listener when unmounted", () => {
    // setup
    const Component: React.FC = ({ children }) => {
      const ref = useOnClickOutside<HTMLDivElement>(handler);
      return <div ref={ref}>{children}</div>;
    };
    const ref = render(<Component />);
    const spy = jest.spyOn(window, "removeEventListener");

    // act
    ref.unmount();

    // verify
    expect(spy).toHaveBeenCalledWith("click", expect.any(Function));
  });
});
