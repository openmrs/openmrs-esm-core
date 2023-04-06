import "@testing-library/jest-dom";

declare global {
  interface Window {
    openmrsBase: string;
    spaBase: string;
    getOpenmrsSpaBase: () => string;
  }
}

window.openmrsBase = "/openmrs";
window.spaBase = "/spa";
window.getOpenmrsSpaBase = () => "/openmrs/spa/";
window.HTMLElement.prototype.scrollIntoView = jest.fn();
