/* eslint-disable testing-library/no-node-access -- the svg sprite container lives outside the React tree */
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { MaybeIcon } from './icons';

function createSvgContainer() {
  const container = document.createElement('div');
  container.id = 'omrs-svgs-container';
  return container;
}

function createSprite(id: string) {
  const sprite = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  sprite.id = id;
  return sprite;
}

function renderMaybeIcon(icon: string) {
  render(
    <span data-testid={`slot-${icon}`}>
      <MaybeIcon icon={icon} fallback={<span>no {icon}</span>} />
    </span>,
  );
}

function expectIconRendered(icon: string) {
  expect(screen.queryByText(`no ${icon}`)).not.toBeInTheDocument();
  expect(screen.getByTestId(`slot-${icon}`).innerHTML).toContain(`href="#${icon}"`);
}

describe('MaybeIcon', () => {
  afterEach(() => {
    document.getElementById('omrs-svgs-container')?.remove();
  });

  it('renders the icon when the sprite is already available', () => {
    const container = createSvgContainer();
    container.appendChild(createSprite('omrs-icon-test'));
    document.body.appendChild(container);

    renderMaybeIcon('omrs-icon-test');

    expectIconRendered('omrs-icon-test');
  });

  it('renders the fallback when the sprite is not available', () => {
    document.body.appendChild(createSvgContainer());

    renderMaybeIcon('omrs-icon-missing');

    expect(screen.getByText('no omrs-icon-missing')).toBeInTheDocument();
  });

  it('renders the icon when the sprite is added to the container after mount', async () => {
    const container = createSvgContainer();
    document.body.appendChild(container);
    renderMaybeIcon('omrs-icon-test');
    expect(screen.getByText('no omrs-icon-test')).toBeInTheDocument();

    await act(async () => {
      container.appendChild(createSprite('omrs-icon-test'));
    });

    expectIconRendered('omrs-icon-test');
  });

  it('renders the icon when the sprite container is added to the document after mount', async () => {
    renderMaybeIcon('omrs-icon-test');
    expect(screen.getByText('no omrs-icon-test')).toBeInTheDocument();

    const container = createSvgContainer();
    container.appendChild(createSprite('omrs-icon-test'));
    await act(async () => {
      document.body.appendChild(container);
    });
    expectIconRendered('omrs-icon-test');

    // Sprites flushed into the container afterwards are picked up as well.
    renderMaybeIcon('omrs-icon-later');
    await act(async () => {
      container.appendChild(createSprite('omrs-icon-later'));
    });
    expectIconRendered('omrs-icon-later');
  });
});
