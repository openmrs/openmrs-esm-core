import { afterEach, describe, expect, it, vi } from 'vitest';

describe('svg sprite container', () => {
  afterEach(() => {
    document.getElementById('omrs-svgs-container')?.remove();
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it('is added to the document before the window load event fires', async () => {
    vi.spyOn(document, 'readyState', 'get').mockReturnValue('interactive');

    await import('./svg-utils');

    expect(document.getElementById('omrs-svgs-container')).toBeInTheDocument();
  });

  it('makes flushed svgs available in the document before the window load event fires', async () => {
    vi.spyOn(document, 'readyState', 'get').mockReturnValue('interactive');

    const { addSvg, flushSvgs } = await import('./svg-utils');
    addSvg('omrs-icon-test', '<svg><path d="M0 0" /></svg>');
    flushSvgs();

    expect(document.getElementById('omrs-icon-test')).toBeInTheDocument();
  });

  it('is added once on DOMContentLoaded when the module loads before the body exists', async () => {
    vi.spyOn(document, 'readyState', 'get').mockReturnValue('loading');
    const bodySpy = vi.spyOn(document, 'body', 'get').mockReturnValue(null as unknown as HTMLElement);

    await import('./svg-utils');
    bodySpy.mockRestore();
    expect(document.getElementById('omrs-svgs-container')).not.toBeInTheDocument();

    document.dispatchEvent(new Event('DOMContentLoaded'));
    document.dispatchEvent(new Event('DOMContentLoaded'));

    expect(document.querySelectorAll('#omrs-svgs-container')).toHaveLength(1);
  });
});
