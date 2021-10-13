import "@testing-library/jest-dom/extend-expect";

window.openmrsBase = "/openmrs";
window.spaBase = "/spa";
window.getOpenmrsSpaBase = () => "/openmrs/spa/";
const { getComputedStyle } = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);
