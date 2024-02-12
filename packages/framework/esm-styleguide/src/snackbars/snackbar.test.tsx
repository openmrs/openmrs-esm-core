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

    const { getByText } = render(<Snackbar {...snackbarProps} />);
    expect(getByText('Test Snackbar')).toBeInTheDocument();
  });

  it('calls closeSnackbar when the close button is clicked', () => {
    const snackbarProps = {
      snackbar: {
        id: 1,
        title: 'Test Snackbar',
      },
      closeSnackbar: closeSnackbarMock,
    };

    const { getByLabelText } = render(<Snackbar {...snackbarProps} />);
    fireEvent.click(getByLabelText('Close snackbar'));

    waitFor(() => expect(closeSnackbarMock).toHaveBeenCalled(), { timeout: 250 });
  });

  it('calls onActionButtonClick when the action button is clicked', async () => {
    const onActionButtonClickMock = jest.fn();
    const snackbarProps = {
      snackbar: {
        id: 1,
        title: 'Test Snackbar',
        actionButtonLabel: 'undo',
        onActionButtonClick: onActionButtonClickMock,
      },
      closeSnackbar: closeSnackbarMock,
    };

    render(<Snackbar {...snackbarProps} />);

    await user.click(screen.getByText('undo'));
    await waitFor(() => {
      expect(onActionButtonClickMock).toHaveBeenCalled();
    });
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
    await waitFor(() => {
      expect(closeSnackbarMock).toHaveBeenCalled();
    });
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
    await waitFor(() => {
      expect(closeSnackbarMock).not.toHaveBeenCalled();
    });
  });

  it('changes action text when action button is clicked', async () => {
    const progressActionLabel = 'Progress Action';
    const snackbarProps = {
      snackbar: {
        id: 1,
        title: 'Test Snackbar',
        actionButtonLabel: 'Undo',
        progressActionLabel: progressActionLabel,
      },
      closeSnackbar: closeSnackbarMock,
    };

    render(<Snackbar {...snackbarProps} />);
    await user.click(screen.getByText('Undo'));
    await waitFor(() => {
      expect(screen.getByText(progressActionLabel)).toBeInTheDocument();
    });
  });
});
