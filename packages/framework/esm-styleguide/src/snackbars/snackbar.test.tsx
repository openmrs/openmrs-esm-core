import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { Snackbar } from './snackbar.component';
import userEvent from '@testing-library/user-event';

describe('Snackbar component', () => {
  const closeSnackbarMock = jest.fn();
  const user = userEvent.setup();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the snackbar with default props', () => {
    const snackbarProps = {
      snackbar: {
        id: 1,
        title: 'Test Snackbar',
      },
      closeSnackbar: closeSnackbarMock,
    };

    render(<Snackbar {...snackbarProps} />);
    expect(screen.getByText('Test Snackbar')).toBeInTheDocument();
  });

  it('calls closeSnackbar when the close button is clicked', async () => {
    const snackbarProps = {
      snackbar: {
        id: 1,
        title: 'Test Snackbar',
      },
      closeSnackbar: closeSnackbarMock,
    };

    render(<Snackbar {...snackbarProps} />);

    await user.click(screen.getByLabelText('Close snackbar'));
    await waitFor(() => expect(closeSnackbarMock).toHaveBeenCalled());
  });

  it('calls onActionButtonClick when the action button is clicked', async () => {
    const onActionButtonClickMock = jest.fn();
    const snackbarProps = {
      snackbar: {
        id: 1,
        title: 'Test Snackbar',
        actionButtonLabel: 'Undo',
        onActionButtonClick: onActionButtonClickMock,
      },
      closeSnackbar: closeSnackbarMock,
    };

    render(<Snackbar {...snackbarProps} />);

    await user.click(screen.getByText('Undo'));
    expect(onActionButtonClickMock).toHaveBeenCalled();
  });

  it('closes the snackbar after a timeout if autoClose is true', async () => {
    jest.useFakeTimers();
    const snackbarProps = {
      snackbar: {
        id: 1,
        title: 'Test Snackbar',
        autoClose: true,
        timeoutInMs: 5000,
      },
      closeSnackbar: closeSnackbarMock,
    };

    render(<Snackbar {...snackbarProps} />);
    jest.advanceTimersByTime(5000);
    await waitFor(() => expect(closeSnackbarMock).toHaveBeenCalled());
  });

  it('does not close the snackbar after a timeout if autoClose is false', async () => {
    jest.useFakeTimers();
    const snackbarProps = {
      snackbar: {
        id: 1,
        title: 'Test Snackbar',
        kind: 'error',
      },
      closeSnackbar: closeSnackbarMock,
    };

    render(<Snackbar {...snackbarProps} />);
    jest.advanceTimersByTime(5000);
    expect(closeSnackbarMock).not.toHaveBeenCalled();
  });
});
