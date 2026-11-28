import React from 'react';
import { afterEach, beforeAll, beforeEach, describe, expect, it, onTestFinished, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { configInternalStore, useStore } from '@openmrs/esm-framework/src/internal';
import { implementerToolsStore } from '../store';
import UiEditor from './ui-editor';

vi.mock('@openmrs/esm-framework/src/internal', async (importOriginal) => {
  const renderings = new Map([
    [
      'patient-header-slot/patient-banner-0',
      {
        renderingId: 'patient-header-slot/patient-banner-0',
        extensionName: 'patient-banner',
        extensionModuleName: '@openmrs/esm-patient-banner-app',
        extensionId: 'patient-banner',
        slotName: 'patient-header-slot',
        slotModuleName: '@openmrs/esm-patient-chart-app',
      },
    ],
    [
      'patient-banner-tags-slot/deceased-tag-1',
      {
        renderingId: 'patient-banner-tags-slot/deceased-tag-1',
        extensionName: 'deceased-tag',
        extensionModuleName: '@openmrs/esm-patient-banner-app',
        extensionId: 'deceased-tag',
        slotName: 'patient-banner-tags-slot',
        slotModuleName: '@openmrs/esm-patient-banner-app',
      },
    ],
    ...[0, 1].map(
      (row) =>
        [
          `visit-row-actions-slot/edit-visit-${row}`,
          {
            renderingId: `visit-row-actions-slot/edit-visit-${row}`,
            extensionName: 'edit-visit',
            extensionModuleName: '@openmrs/esm-patient-chart-app',
            extensionId: 'edit-visit',
            slotName: 'visit-row-actions-slot',
            slotModuleName: '@openmrs/esm-patient-chart-app',
          },
        ] as const,
    ),
  ]);

  return {
    ...(await importOriginal<object>()),
    getExtensionRenderingsStore: () => ({ getState: () => ({ renderings }) }),
  };
});

function FakePage() {
  return (
    <div
      data-extension-slot-name="patient-header-slot"
      data-extension-slot-module-name="@openmrs/esm-patient-chart-app"
    >
      <div data-extension-id="patient-banner" data-extension-rendering-id="patient-header-slot/patient-banner-0">
        <a href="#chart">Joshua Johnson</a>
        <div
          data-extension-slot-name="patient-banner-tags-slot"
          data-extension-slot-module-name="@openmrs/esm-patient-banner-app"
        >
          <div
            data-extension-id="deceased-tag"
            data-extension-rendering-id="patient-banner-tags-slot/deceased-tag-1"
            data-testid="deceased-tag"
          >
            <span>Deceased</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** A list that renders the same slot, and so the same extension, once per row. */
function VisitList({ rows = [0, 1] }: { rows?: Array<number> }) {
  return (
    <ul>
      {rows.map((row) => (
        <li key={row}>
          <div
            data-extension-slot-name="visit-row-actions-slot"
            data-extension-slot-module-name="@openmrs/esm-patient-chart-app"
          >
            <div
              data-extension-id="edit-visit"
              data-extension-rendering-id={`visit-row-actions-slot/edit-visit-${row}`}
              data-testid={`edit-visit-${row}`}
            >
              <button type="button">Edit visit {row}</button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

/**
 * Moves the pointer over `element`, which is all the editor sees of a hover. The pointer stays
 * there for later lookups, so a test that clicks in an unpinned card first moves the pointer onto
 * it with `hover(getCard)`; passing the function finds the card as it is when the lookup happens.
 */
async function hover(element: Element | (() => Element)) {
  document.elementFromPoint = vi.fn(typeof element === 'function' ? element : () => element);
  fireEvent.mouseMove(document, { clientX: 1, clientY: 1 });
  // Pointer lookups are throttled.
  await act(() => new Promise((resolve) => setTimeout(resolve, 60)));
}

function renderUiEditor() {
  render(
    <>
      <FakePage />
      <div data-openmrs-implementer-tools>
        <UiEditor />
      </div>
    </>,
  );
}

function getCard() {
  return screen.getByRole('dialog');
}

describe('UiEditor', () => {
  beforeAll(async () => {
    // A real instance, so that interpolated and plural default values render as they do in the app.
    // Its own instance: the default one is shared with the framework, which reacts to its events.
    await i18next
      .createInstance()
      .use(initReactI18next)
      .init({ lng: 'en', resources: {}, interpolation: { escapeValue: false } });
  });

  beforeEach(() => {
    implementerToolsStore.setState({ isOpen: false, isUIEditorEnabled: true, uiSelectedPath: null });
    configInternalStore.setState({ schemas: {} });
  });

  afterEach(() => {
    // happy-dom has no elementFromPoint; each test installs its own.
    delete (document as Partial<Document>).elementFromPoint;
  });

  it('describes the extension under the pointer and the slot it is in', async () => {
    renderUiEditor();
    await hover(screen.getByText('Deceased'));

    const card = getCard();
    expect(within(card).getByText('deceased-tag')).toBeInTheDocument();
    expect(within(card).getByText('From @openmrs/esm-patient-banner-app')).toBeInTheDocument();
    expect(within(card).getByText('Slot from @openmrs/esm-patient-banner-app')).toBeInTheDocument();
    expect(within(card).getByRole('button', { name: 'patient-header-slot' })).toBeInTheDocument();
    expect(within(card).getByText('Alt+click to pin')).toBeInTheDocument();
  });

  it('pins on Alt+click, without the click reaching the application, and releases on a second one', async () => {
    renderUiEditor();
    const link = screen.getByText('Joshua Johnson');
    const reachedApplication = vi.fn();
    link.addEventListener('click', reachedApplication);

    await hover(link);
    fireEvent.click(link, { altKey: true });

    expect(reachedApplication).not.toHaveBeenCalled();
    expect(within(getCard()).getByText(/Pinned/)).toBeInTheDocument();

    await hover(screen.getByText('Deceased'));
    expect(within(getCard()).getByText('patient-banner')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Deceased'), { altKey: true });
    expect(within(getCard()).getByText('deceased-tag')).toBeInTheDocument();
    expect(within(getCard()).getByText('Alt+click to pin')).toBeInTheDocument();
  });

  it('leaves plain clicks to the application', async () => {
    renderUiEditor();
    const link = screen.getByText('Joshua Johnson');
    const reachedApplication = vi.fn();
    link.addEventListener('click', reachedApplication);

    await hover(link);
    fireEvent.click(link);

    expect(reachedApplication).toHaveBeenCalled();
    expect(within(getCard()).getByText('Alt+click to pin')).toBeInTheDocument();
  });

  it("changes an unpinned card's target from inside it without pinning it", async () => {
    renderUiEditor();
    const user = userEvent.setup();
    await hover(screen.getByText('Deceased'));

    await hover(getCard);
    await user.click(within(getCard()).getByRole('button', { name: 'patient-banner-tags-slot' }));
    await user.click(within(getCard()).getByRole('button', { name: 'Configure this slot' }));

    expect(within(getCard()).getByText('patient-banner-tags-slot', { selector: 'span' })).toBeInTheDocument();
    expect(within(getCard()).getByText('Alt+click to pin')).toBeInTheDocument();
  });

  it('pins and releases a target reached from inside the card on Alt+click on the card', async () => {
    renderUiEditor();
    const user = userEvent.setup();
    await hover(screen.getByText('Deceased'));
    await hover(getCard);
    await user.click(within(getCard()).getByRole('button', { name: 'patient-banner-tags-slot' }));

    fireEvent.click(getCard(), { altKey: true });

    expect(within(getCard()).getByText('patient-banner-tags-slot', { selector: 'span' })).toBeInTheDocument();
    expect(within(getCard()).getByText(/Pinned/)).toBeInTheDocument();

    fireEvent.click(getCard(), { altKey: true });

    expect(within(getCard()).getByText('Alt+click to pin')).toBeInTheDocument();
  });

  it('closes a pinned card on Escape', async () => {
    renderUiEditor();
    fireEvent.click(screen.getByText('Deceased'), { altKey: true });
    expect(getCard()).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it("moves to one of a slot's extensions from its list", async () => {
    renderUiEditor();
    const user = userEvent.setup();
    fireEvent.click(screen.getByText('Deceased'), { altKey: true });

    await user.click(within(getCard()).getByRole('button', { name: 'patient-banner' }));
    await user.click(within(getCard()).getByRole('button', { name: /1 slot/ }));
    await user.click(within(getCard()).getByRole('button', { name: /patient-banner-tags-slot/ }));
    await user.click(within(getCard()).getByRole('button', { name: /1 extension/ }));
    await user.click(within(getCard()).getByRole('button', { name: /^deceased-tag/ }));

    expect(within(getCard()).getByText('deceased-tag')).toBeInTheDocument();
  });

  it('stops outlining a list item once the pointer moves off it', async () => {
    renderUiEditor();
    const user = userEvent.setup();
    fireEvent.click(screen.getByText('Deceased'), { altKey: true });
    await user.click(within(getCard()).getByRole('button', { name: 'patient-banner' }));
    await user.click(within(getCard()).getByRole('button', { name: /1 slot/ }));

    const item = within(getCard()).getByRole('button', { name: /patient-banner-tags-slot/ });
    const title = within(getCard()).getByText('patient-banner', { selector: 'span' });
    fireEvent.mouseOver(item);
    expect(queryHighlight('patient-banner-tags-slot')).toBeInTheDocument();

    // Moves from the item to the title without leaving the card.
    fireEvent.mouseOut(item, { relatedTarget: title });
    fireEvent.mouseOver(title, { relatedTarget: item });
    expect(queryHighlight('patient-banner-tags-slot')).not.toBeInTheDocument();
  });

  it('stops outlining a list item when the list closes', async () => {
    renderUiEditor();
    const user = userEvent.setup();
    fireEvent.click(screen.getByText('Deceased'), { altKey: true });
    await user.click(within(getCard()).getByRole('button', { name: 'patient-banner' }));
    const listToggle = within(getCard()).getByRole('button', { name: /1 slot/ });
    await user.click(listToggle);

    fireEvent.mouseOver(within(getCard()).getByRole('button', { name: /patient-banner-tags-slot/ }));
    expect(queryHighlight('patient-banner-tags-slot')).toBeInTheDocument();
    fireEvent.click(listToggle);

    expect(queryHighlight('patient-banner-tags-slot')).not.toBeInTheDocument();
  });

  it("opens an extension instance's config in the Configuration tab", async () => {
    renderUiEditor();
    const user = userEvent.setup();
    fireEvent.click(screen.getByText('Deceased'), { altKey: true });

    await user.click(within(getCard()).getByRole('button', { name: 'Configure this extension instance' }));
    await user.click(within(getCard()).getByRole('button', { name: 'Open in Configuration' }));

    expect(implementerToolsStore.getState()).toMatchObject({
      isOpen: true,
      openTab: 'configuration',
      isJsonModeEnabled: false,
      uiSelectedPath: [
        '@openmrs/esm-patient-banner-app',
        'extensionSlots',
        'patient-banner-tags-slot',
        'configure',
        'deceased-tag',
      ],
    });
  });

  it("points an extension without a schema of its own at its module's config, and warns", async () => {
    renderUiEditor();
    const user = userEvent.setup();
    fireEvent.click(screen.getByText('Deceased'), { altKey: true });

    await user.click(within(getCard()).getByRole('button', { name: 'Configure this extension' }));

    expect(within(getCard()).getByText(/apply to everything in @openmrs\/esm-patient-banner-app/)).toBeInTheDocument();
    expect(within(getCard()).getByText('@openmrs/esm-patient-banner-app')).toBeInTheDocument();
  });

  it('points an extension with its own schema at that schema', async () => {
    renderUiEditor();
    const user = userEvent.setup();
    act(() => configInternalStore.setState({ schemas: { 'deceased-tag': {} } }));
    fireEvent.click(screen.getByText('Deceased'), { altKey: true });

    await user.click(within(getCard()).getByRole('button', { name: 'Configure this extension' }));
    await user.click(within(getCard()).getByRole('button', { name: 'Open in Configuration' }));

    expect(implementerToolsStore.getState().uiSelectedPath).toEqual(['deceased-tag']);
  });

  it('follows the pointer from one row to the same extension in the next row', async () => {
    render(
      <>
        <VisitList />
        <div data-openmrs-implementer-tools>
          <UiEditor />
        </div>
      </>,
    );
    placeAt(screen.getByTestId('edit-visit-0'), 100);
    placeAt(screen.getByTestId('edit-visit-1'), 300);

    await hover(screen.getByText('Edit visit 0'));
    expect(getHighlight('edit-visit')).toHaveStyle({ top: '100px' });

    await hover(screen.getByText('Edit visit 1'));
    expect(getHighlight('edit-visit')).toHaveStyle({ top: '300px' });
  });

  it('keeps describing the row under the pointer when another copy of it leaves the page', async () => {
    const page = (rows?: Array<number>) => (
      <>
        <VisitList rows={rows} />
        <div data-openmrs-implementer-tools>
          <UiEditor />
        </div>
      </>
    );
    const { rerender } = render(page());

    await hover(screen.getByText('Edit visit 0'));
    await hover(screen.getByText('Edit visit 1'));
    rerender(page([1]));
    // A layout change re-renders the editor, which then checks that its target is still there.
    fireEvent(window, new Event('resize'));
    await act(() => new Promise((resolve) => setTimeout(resolve, 50)));

    expect(within(getCard()).getByText('edit-visit')).toBeInTheDocument();
  });

  it('closes a pinned card when its target leaves the page', async () => {
    // A separate root, as the application is: it unmounting the page does not re-render the editor.
    const { unmount: leavePage } = render(<FakePage />);
    render(
      <div data-openmrs-implementer-tools>
        <UiEditor />
      </div>,
    );
    fireEvent.click(screen.getByText('Deceased'), { altKey: true });
    expect(getCard()).toBeInTheDocument();

    leavePage();
    await hover(document.body);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('leaves the page alone while a card is open and nothing changes', async () => {
    renderUiEditor();
    fireEvent.click(screen.getByText('Deceased'), { altKey: true });
    // One layout change, which re-renders the editor once.
    fireEvent(window, new Event('resize'));
    await act(() => new Promise((resolve) => setTimeout(resolve, 50)));

    let mutations = 0;
    const observer = new MutationObserver((records) => (mutations += records.length));
    observer.observe(document.body, { childList: true, subtree: true });
    onTestFinished(() => observer.disconnect());
    await act(() => new Promise((resolve) => setTimeout(resolve, 200)));

    expect(mutations).toBe(0);
  });

  it('follows a pinned target that moves without the page changing', async () => {
    renderUiEditor();
    const tag = screen.getByTestId('deceased-tag');
    placeAt(tag, 100);
    fireEvent.click(screen.getByText('Deceased'), { altKey: true });
    await act(() => new Promise((resolve) => setTimeout(resolve, 50)));
    expect(getCard()).toHaveStyle({ top: '140px' });

    // As when an image loading above it pushes it down.
    placeAt(tag, 300);
    await act(() => new Promise((resolve) => setTimeout(resolve, 50)));

    expect(getCard()).toHaveStyle({ top: '340px' });
    expect(getHighlight('deceased-tag')).toHaveStyle({ top: '300px' });
  });

  it('keeps a pinned card when Escape is used inside the implementer tools panel', () => {
    render(
      <>
        <FakePage />
        <div data-openmrs-implementer-tools>
          <div data-openmrs-implementer-tools-panel>
            <input aria-label="Config value" />
          </div>
          <UiEditor />
        </div>
      </>,
    );
    fireEvent.click(screen.getByText('Deceased'), { altKey: true });

    // The Configuration tab's value editor and module accordion both close on Escape.
    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Config value' }), { key: 'Escape' });

    expect(getCard()).toBeInTheDocument();
  });

  it('keeps a card moved from inside it above the implementer tools panel when that opens', async () => {
    renderUiEditor();
    const user = userEvent.setup();
    await hover(screen.getByText('Deceased'));
    getCard().getBoundingClientRect = () => rect(600, 100, 300, 200);
    await hover(getCard);
    await user.click(within(getCard()).getByRole('button', { name: 'patient-banner-tags-slot' }));
    expect(getCard()).toHaveStyle({ top: '600px' });

    const panelTop = window.innerHeight / 2;
    const panel = document.createElement('div');
    panel.setAttribute('data-openmrs-implementer-tools-panel', '');
    panel.getBoundingClientRect = () => rect(panelTop, 0, window.innerWidth, window.innerHeight - panelTop);
    document.body.appendChild(panel);
    onTestFinished(() => panel.remove());
    fireEvent(window, new Event('resize'));
    await act(() => new Promise((resolve) => setTimeout(resolve, 50)));

    expect(parseFloat(getCard().style.top)).toBeLessThan(panelTop);
    expect(parseFloat(getCard().style.maxHeight)).toBeGreaterThan(0);
  });

  it('fits a pinned card above the panel that "Open in Configuration" opens', async () => {
    const user = userEvent.setup();
    const panelTop = 400;
    /** Stands in for the lazily loaded popup, which carries the panel attribute. */
    function Panel() {
      const { isOpen } = useStore(implementerToolsStore);
      return isOpen ? (
        <div
          data-openmrs-implementer-tools-panel
          ref={(element) => {
            if (element) {
              element.getBoundingClientRect = () => rect(panelTop, 0, 1024, 368);
            }
          }}
        />
      ) : null;
    }
    render(
      <>
        <FakePage />
        <div data-openmrs-implementer-tools>
          <UiEditor />
          <Panel />
        </div>
      </>,
    );
    placeAt(screen.getByTestId('deceased-tag'), 100);

    fireEvent.click(screen.getByText('Deceased'), { altKey: true });
    await user.click(within(getCard()).getByRole('button', { name: 'Configure this slot' }));
    const cardTop = parseFloat(getCard().style.top);
    await user.click(within(getCard()).getByRole('button', { name: 'Open in Configuration' }));
    await act(() => new Promise((resolve) => setTimeout(resolve, 60)));

    // The bounds keep an 8px margin from the panel.
    expect(getCard()).toHaveStyle({ maxHeight: `${panelTop - 8 - cardTop}px` });
  });

  it('offers no extension-wide config for an extension whose module is unknown, but still its instance and slot', async () => {
    render(
      <>
        <div
          data-extension-slot-name="visit-row-actions-slot"
          data-extension-slot-module-name="@openmrs/esm-patient-chart-app"
        >
          <div data-extension-id="old-tag" data-extension-rendering-id="visit-row-actions-slot/old-tag-9">
            <span>Old tag</span>
          </div>
        </div>
        <div data-openmrs-implementer-tools>
          <UiEditor />
        </div>
      </>,
    );

    await hover(screen.getByText('Old tag'));

    expect(within(getCard()).queryByRole('button', { name: 'Configure this extension' })).not.toBeInTheDocument();
    expect(within(getCard()).getByRole('button', { name: 'Configure this extension instance' })).toBeInTheDocument();
    expect(within(getCard()).getByRole('button', { name: 'Configure this slot' })).toBeInTheDocument();
  });
});

function placeAt(element: Element, top: number) {
  element.getBoundingClientRect = () =>
    ({ top, left: 10, width: 200, height: 40, right: 210, bottom: top + 40, x: 10, y: top }) as DOMRect;
}

/** The outline drawn on the page, found by its name tag. */
function getHighlight(name: string) {
  return screen.getAllByText(name, { selector: 'span' }).find((label) => !label.closest('[role="dialog"]'))!
    .parentElement!;
}

/** Like `getHighlight`, but also finds the outline of an empty target, whose tag says so. */
function queryHighlight(name: string) {
  return (
    screen
      .queryAllByText((text) => text === name || text === `${name} · empty`, { selector: 'span' })
      .find((label) => !label.closest('[role="dialog"]'))?.parentElement ?? null
  );
}

function rect(top: number, left: number, width: number, height: number) {
  return { top, left, width, height, right: left + width, bottom: top + height, x: left, y: top } as DOMRect;
}
