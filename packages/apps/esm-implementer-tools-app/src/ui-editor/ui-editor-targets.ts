import { type ExtensionRendering } from '@openmrs/esm-framework/src/internal';

/** The attribute `ExtensionSlot` puts on its root element. */
const slotNameAttribute = 'data-extension-slot-name';
/** The attribute the framework puts on the element an extension is rendered into. */
const renderingIdAttribute = 'data-extension-rendering-id';
const implementerToolsAttribute = 'data-openmrs-implementer-tools';

export interface SlotTarget {
  kind: 'slot';
  element: HTMLElement;
  slotName: string;
  moduleName: string;
}

export interface ExtensionTarget {
  kind: 'extension';
  element: HTMLElement;
  /** The extension's name plus its `#`-suffix, if it has one. */
  extensionId: string;
  extensionName: string;
  /** The module that registered the extension, when its rendering is still known. */
  moduleName?: string;
}

export type UiEditorTarget = SlotTarget | ExtensionTarget;

export type RenderingLookup = (renderingId: string) => ExtensionRendering | undefined;

/**
 * Lists the slots and extensions that enclose `element`, innermost first. An element inside the
 * implementer tools' own UI has none, so that the tools never inspect themselves.
 *
 * @param lookupRendering Resolves a rendering ID to the rendering's record, which is where an
 *   extension's module comes from.
 */
export function getTargetChain(element: Element | null, lookupRendering: RenderingLookup): Array<UiEditorTarget> {
  const chain: Array<UiEditorTarget> = [];
  if (!element || element.closest(`[${implementerToolsAttribute}]`)) {
    return chain;
  }

  for (let node: Element | null = element; node; node = node.parentElement) {
    if (!(node instanceof HTMLElement)) {
      continue;
    }

    const renderingId = node.getAttribute(renderingIdAttribute);
    if (renderingId) {
      chain.push(toExtensionTarget(node, renderingId, lookupRendering));
    }

    const slotName = node.getAttribute(slotNameAttribute);
    if (slotName) {
      chain.push(toSlotTarget(node, slotName));
    }
  }

  return chain;
}

/** The slot that `chain[index]` is rendered in, if there is one. */
export function getEnclosingSlot(chain: Array<UiEditorTarget>, index: number): SlotTarget | undefined {
  return chain.slice(index + 1).find((target): target is SlotTarget => target.kind === 'slot');
}

/** The extensions rendered directly in a slot, not those in slots nested inside them. */
export function getSlotExtensions(slotElement: HTMLElement): Array<HTMLElement> {
  return Array.from(slotElement.querySelectorAll<HTMLElement>(`[${renderingIdAttribute}]`)).filter(
    (extensionElement) => extensionElement.parentElement?.closest(`[${slotNameAttribute}]`) === slotElement,
  );
}

/** The slots rendered directly in an extension, including empty ones, which cannot be hovered. */
export function getExtensionSlots(extensionElement: HTMLElement): Array<HTMLElement> {
  return Array.from(extensionElement.querySelectorAll<HTMLElement>(`[${slotNameAttribute}]`)).filter(
    (slotElement) => slotElement.parentElement?.closest(`[${renderingIdAttribute}]`) === extensionElement,
  );
}

const elementKeys = new WeakMap<HTMLElement, number>();
let nextElementKey = 0;

/**
 * Identifies a target by the element it describes, so that a change of target can be told from a
 * re-render. Copies of the same slot or extension, such as one per row of a list, differ.
 */
export function getTargetKey(target: UiEditorTarget) {
  let elementKey = elementKeys.get(target.element);
  if (elementKey === undefined) {
    elementKey = nextElementKey++;
    elementKeys.set(target.element, elementKey);
  }
  return `${target.kind}:${elementKey}`;
}

function toSlotTarget(element: HTMLElement, slotName: string): SlotTarget {
  return {
    kind: 'slot',
    element,
    slotName,
    moduleName: element.getAttribute('data-extension-slot-module-name') ?? '',
  };
}

function toExtensionTarget(
  element: HTMLElement,
  renderingId: string,
  lookupRendering: RenderingLookup,
): ExtensionTarget {
  const rendering = lookupRendering(renderingId);
  const extensionId = rendering?.extensionId ?? element.getAttribute('data-extension-id') ?? renderingId;

  return {
    kind: 'extension',
    element,
    extensionId,
    extensionName: rendering?.extensionName ?? extensionId.split('#')[0],
    moduleName: rendering?.extensionModuleName,
  };
}
