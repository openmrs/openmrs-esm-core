/** @vitest-environment jsdom */
import React from 'react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useConfig } from '@openmrs/esm-react-utils';
import { DiagnosisTags } from './diagnosis-tags.component';

const diagnoses = [
  { uuid: '1', display: 'Asthma', rank: 1, certainty: 'CONFIRMED' },
  { uuid: '2', display: 'Malaria', rank: 2, certainty: 'PROVISIONAL' },
  { uuid: '3', display: 'Anemia', rank: 2, certainty: 'UNKNOWN' },
];

beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  vi.mocked(useConfig).mockReturnValue({ diagnosisTags: { primaryColor: 'purple', secondaryColor: 'teal' } });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function mockTruncation() {
  vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(300);
  return vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(200);
}

test('preserves name-only display by default', () => {
  render(<DiagnosisTags diagnoses={diagnoses} />);
  expect(screen.getByText('Malaria')).toBeInTheDocument();
  expect(screen.queryByText('?')).not.toBeInTheDocument();
  expect(screen.queryByText(/provisional/i)).not.toBeInTheDocument();
});

test('marks only provisional diagnoses when enabled and preserves configured colours', () => {
  render(<DiagnosisTags diagnoses={diagnoses} showCertainty />);
  const [asthma, malaria, anemia] = screen.getAllByTestId('diagnosis-tag');
  expect(malaria).toHaveTextContent(/^\?Provisional Malaria$/);
  expect(asthma).toHaveTextContent(/^Asthma$/);
  expect(anemia).toHaveTextContent(/^Anemia$/);
  expect(screen.getAllByText('?')).toHaveLength(1);
  expect(asthma).toHaveClass('cds--tag--purple');
  expect(malaria).toHaveClass('cds--tag--teal');
});

test('defaults to blue for primary and gray for secondary diagnoses', () => {
  vi.mocked(useConfig).mockReturnValue({});
  render(<DiagnosisTags diagnoses={diagnoses} />);
  const [asthma, malaria] = screen.getAllByTestId('diagnosis-tag');
  expect(asthma).toHaveClass('cds--tag--blue');
  expect(malaria).toHaveClass('cds--tag--gray');
});

test('names a truncated provisional diagnosis as provisional for assistive technology', () => {
  mockTruncation();
  render(<DiagnosisTags diagnoses={[diagnoses[1]]} showCertainty />);
  // Browsers read this as "Provisional Malaria"; jsdom's name computation drops the space
  expect(screen.getByRole('button', { name: /^Provisional\s?Malaria$/ })).toBeInTheDocument();
});

test('reveals the full name on keyboard focus and dismisses it with Escape', async () => {
  mockTruncation();
  const user = userEvent.setup();
  render(<DiagnosisTags diagnoses={[diagnoses[0]]} showCertainty />);
  await user.tab();
  expect(screen.getByTestId('diagnosis-tag')).toHaveFocus();
  expect(screen.getAllByText('Asthma')).toHaveLength(2);
  await user.keyboard('{Escape}');
  expect(screen.getAllByText('Asthma')).toHaveLength(1);
  expect(screen.getByTestId('diagnosis-tag')).toHaveFocus();
});

test('allows moving onto the tooltip and dismisses a hover-open tooltip with Escape', async () => {
  mockTruncation();
  const user = userEvent.setup();
  render(<DiagnosisTags diagnoses={[diagnoses[0]]} showCertainty />);
  fireEvent.mouseMove(document.body);
  fireEvent.pointerMove(document.body, { pointerType: 'mouse' });
  fireEvent.pointerEnter(screen.getByTestId('diagnosis-tag'), { pointerType: 'mouse' });
  fireEvent.mouseEnter(screen.getByTestId('diagnosis-tag'));
  const tooltip = await screen.findByRole('tooltip');
  await user.hover(tooltip);
  expect(tooltip).toBeInTheDocument();
  fireEvent.keyDown(document.body, { key: 'Escape' });
  await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
});

test('opens the full name on activation without requiring certainty', async () => {
  mockTruncation();
  const user = userEvent.setup();
  render(<DiagnosisTags diagnoses={[diagnoses[0]]} />);
  await user.click(screen.getByRole('button', { name: 'Asthma' }));
  expect(await screen.findByRole('tooltip')).toHaveTextContent('Asthma');
  expect(screen.queryByText('?')).not.toBeInTheDocument();
});

test('short names have no tab stop or tooltip', async () => {
  const user = userEvent.setup();
  render(<DiagnosisTags diagnoses={[diagnoses[0]]} showCertainty />);
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
  await user.hover(screen.getByTestId('diagnosis-tag'));
  await user.tab();
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  expect(screen.getByTestId('diagnosis-tag')).not.toHaveFocus();
});

test('updates truncation after resizing and changing certainty', () => {
  const width = mockTruncation();
  let resize: () => void;
  const disconnect = vi.fn();
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(callback: () => void) {
        resize = callback;
      }
      observe() {}
      disconnect = disconnect;
    },
  );
  const { rerender, unmount } = render(<DiagnosisTags diagnoses={[diagnoses[1]]} showCertainty />);
  expect(screen.getByRole('button')).toBeInTheDocument();
  width.mockReturnValue(400);
  act(() => resize());
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
  width.mockReturnValue(200);
  rerender(<DiagnosisTags diagnoses={[diagnoses[1]]} />);
  expect(screen.getByRole('button')).toBeInTheDocument();
  unmount();
  expect(disconnect).toHaveBeenCalled();
});

test('keeps a resized pill focused until the user tabs away', async () => {
  const width = mockTruncation();
  let resize: () => void;
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(private callback: () => void) {}
      observe(element: Element) {
        if (element.classList.contains('cds--tag__label')) {
          resize = this.callback;
        }
      }
      unobserve() {}
      disconnect() {}
    },
  );
  const user = userEvent.setup();
  render(
    <>
      <DiagnosisTags diagnoses={[diagnoses[0]]} />
      <button>Next</button>
    </>,
  );
  await user.tab();
  const tag = screen.getByRole('button', { name: 'Asthma' });
  expect(tag).toHaveFocus();
  width.mockReturnValue(400);
  act(() => resize());
  expect(tag).toHaveFocus();
  await user.tab();
  expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
  expect(screen.queryByRole('button', { name: 'Asthma' })).not.toBeInTheDocument();
});
