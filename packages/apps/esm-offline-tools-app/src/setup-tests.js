window.openmrsBase = '/openmrs';
window.spaBase = '/spa';
window.getOpenmrsSpaBase = () => '/openmrs/spa/';
const { getComputedStyle } = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);

jest.spyOn(console, 'error').mockImplementation((message, ...args) => {
  if (typeof message === 'string' && message.includes('Attempted to override the existing store')) {
    return;
  }
  console.warn(message, ...args);
});
