/* The svg container is a div that contains all the OpenMRS svgs, with
 * an HTML id that can be referenced with the following code:
 * <svg role="img">
 *   <use link:href="#the-svg-id"></use>
 * </svg>
 *
 * This approach is known as "svg sprites"
 */
const svgContainer = document.createElement("div");
const appendContainer = () => {
  document.body.appendChild(svgContainer);
};
svgContainer.id = "omrs-svgs-container";
svgContainer.style.display = "none";

if (document.readyState === "complete") {
  appendContainer();
} else {
  window.addEventListener("load", appendContainer);
}

export function addSvg(htmlId: string, svgString: string) {
  const domParser = new DOMParser();
  const dom = domParser.parseFromString(svgString, "text/html");
  const svgElement = dom.querySelector("svg");

  if (svgElement) {
    svgElement.id = htmlId;
    svgContainer.appendChild(svgElement);
  }
}
