import React, { act } from 'react';
import { beforeEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditorView } from '@codemirror/view';
import { clearConfigErrors, temporaryConfigStore } from '@openmrs/esm-framework/src/internal';
import JsonEditor from './json-editor.component';

function getEditorText(container: HTMLElement) {
  return Array.from(container.querySelectorAll('.cm-line'), (line) => line.textContent).join('\n');
}

function setEditorText(text: string) {
  const view = EditorView.findFromDOM(screen.getByRole('textbox', { name: /json configuration editor/i }))!;
  act(() => view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: text } }));
}

describe('JsonEditor', () => {
  beforeEach(() => {
    temporaryConfigStore.setState({ config: {} });
  });

  it('submits the config it was opened with when nothing has been edited', async () => {
    const user = userEvent.setup();
    const config = { '@openmrs/esm-login-app': { logo: { src: 'logo.png' } } };
    temporaryConfigStore.setState({ config });

    render(<JsonEditor height="20rem" />);
    await user.click(screen.getByRole('button', { name: /update config/i }));

    expect(clearConfigErrors).toHaveBeenCalled();
    expect(screen.queryByText(/JSON/)).not.toBeInTheDocument();
    expect(temporaryConfigStore.getState().config).toEqual(config);
  });

  it.each(['null', '[]', '"text"', '42'])('rejects %s, which is not a config object', async (text) => {
    const user = userEvent.setup();
    const config = { '@openmrs/esm-login-app': { chooseLocation: false } };
    temporaryConfigStore.setState({ config });
    render(<JsonEditor height="20rem" />);

    setEditorText(text);
    await user.click(screen.getByRole('button', { name: /update config/i }));

    expect(temporaryConfigStore.getState().config).toEqual(config);
    expect(screen.getByText('The configuration must be a JSON object.')).toBeInTheDocument();
  });

  it('submits on Mod-Enter', () => {
    temporaryConfigStore.setState({ config: { '@openmrs/esm-login-app': {} } });
    const { container } = render(<JsonEditor height="20rem" />);
    const modifier = /Mac/.test(navigator.platform) ? { metaKey: true } : { ctrlKey: true };

    fireEvent.keyDown(screen.getByRole('textbox', { name: /json configuration editor/i }), {
      key: 'Enter',
      keyCode: 13,
      ...modifier,
    });

    expect(clearConfigErrors).toHaveBeenCalled();
    expect(getEditorText(container)).not.toMatch(/^\s*$/m);
  });

  it('shows config changes made elsewhere', () => {
    temporaryConfigStore.setState({ config: {} });
    const { container } = render(<JsonEditor height="20rem" />);

    act(() => temporaryConfigStore.setState({ config: { '@openmrs/esm-login-app': { chooseLocation: false } } }));

    expect(JSON.parse(getEditorText(container))).toEqual({ '@openmrs/esm-login-app': { chooseLocation: false } });
  });

  it('keeps unsubmitted edits when the config is changed elsewhere', () => {
    const { container } = render(<JsonEditor height="20rem" />);

    setEditorText('{\n  "@openmrs/esm-login-app": { "logo": { "src": "draft.png" } }\n}');
    act(() => temporaryConfigStore.setState({ config: { '@openmrs/esm-home-app': {} } }));

    expect(getEditorText(container)).toContain('draft.png');
    expect(screen.getByText('The configuration was changed elsewhere.')).toBeInTheDocument();
  });

  it('replaces unsubmitted edits, and the parse error they caused, on reload', async () => {
    const user = userEvent.setup();
    const { container } = render(<JsonEditor height="20rem" />);

    setEditorText('{"@openmrs/esm-login-app": ');
    await user.click(screen.getByRole('button', { name: /update config/i }));
    expect(screen.getByText(/JSON/)).toBeInTheDocument();

    act(() => temporaryConfigStore.setState({ config: { '@openmrs/esm-login-app': { chooseLocation: false } } }));
    await user.click(screen.getByRole('button', { name: 'Discard my edits and reload' }));

    expect(JSON.parse(getEditorText(container))).toEqual({ '@openmrs/esm-login-app': { chooseLocation: false } });
    expect(screen.queryByText(/JSON/)).not.toBeInTheDocument();
    expect(screen.queryByText('The configuration was changed elsewhere.')).not.toBeInTheDocument();
  });

  it('submits unsubmitted edits over a config changed elsewhere', async () => {
    const user = userEvent.setup();
    render(<JsonEditor height="20rem" />);

    setEditorText('{ "@openmrs/esm-login-app": { "chooseLocation": true } }');
    act(() => temporaryConfigStore.setState({ config: { '@openmrs/esm-home-app': {} } }));
    await user.click(screen.getByRole('button', { name: /update config/i }));

    expect(temporaryConfigStore.getState().config).toEqual({ '@openmrs/esm-login-app': { chooseLocation: true } });
    expect(screen.queryByText('The configuration was changed elsewhere.')).not.toBeInTheDocument();
  });
});
