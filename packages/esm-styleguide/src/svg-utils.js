/* The svg container is a div that contains all the OpenMRS svgs, with
 * an HTML id that can be referenced with the following code:
 * <svg role="img">
 *   <use link:href="#the-svg-id"></use>
 * </svg>
 *
 * This approach is known as "svg sprites"
 */
const svgContainer = document.createElement("div");
svgContainer.id = "omrs-svgs-container";
svgContainer.style.display = "none";
document.body.appendChild(svgContainer);

export function addSvg(htmlId, svgString) {
  const domParser = new DOMParser();
  const dom = domParser.parseFromString(svgString, "text/html");
  const svgElement = dom.querySelector("svg");
  svgElement.id = htmlId;
  svgContainer.appendChild(svgElement);
}
