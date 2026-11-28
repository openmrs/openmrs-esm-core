import { describe, expect, it } from 'vitest';
import { getCardPosition, getHeldCardPosition } from './card-position';

const bounds = { top: 0, left: 0, right: 1200, bottom: 800 };
const card = { width: 360, height: 200 };

describe('getCardPosition', () => {
  it('goes below a target with room underneath, touching it', () => {
    const position = getCardPosition({ top: 100, left: 300, width: 200, height: 50 }, card, bounds);

    expect(position).toMatchObject({ side: 'below', top: 150, left: 300 });
  });

  it('goes above a target near the bottom, touching it', () => {
    const position = getCardPosition({ top: 600, left: 300, width: 200, height: 150 }, card, bounds);

    expect(position.side).toBe('above');
    expect(position.top + card.height).toBe(600);
  });

  it('goes beside a target too tall to leave room above or below, touching it', () => {
    const position = getCardPosition({ top: 60, left: 0, width: 220, height: 700 }, card, bounds);

    expect(position).toMatchObject({ side: 'right', top: 60, left: 220 });
  });

  it('goes to the left of a target with no room on its right, touching it', () => {
    const position = getCardPosition({ top: 60, left: 800, width: 220, height: 700 }, card, bounds);

    expect(position).toMatchObject({ side: 'left', top: 60, left: 800 - card.width });
  });

  it('prefers a side with room to grow over one that only fits the card as it is', () => {
    // 250px below fits the card's 200px, but not the room it needs once a section is expanded.
    const position = getCardPosition({ top: 500, left: 0, width: 220, height: 44 }, card, bounds);

    expect(position.side).toBe('above');
  });

  it('keeps its side as it grows, scrolling rather than moving', () => {
    const target = { top: 60, left: 0, width: 220, height: 700 };
    const first = getCardPosition(target, card, bounds);
    const grown = getCardPosition(target, { ...card, height: 900 }, bounds, first.side);

    expect(grown).toMatchObject({ side: first.side, top: first.top, maxHeight: bounds.bottom - first.top });
  });

  it('stays inside the bounds horizontally', () => {
    const position = getCardPosition({ top: 100, left: 1100, width: 80, height: 40 }, card, bounds);

    expect(position.left + card.width).toBeLessThanOrEqual(bounds.right);
  });

  it('falls back to the corner rather than squeezing into a sliver of room', () => {
    // A tall target running under the bottom of the bounds, leaving 18px above it.
    const position = getCardPosition({ top: 40, left: 250, width: 1000, height: 900 }, card, bounds);

    expect(position.side).toBe('corner');
    expect(position.top).toBeGreaterThanOrEqual(bounds.top);
  });

  it('gives up a side that has lost its room', () => {
    const target = { top: 100, left: 300, width: 200, height: 50 };
    const first = getCardPosition(target, card, bounds);
    const shrunk = getCardPosition(target, card, { ...bounds, bottom: 200 }, first.side);

    expect(first.side).toBe('below');
    expect(shrunk.side).not.toBe('below');
  });

  it('falls back to the corner when no side has any room', () => {
    const position = getCardPosition({ top: 0, left: 0, width: 1200, height: 800 }, card, bounds);

    expect(position).toMatchObject({
      side: 'corner',
      left: bounds.right - card.width,
      top: bounds.bottom - card.height,
    });
  });

  it('keeps a card beside its target in place as it grows', () => {
    const target = { top: 300, left: 0, width: 220, height: 480 };
    const first = getCardPosition(target, { ...card, height: 100 }, bounds);
    const grown = getCardPosition(target, { ...card, height: 600 }, bounds, first.side);

    expect(first.side).toBe('right');
    expect(grown).toMatchObject({ side: 'right', top: first.top });
  });

  it('stays inside the bounds when the target is below them', () => {
    const shortBounds = { ...bounds, bottom: 442 };
    const position = getCardPosition({ top: 700, left: 300, width: 200, height: 40 }, card, shortBounds);

    expect(position.top + Math.min(card.height, position.maxHeight)).toBeLessThanOrEqual(shortBounds.bottom);
  });

  it('stays inside the bounds when they shrink above a target it was placed above', () => {
    const target = { top: 700, left: 300, width: 200, height: 40 };
    const first = getCardPosition(target, card, bounds);
    const shortBounds = { ...bounds, bottom: 442 };
    const position = getCardPosition(target, card, shortBounds, first.side);

    expect(first.side).toBe('above');
    expect(position.top + Math.min(card.height, position.maxHeight)).toBeLessThanOrEqual(shortBounds.bottom);
  });
});

describe('getHeldCardPosition', () => {
  it('keeps a held card inside the bounds when they narrow', () => {
    const position = getHeldCardPosition({ top: 100, left: 800 }, card, { ...bounds, right: 900 });

    expect(position.left + card.width).toBeLessThanOrEqual(900);
  });
});
