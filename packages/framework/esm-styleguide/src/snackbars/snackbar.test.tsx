import React from 'react';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import { Snackbar } from './snackbar.component';

const mockCloseSnackbar = vi.fn();

describe('Snackbar component', () => {
  beforeAll(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
  afterEach(vi.runAllTimers);
  afterAll(vi.useRealTimers);

  it('renders a snackbar notification', () => {
    renderSnackbar();

    const snackbar = screen.getByRole('alertdialog', { name: /order submitted/i });
    const closeButton = screen.getByRole('button', { name: /close snackbar/i });
    expect(snackbar).toBeInTheDocument();
    expect(snackbar.classList).toContainEqual(expect.stringMatching('success'));
    expect(closeButton).toBeInTheDocument();
  });

  it('renders an error notification if kind is set to error', () => {
    renderSnackbar({
      snackbar: {
        kind: 'error',
        title: 'Error submitting order',
        subtitle: 'Error contacting lab system. Please try again later',
      },
    });

    const snackbar = screen.getByRole('alertdialog', { name: /error submitting order/i });
    expect(snackbar).toBeInTheDocument();
    expect(snackbar.classList).toContainEqual(expect.stringMatching('error'));
    expect(screen.getByRole('button', { name: /close snackbar/i })).toBeInTheDocument();
    expect(screen.getByText(/error contacting lab system. please try again later/i)).toBeInTheDocument();
  });

  it(
    'automatically dismisses the snackbar after a timeout if autoClose is set to true',
    { timeout: 2000 },
    async () => {
      renderSnackbar({
        snackbar: {
          autoClose: true,
          timeoutInMs: 500,
          title: 'Order submitted',
        },
      });

      const snackbar = screen.getByRole('alertdialog', { name: /order submitted/i });
      expect(snackbar).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(750);
      });

      await waitFor(() => expect(mockCloseSnackbar).toHaveBeenCalledTimes(1), { timeout: 200 });
    },
  );

  it('renders an actionable variant of the snackbar if actionButtonLabel is provided', () => {
    renderSnackbar({
      snackbar: {
        actionButtonLabel: 'Undo',
        title: 'Order submitted',
      },
    });

    const snackbar = screen.getByRole('alertdialog', { name: /order submitted/i });
    const actionButton = screen.getByRole('button', { name: /undo/i });
    expect(snackbar).toBeInTheDocument();
    expect(actionButton).toBeInTheDocument();
  });
});

function renderSnackbar(overrides = {}) {
  const testProps = {
    snackbar: {
      id: 1,
      autoClose: false,
      title: 'Order submitted',
    },
    closeSnackbar: mockCloseSnackbar,
  };

  render(<Snackbar {...testProps} {...overrides} />);
}
