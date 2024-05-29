import React, { type PropsWithChildren } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useOnClickOutside } from './useOnClickOutside';

describe('useOnClickOutside', () => {
  const handler: (e: Event) => void = jest.fn();
  afterEach(() => (handler as jest.Mock).mockClear());

  it('should call the handler when clicking outside', async () => {
    const user = userEvent.setup();
    // setup
    const Component: React.FC<PropsWithChildren> = ({ children }) => {
      const ref = useOnClickOutside<HTMLDivElement>(handler);
      return <div ref={ref}>{children}</div>;
    };
    const ref = render(<Component />);

    // act
    await user.click(ref.container);

    // verify
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should not call the handler when clicking on the element', async () => {
    // setup
    const user = userEvent.setup();
    const Component: React.FC<PropsWithChildren> = ({ children }) => {
      const ref = useOnClickOutside<HTMLDivElement>(handler);
      return <div ref={ref}>{children}</div>;
    };
    const mutableRef: { current: HTMLDivElement | null } = { current: null };
    render(
      <Component>
        <div ref={mutableRef}></div>
      </Component>,
    );

    // act
    if (mutableRef.current) {
      await user.click(mutableRef.current);
    }

    // verify
    expect(handler).not.toHaveBeenCalled();
  });

  it('should unregister the event listener when unmounted', () => {
    // setup
    const Component: React.FC<PropsWithChildren> = ({ children }) => {
      const ref = useOnClickOutside<HTMLDivElement>(handler);
      return <div ref={ref}>{children}</div>;
    };
    const ref = render(<Component />);
    const spy = jest.spyOn(window, 'removeEventListener');

    // act
    ref.unmount();

    // verify
    expect(spy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(spy).toHaveBeenCalledWith('touchstart', expect.any(Function));
  });
});
