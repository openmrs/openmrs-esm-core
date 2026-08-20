import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VerificationCodeInput from './verification-code-input.component';

describe('VerificationCodeInput', () => {
  it('should render 6 number of input boxes', () => {
    render(<VerificationCodeInput length={6} onComplete={vi.fn()} />);

    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(6);
  });

  it('should advance focus to the next input box', async () => {
    const user = userEvent.setup();
    render(<VerificationCodeInput length={6} onComplete={vi.fn()} />);

    const inputs = screen.getAllByRole('textbox');
    const firstInput = inputs[0];
    const secondInput = inputs[1];

    await user.type(firstInput, '4');
    expect(firstInput).toHaveValue('4');
    expect(secondInput).toHaveFocus();
  });

  it('should ignore non-numeric characters', async () => {
    const user = userEvent.setup();
    render(<VerificationCodeInput length={6} onComplete={vi.fn()} />);

    const inputs = screen.getAllByRole('textbox');
    const firstInput = inputs[0];

    await user.type(firstInput, 'A');
    await user.type(firstInput, ' ');
    expect(firstInput).toHaveValue('');
    expect(firstInput).toHaveFocus();
  });

  it('should handle pasting a valid code', async () => {
    const user = userEvent.setup();
    const onCompleteMock = vi.fn();
    render(<VerificationCodeInput length={6} onComplete={onCompleteMock} />);

    const inputs = screen.getAllByRole('textbox');
    const firstInput = inputs[0];

    await user.click(firstInput);
    await user.paste('123456');
    expect(inputs[0]).toHaveValue('1');
    expect(inputs[5]).toHaveValue('6');
    expect(onCompleteMock).toHaveBeenCalledTimes(1);
    expect(onCompleteMock).toHaveBeenCalledWith('123456');
  });

  it('should allow arrow key navigations', async () => {
    const user = userEvent.setup();
    render(<VerificationCodeInput length={6} onComplete={vi.fn()} />);

    const inputs = screen.getAllByRole('textbox');
    const secondInput = inputs[1];
    const thirdInput = inputs[2];

    await user.click(secondInput);
    expect(secondInput).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(thirdInput).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(secondInput).toHaveFocus();
  });

  it('should clear previous box value and focus when backspace is pressed', async () => {
    const user = userEvent.setup();
    render(<VerificationCodeInput length={6} onComplete={vi.fn()} />);

    const inputs = screen.getAllByRole('textbox');
    const firstInput = inputs[0];
    const secondInput = inputs[1];

    await user.type(firstInput, '7');
    expect(firstInput).toHaveValue('7');
    expect(secondInput).toHaveFocus();
    await user.keyboard('{Backspace}');
    expect(firstInput).toHaveFocus();
    expect(firstInput).toHaveValue('7');
    await user.keyboard('{Backspace}');
    expect(firstInput).toHaveValue('');
  });
});
