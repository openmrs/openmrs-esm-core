import React, { Profiler } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import {
  disableTranslationInspector,
  enableTranslationInspector,
  matchTranslations,
  type TranslationSighting,
} from '@openmrs/esm-framework/src/internal';
import { implementerToolsStore } from '../store';
import TranslationInspector, { getCardPosition } from './translation-inspector';

const rect = (top: number, height: number, left = 0) => ({ top, bottom: top + height, left }) as DOMRect;

describe('getCardPosition', () => {
  beforeEach(() => {
    Object.assign(window, { innerHeight: 900, innerWidth: 1400 });
  });

  it('places the card below an element with room beneath it', () => {
    expect(getCardPosition(rect(100, 20))).toEqual({ top: 120, left: 0 });
  });

  it('places the card above an element near the bottom of the screen', () => {
    expect(getCardPosition(rect(800, 20))).toEqual({ bottom: 100, left: 0 });
  });

  it('keeps the card on screen for an element too tall for either', () => {
    // The left nav: from just under the header to the bottom of the screen.
    expect(getCardPosition(rect(48, 852))).toEqual({ top: 52, left: 0 });
    expect(getCardPosition(rect(-200, 1200))).toEqual({ top: 4, left: 0 });
  });

  it('keeps the card inside the right edge', () => {
    expect(getCardPosition(rect(100, 20, 1300))).toEqual({ top: 120, left: 1080 });
  });
});

describe('TranslationInspector', () => {
  const loginButton: TranslationSighting = {
    namespace: '@openmrs/esm-login-app',
    key: 'loginButton',
    value: 'Log in',
    hasCount: false,
  };
  let underPointer: Element | null = null;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(matchTranslations).mockImplementation((text: string) => (text.trim() === 'Log in' ? [loginButton] : []));
    document.elementFromPoint = vi.fn(() => underPointer);
  });

  afterEach(() => {
    vi.useRealTimers();
    underPointer = null;
  });

  /** Moves the pointer onto an element, past the inspector's throttle. */
  function hover(element: Element) {
    underPointer = element;
    act(() => vi.advanceTimersByTime(200));
    fireEvent.mouseMove(document, { clientX: 1, clientY: 1 });
  }

  it('records only while it is mounted', () => {
    const { unmount } = render(<TranslationInspector />);
    expect(enableTranslationInspector).toHaveBeenCalled();

    unmount();
    expect(disableTranslationInspector).toHaveBeenCalled();
  });

  it('keeps the card while the pointer is on it, so that its buttons can be used', () => {
    const app = document.createElement('button');
    app.textContent = 'Log in';
    document.body.appendChild(app);

    render(<TranslationInspector />);

    hover(app);
    expect(screen.getByText('loginButton')).toBeInTheDocument();

    // Text the card itself shows is not a translation, so retargeting onto it would close the card.
    hover(screen.getByText('loginButton'));
    const showInTranslations = screen.getByRole('button', { name: /show in translations/i });

    fireEvent.click(showInTranslations);

    expect(implementerToolsStore.getState()).toMatchObject({
      isOpen: true,
      openTab: 'translations',
      selectedTranslation: { namespace: '@openmrs/esm-login-app', key: 'loginButton', value: 'Log in' },
    });
    app.remove();
  });

  it('keeps the card while the pointer crosses from the element onto it', () => {
    const app = document.createElement('button');
    app.textContent = 'Log in';
    document.body.appendChild(app);
    const appRect = { top: 100, bottom: 120, left: 0, right: 100, width: 100, height: 20 } as DOMRect;
    app.getBoundingClientRect = () => appRect;
    const cardTop = getCardPosition(appRect).top as number;
    // Whatever is under each point: the element, then the card below it, with the page in between.
    document.elementFromPoint = vi.fn((_x: number, y: number) =>
      y < appRect.bottom ? app : y >= cardTop ? (screen.queryByText('loginButton') ?? document.body) : document.body,
    );

    render(<TranslationInspector />);

    for (let y = 110; y <= cardTop + 5; y++) {
      act(() => vi.advanceTimersByTime(200));
      fireEvent.mouseMove(document, { clientX: 10, clientY: y });
    }

    expect(screen.getByText('loginButton')).toBeInTheDocument();
    app.remove();
  });

  it('retargets when content scrolls under a still pointer', () => {
    const app = document.createElement('button');
    app.textContent = 'Log in';
    const scroller = document.createElement('div');
    scroller.appendChild(app);
    document.body.appendChild(scroller);

    render(<TranslationInspector />);

    hover(app);
    expect(screen.getByText('loginButton')).toBeInTheDocument();

    // The button scrolls away inside its container, leaving untranslated content under the pointer.
    underPointer = document.body;
    act(() => vi.advanceTimersByTime(200));
    fireEvent.scroll(scroller);

    expect(screen.queryByText('loginButton')).not.toBeInTheDocument();
    scroller.remove();
  });

  it('offers a way out even when nothing is hovered', () => {
    implementerToolsStore.setState({ isTranslationInspectorEnabled: true });
    render(<TranslationInspector />);

    fireEvent.click(screen.getByRole('button', { name: /exit translation inspector/i }));

    expect(implementerToolsStore.getState().isTranslationInspectorEnabled).toBe(false);
  });

  it('does not re-render while the pointer rests on the same text', () => {
    const app = document.createElement('button');
    app.textContent = 'Log in';
    document.body.appendChild(app);
    const onRender = vi.fn();

    render(
      <Profiler id="inspector" onRender={onRender}>
        <TranslationInspector />
      </Profiler>,
    );

    // React may render once more before it starts bailing out of an unchanged state.
    hover(app);
    hover(app);
    const renders = onRender.mock.calls.length;

    for (let sample = 0; sample < 5; sample++) {
      hover(app);
    }

    expect(onRender).toHaveBeenCalledTimes(renders);
    app.remove();
  });

  it('follows the element when it scrolls but stays under the pointer', () => {
    const app = document.createElement('button');
    app.textContent = 'Log in';
    document.body.appendChild(app);
    let top = 100;
    app.getBoundingClientRect = () =>
      ({ top, bottom: top + 20, left: 0, right: 100, width: 100, height: 20 }) as DOMRect;

    const { container } = render(<TranslationInspector />);
    hover(app);

    top = 90;
    act(() => vi.advanceTimersByTime(200));
    fireEvent.scroll(document);

    // The highlight is decoration, with no role to query it by.
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(container.querySelector<HTMLElement>('[style*="height"]')?.style.top).toBe('90px');
    app.remove();
  });
});
