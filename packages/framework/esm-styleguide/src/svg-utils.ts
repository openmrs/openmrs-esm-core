/* The svg container is a div that contains all the OpenMRS svgs, with
 * an HTML id that can be referenced with the following code:
 * <svg role="img">
 *   <use link:href="#the-svg-id"></use>
 * </svg>
 *
 * This approach is known as "svg sprites"
 */
const svgContainer = document.createElement('div');
const appendContainer = () => {
  document.body.appendChild(svgContainer);
};
svgContainer.id = 'omrs-svgs-container';
svgContainer.style.display = 'none';

if (document.readyState === 'complete') {
  appendContainer();
} else {
  window.addEventListener('load', appendContainer);
}

const queue: Array<{ id: string; svg: string }> = [];
let flushed = false;

/**
 * Adds an SVG to the global SVG sprite container, making it available for use
 * throughout the application via SVG use references.
 *
 * @param htmlId The HTML ID to assign to the SVG element. This ID can be referenced
 *   in other parts of the application using `<svg><use href="#htmlId"></use></svg>`.
 * @param svgString The SVG markup as a string to be added to the sprite container.
 *
 * @category UI
 */
export function addSvg(htmlId: string, svgString: string) {
  if (!flushed) {
    queue.push({ id: htmlId, svg: svgString });
    return;
  }

  // Late additions after flush: parse individually
  const domParser = new DOMParser();
  const dom = domParser.parseFromString(svgString, 'image/svg+xml');
  const svgElement = dom.querySelector('svg');

  if (svgElement) {
    svgElement.id = htmlId;
    svgContainer.appendChild(svgElement);
  }
}

/**
 * Parses all queued SVGs in a single DOMParser call and appends them to the
 * sprite container. Must be called once after all setup*() registration calls.
 */
export function flushSvgs() {
  if (flushed) {
    return;
  }

  flushed = true;

  if (queue.length === 0) {
    return;
  }

  // Concatenate all SVG strings and parse in a single DOMParser call
  const html = queue.map(({ svg }) => svg).join('');
  const domParser = new DOMParser();
  const doc = domParser.parseFromString(`<body>${html}</body>`, 'text/html');
  const svgs = doc.body.querySelectorAll(':scope > svg');

  // Assign IDs by matching queue order to parsed element order
  for (let i = 0; i < svgs.length; i++) {
    svgs[i].id = queue[i].id;
    svgContainer.appendChild(svgContainer.ownerDocument.importNode(svgs[i], true));
  }

  queue.length = 0;
}
