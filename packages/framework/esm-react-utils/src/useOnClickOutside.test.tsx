import React, { type PropsWithChildren } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useOnClickOutside } from './useOnClickOutside';

describe('useOnClickOutside', () => {
  const handler: (e: Event) => void = vi.fn();

  it('should call the handler when clicking outside', async () => {
    const user = userEvent.setup();
    // setup
    const Component: React.FC<PropsWithChildren> = ({ children }) => {
      const ref = useOnClickOutside<HTMLDivElement>(handler);
      return <div ref={ref}>{children}</div>;
    };
    const view = render(<Component />);

    // act
    await user.click(view.container);

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
    const view = render(<Component />);
    const spy = vi.spyOn(window, 'removeEventListener');

    // act
    view.unmount();

    // verify
    expect(spy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(spy).toHaveBeenCalledWith('touchstart', expect.any(Function));
  });
});
