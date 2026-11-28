export type CardSide = 'below' | 'above' | 'right' | 'left' | 'corner';

export interface Box {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface Bounds {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface CardPosition {
  side: CardSide;
  top: number;
  left: number;
  maxHeight: number;
}

/** Room a side needs before the card is put there, so it can grow when a section is expanded. */
const comfortableHeight = 320;
const minimumHeight = 120;

/**
 * Keeps a card at `held` rather than next to its target, moving it only as far as it takes to fit
 * the card's width, and a small card's height, inside `bounds`.
 */
export function getHeldCardPosition(held: { top: number; left: number }, card: { width: number }, bounds: Bounds) {
  const top = Math.max(bounds.top, Math.min(held.top, bounds.bottom - minimumHeight));
  const left = Math.max(bounds.left, Math.min(held.left, bounds.right - card.width));
  return { top, left, maxHeight: bounds.bottom - top };
}

/**
 * Places a card next to its target: below, then above, then to the right, then to the left,
 * taking the first side with room for the card to grow, or failing that the side with the most
 * room. When no side has room for even a small card, it goes in the bottom-right corner of `bounds`.
 *
 * The card touches its target: any gap between them is background the pointer has to cross on its
 * way to the card, which would retarget it. Above the target, it covers the target's name tag.
 *
 * Pass the side returned for the previous position of the same target as `stickToSide`: a card
 * whose contents grow then keeps its place, and is given a `maxHeight` to scroll within instead of
 * moving. A card above its target, or in the corner, grows upwards. It also keeps its side when the
 * target scrolls out of `bounds`, following the target out of view rather than leaving it.
 *
 * All values are in the same coordinate space, normally the viewport's.
 *
 * @param target The box of the element the card describes.
 * @param card The card's width and its full content height.
 * @param bounds The area the card must stay inside.
 * @param stickToSide The side to keep, if the card is being re-placed for the same target.
 */
export function getCardPosition(
  target: Box,
  card: { width: number; height: number },
  bounds: Bounds,
  stickToSide?: CardSide,
): CardPosition {
  const targetBottom = target.top + target.height;
  const targetRight = target.left + target.width;
  const clampLeft = (left: number) => Math.max(bounds.left, Math.min(left, bounds.right - card.width));
  const fullHeight = bounds.bottom - bounds.top;
  // A target running past the bounds, for example under the implementer tools' panel, is only
  // described from the part of it inside them.
  const aboveBottom = Math.min(target.top, bounds.bottom);
  const besideTop = Math.max(target.top, bounds.top);

  const room: Record<Exclude<CardSide, 'corner'>, number> = {
    below: bounds.bottom - targetBottom,
    above: aboveBottom - bounds.top,
    right: targetRight + card.width <= bounds.right ? bounds.bottom - besideTop : -1,
    left: target.left - card.width >= bounds.left ? bounds.bottom - besideTop : -1,
  };

  // A side that has since lost its room, for example to the implementer tools' panel opening, is
  // given up rather than kept.
  const side =
    stickToSide && (stickToSide === 'corner' || room[stickToSide] >= minimumHeight)
      ? stickToSide
      : pickSide(room, Math.max(card.height, comfortableHeight));

  switch (side) {
    case 'below': {
      const top = targetBottom;
      return { side, top, left: clampLeft(target.left), maxHeight: Math.max(room.below, minimumHeight) };
    }
    case 'above': {
      const maxHeight = Math.max(room.above, minimumHeight);
      const top = aboveBottom - Math.min(card.height, maxHeight);
      return { side, top, left: clampLeft(target.left), maxHeight };
    }
    case 'right':
    case 'left': {
      const left = side === 'right' ? targetRight : target.left - card.width;
      return { side, top: besideTop, left, maxHeight: Math.max(room[side], minimumHeight) };
    }
    default: {
      const height = Math.min(card.height, fullHeight);
      return { side: 'corner', top: bounds.bottom - height, left: bounds.right - card.width, maxHeight: fullHeight };
    }
  }
}

function pickSide(room: Record<Exclude<CardSide, 'corner'>, number>, wanted: number): CardSide {
  const sides = ['below', 'above', 'right', 'left'] as const;
  const roomy = sides.find((side) => room[side] >= wanted);
  if (roomy) {
    return roomy;
  }

  const best = sides.reduce((a, b) => (room[b] > room[a] ? b : a));
  return room[best] >= minimumHeight ? best : 'corner';
}
