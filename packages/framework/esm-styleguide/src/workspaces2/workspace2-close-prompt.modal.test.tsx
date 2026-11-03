import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Workspace2ClosePromptModal from './workspace2-close-prompt.modal';

vi.mock('react-i18next', () => ({
  Trans: ({
    defaults,
    values,
    components,
  }: {
    defaults: string;
    values?: Record<string, string>;
    components?: Record<string, React.ReactElement>;
  }) => {
    let text = defaults;
    for (const [key, value] of Object.entries(values ?? {})) {
      text = text.replaceAll(`{{${key}}}`, value);
    }
    const parts = text.split(/<strong>(.*?)<\/strong>/);
    return (
      <>{parts.map((part, i) => (i % 2 === 1 ? React.cloneElement(components.strong, { key: i }, part) : part))}</>
    );
  },
}));

describe('Workspace2ClosePromptModal', () => {
  it('renders a sentence with the bolded workspace title when one workspace is affected', () => {
    render(
      <Workspace2ClosePromptModal
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        affectedWorkspaceTitles={['Add drug order']}
      />,
    );

    expect(screen.getByText('Discard unsaved changes?')).toBeInTheDocument();
    expect(screen.getByText('Add drug order')).toBeInTheDocument();
    expect(screen.getByText('Add drug order').tagName).toBe('STRONG');
    expect(screen.getByText(/has unsaved changes\. Closing it will discard them\./)).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('renders a count and a list of bolded workspace titles when multiple workspaces are affected', () => {
    render(
      <Workspace2ClosePromptModal
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        affectedWorkspaceTitles={['Add drug order', 'Visit note', 'Record vitals']}
      />,
    );

    expect(screen.getByText('Discard unsaved changes?')).toBeInTheDocument();
    expect(
      screen.getByText('3 workspaces have unsaved changes. Closing them will discard the changes:'),
    ).toBeInTheDocument();
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);
    expect(listItems.map((item) => item.textContent)).toEqual(['Add drug order', 'Visit note', 'Record vitals']);
    for (const title of ['Add drug order', 'Visit note', 'Record vitals']) {
      expect(screen.getByText(title).tagName).toBe('STRONG');
    }
  });

  it('calls onCancel when clicking "Keep editing"', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(
      <Workspace2ClosePromptModal
        onConfirm={vi.fn()}
        onCancel={onCancel}
        affectedWorkspaceTitles={['Add drug order']}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Keep editing' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when clicking the header close button', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(
      <Workspace2ClosePromptModal
        onConfirm={vi.fn()}
        onCancel={onCancel}
        affectedWorkspaceTitles={['Add drug order']}
      />,
    );

    await user.click(screen.getByRole('button', { name: /close/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when clicking "Discard changes"', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <Workspace2ClosePromptModal
        onConfirm={onConfirm}
        onCancel={vi.fn()}
        affectedWorkspaceTitles={['Add drug order']}
      />,
    );

    await user.click(screen.getByRole('button', { name: /discard changes/i }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
